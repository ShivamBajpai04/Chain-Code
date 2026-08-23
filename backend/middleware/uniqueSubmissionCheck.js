import axios from "axios";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";

// ---------------------------------------------------------------------------
// Originality judge with multi-provider fallback.
// Order: GLM (z.ai direct) -> OpenRouter (GLM/Nemotron/free router)
//        -> Groq -> Gemini
// Each provider needs its key in backend/.env; missing keys are skipped.
// All non-Gemini providers share one OpenAI-compatible adapter.
// ---------------------------------------------------------------------------

const JUDGE_TIMEOUT_MS = 20_000;

const PROMPT = (code1, code2) =>
  `Return in one word, true or false. Assess if the algorithmically equivalent of the provided code snippets. Consider their data structures, techniques, and time complexities. Return 'true' if they are algorithmically same meaning after all the fuss they are similar at core, 'false' if they are not code 1: ${code1} code 2: ${code2}`;

// ---- provider adapters -----------------------------------------------------

// Strict verdict extraction. Free-tier models sometimes ramble or answer
// empty; anything we cannot read as an explicit true/false is a provider
// failure so the chain moves on instead of guessing "unique".
function extractVerdict(raw) {
  // reasoning models wrap their thinking in <think> tags or a reasoning field;
  // judge only on what remains after stripping it
  const text = raw.replace(/<think>[\s\S]*?<\/think>/g, " ").toLowerCase();
  const match = text.match(/\b(true|false)\b/g);
  if (!match) throw new Error(`unreadable verdict: "${text.slice(0, 60)}"`);
  // use the LAST explicit true/false in case a reasoning preamble mentions both
  return match[match.length - 1];
}

async function callGemini(prompt) {
  const { data } = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { contents: [{ parts: [{ text: prompt }] }] },
    { timeout: JUDGE_TIMEOUT_MS }
  );
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p) => p.text || "").join(" ").trim().toLowerCase();
  if (!text) throw new Error("empty gemini response");
  return extractVerdict(text);
}

async function callOpenAICompat({ baseUrl, apiKey, model }, prompt) {
  const { data } = await axios.post(
    `${baseUrl}/chat/completions`,
    {
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a code-similarity judge. Answer with exactly one word: true or false.",
        },
        { role: "user", content: prompt },
      ],
      // reasoning models spend tokens thinking before answering; too small a
      // budget returns empty content
      max_tokens: 600,
      temperature: 0,
    },
    {
      timeout: JUDGE_TIMEOUT_MS,
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );
  const msg = data?.choices?.[0]?.message ?? {};
  const text = `${msg.content || ""} ${msg.reasoning || ""}`.trim().toLowerCase();
  if (!text) throw new Error(`empty response from ${model}`);
  return extractVerdict(text);
}

// Ordered fallback chain; entries without keys are skipped silently.
function providers() {
  const list = [];
  if (process.env.ZAI_API_KEY) {
    // GLM direct from z.ai — pricing page lists GLM-4.7-Flash / GLM-4.6V-Flash
    // at $0 permanently (verified live). Service is sometimes overloaded
    // (429s/timeouts); the circuit breaker benches it when that happens and
    // the chain falls through.
    const zaiModels = [
      process.env.ZAI_MODEL || "glm-4.7-flash",
      "glm-4.6v-flash", // verified correct verdicts live; slower under load
    ];
    for (const model of zaiModels) {
      list.push({
        name: `zai/${model}`,
        run: (p) =>
          callOpenAICompat(
            {
              baseUrl: "https://api.z.ai/api/paas/v4",
              apiKey: process.env.ZAI_API_KEY,
              model,
            },
            p
          ),
      });
    }
  }
  if (process.env.OPENROUTER_API_KEY) {
    // `:free` slugs verified live on OpenRouter's public models API.
    // The last entry is a meta-router that picks any available free model.
    const openrouterModels = [
      "z-ai/glm-5.2:free", // reasoning model tuned for code (often rate-limited)
      "openrouter/free",   // verified correct on both test pairs; ~4.5s
      // removed nvidia/nemotron-3-super:free — misjudged identical code as
      // unique in testing (2026-08-23), which would let plagiarism through
    ];
    for (const model of openrouterModels) {
      list.push({
        name: `openrouter/${model}`,
        run: (p) =>
          callOpenAICompat(
            {
              baseUrl: "https://openrouter.ai/api/v1",
              apiKey: process.env.OPENROUTER_API_KEY,
              model,
            },
            p
          ),
      });
    }
  }
  if (process.env.GROQ_API_KEY) {
    // Verified free-plan models (console.groq.com/docs/rate-limits):
    // gpt-oss-120b / qwen3.6-27b @ 30 RPM, 1K requests/day
    list.push({
      name: "groq",
      run: (p) =>
        callOpenAICompat(
          {
            baseUrl: "https://api.groq.com/openai/v1",
            apiKey: process.env.GROQ_API_KEY,
            // qwen3.6-27b verified correct on both test pairs; gpt-oss-120b misjudged one
            model: process.env.GROQ_MODEL || "qwen/qwen3.6-27b",
          },
          p
        ),
    });
  }
  if (process.env.GEMINI_API_KEY) {
    list.push({
      name: "gemini",
      run: (p) => callGemini(p),
    });
  }
  return list;
}
// simple per-provider circuit breaker (in-process, resets on restart)
const downUntil = {};
const COOLDOWN_MS = 5 * 60 * 1000;

async function judgeVerdict(code1, code2) {
  const prompt = PROMPT(code1, code2);
  const errors = [];

  for (const provider of providers()) {
    if ((downUntil[provider.name] || 0) > Date.now()) continue;
    try {
      const verdict = await provider.run(prompt);
      console.log(`[uniqueCheck] ${provider.name} verdict: ${verdict}`);
      // verdict "true" = algorithmically similar = NOT unique
      return { unique: verdict !== "true", provider: provider.name };
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message;
      console.error(`[uniqueCheck] ${provider.name} failed:`, msg);
      errors.push(`${provider.name}: ${msg}`);
      downUntil[provider.name] = Date.now() + COOLDOWN_MS;
    }
  }

  const err = new Error(`all judges failed: ${errors.join(" | ")}`);
  err.allProvidersDown = true;
  throw err;
}

// --- middleware -------------------------------------------------------------

async function uniqueSubmissionCheck(req, res, next) {
  const { problemId, code } = req.body;
  try {
    const problem = await Problem.findOne({ _id: problemId });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const existingSubmissions = await Submission.find({
      _id: { $in: problem.submissions },
    });

    if (existingSubmissions.length === 0) {
      return next();
    }

    for (const submission of existingSubmissions) {
      if (req.params.id === submission._id?._id || req.params.id === String(submission._id)) {
        continue;
      }
      try {
        const { unique } = await judgeVerdict(code, submission.code);
        if (!unique) {
          return res.status(400).json({ message: "Submission is not unique" });
        }
      } catch (err) {
        if (err.allProvidersDown) {
          // fail-open so the product keeps working when every judge is down;
          // flip to fail-closed by returning 503 here instead.
          console.error("[uniqueCheck] all providers down, failing open");
          return next();
        }
        throw err;
      }
    }

    next();
  } catch (error) {
    console.error("Error in uniqueSubmissionCheck middleware:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default uniqueSubmissionCheck;
