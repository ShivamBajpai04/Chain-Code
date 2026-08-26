#!/usr/bin/env node
// Smoke tests against a running Chain-Code deployment.
// Usage: SMOKE_TARGET=https://chaincode-xi.vercel.app node smoke-test.mjs
// Exits non-zero on any failure. Safe checks only — no data mutation.
import { exit } from "node:process";

const BASE = process.env.SMOKE_TARGET || "http://localhost:5000";
let failures = 0;
const check = async (name, fn) => {
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    failures++;
    console.error(`✗ ${name}: ${e.message}`);
  }
};
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

await check("GET /api health returns ok", async () => {
  const r = await fetch(`${BASE}/api`);
  const j = await r.json();
  assert(r.status === 200 && j.ok === true, `status ${r.status}`);
});

await check("GET /problems does not leak testcases", async () => {
  const r = await fetch(`${BASE}/api/problems`);
  assert(r.status === 200, `status ${r.status}`);
  const list = await r.json();
  assert(Array.isArray(list) && list.length > 0, "empty problem list");
  assert(list.every((p) => !("testcases" in p)), "testcases leaked!");
});

await check("POST /vote/propose rejects unauthenticated calls", async () => {
  const r = await fetch(`${BASE}/api/vote/propose`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "x", description: "y", proposalId: "z" }),
  });
  assert(r.status === 401 || r.status === 403, `expected 401/403, got ${r.status}`);
});

await check("POST /vote/vote rejects unauthenticated calls", async () => {
  const r = await fetch(`${BASE}/api/vote/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ proposalId: "x", support: true }),
  });
  assert(r.status === 401 || r.status === 403, `expected 401/403, got ${r.status}`);
});

await check("POST /poll/create validates body", async () => {
  const r = await fetch(`${BASE}/api/poll/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  assert([400, 401].includes(r.status), `expected 400/401, got ${r.status}`);
});

console.log(failures ? `\n${failures} smoke failure(s)` : "\nAll smoke tests pass");
exit(failures ? 1 : 0);
