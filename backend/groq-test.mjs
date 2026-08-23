import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
const KEY = process.env.GROQ_API_KEY;

function extractVerdict(raw) {
  // strip <think> blocks, then find explicit true/false words
  const text = raw.replace(/<think>[\s\S]*?<\/think>/g, " ").toLowerCase();
  const match = text.match(/\b(true|false)\b/g);
  if (!match) throw new Error(`unreadable verdict: "${raw.slice(0, 80)}"`);
  return match[match.length - 1];
}

async function judge(code1, code2, model) {
  const prompt = `Return in one word, true or false. Assess if the algorithmically equivalent of the provided code snippets. Consider their data structures, techniques, and time complexities. Return 'true' if they are algorithmically same meaning after all the fuss they are similar at core, 'false' if they are not code 1: ${code1} code 2: ${code2}`;
  const { data } = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    { model, messages: [
      { role: "system", content: "You are a code-similarity judge. Answer with exactly one word: true or false." },
      { role: "user", content: prompt } ], max_tokens: 600, temperature: 0 },
    { timeout: 30000, headers: { Authorization: `Bearer ${KEY}` } }
  );
  const msg = data?.choices?.[0]?.message ?? {};
  const raw = `${msg.content || ""} ${msg.reasoning || ""}`.trim();
  return { verdict: extractVerdict(raw), model: data?.model };
}

const hash = `function twoSum(nums, target) { const seen = new Map(); for (let i=0;i<nums.length;i++){ const need=target-nums[i]; if(seen.has(need)) return [seen.get(need), i]; seen.set(nums[i], i);} }`;
const brute = `for (let i=0;i<nums.length;i++) for (let j=i+1;j<nums.length;j++) if (nums[i]+nums[j]===target) return [i,j];`;

for (const model of ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"]) {
  try {
    let t0 = Date.now();
    let r = await judge(hash, brute, model);
    console.log(`[${model}] different -> "${r.verdict}" (${Date.now()-t0}ms) ${r.verdict !== "true" ? "✓" : "✗ WRONG"}`);
    t0 = Date.now();
    r = await judge(hash, hash, model);
    console.log(`[${model}] identical -> "${r.verdict}" (${Date.now()-t0}ms) ${r.verdict === "true" ? "✓" : "✗ WRONG"}`);
  } catch (e) {
    console.log(`[${model}] FAIL:`, e.message);
  }
}
