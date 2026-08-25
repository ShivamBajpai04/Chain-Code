import Problem from "../models/Problem.js";
import { execute, ALLOWED_LANGUAGE_IDS } from "../services/execution/index.js";

// simple in-memory per-user rate limit. On serverless each warm invocation
// gets its own copy, so treat this as abuse damping rather than a hard quota.
const RATE_LIMIT_MAX = parseInt(process.env.EXECUTE_RATE_LIMIT || "20", 10);
const RATE_LIMIT_WINDOW_MS = 60_000;
const hits = new Map(); // userId -> [timestamps]

function rateLimited(userId) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (hits.get(userId) || []).filter((t) => t > windowStart);
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(userId, recent);
    return true;
  }
  recent.push(now);
  hits.set(userId, recent);
  return false;
}

const MAX_CODE_LENGTH = 100_000;

export const executeCode = async (req, res) => {
  try {
    if (rateLimited(req.user?.user?.id || req.ip)) {
      return res.status(429).json({ error: "Too many executions — slow down a moment." });
    }

    const { code, language } = req.body ?? {};
    if (typeof code !== "string" || code.length === 0) {
      return res.status(400).json({ error: "code is required" });
    }
    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({ error: "code is too large" });
    }
    if (!ALLOWED_LANGUAGE_IDS.has(language)) {
      return res.status(400).json({ error: "unsupported language" });
    }

    const problem = await Problem.findById(req.params.problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    if (!problem.testcases?.length) {
      return res.status(400).json({ error: "Problem has no test cases" });
    }

    // testcases never leave this function — expected outputs stay server-side
    const results = await execute(code, language, problem.testcases);

    res.json({ results });
  } catch (error) {
    console.error("executeCode error:", error.message);
    res.status(502).json({ error: "Code execution failed. Please try again." });
  }
};
