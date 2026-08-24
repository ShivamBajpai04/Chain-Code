# Research: code-execution engine & LLM fallback options

> Written Aug 2026 from model knowledge current to early 2025 + live API probing done during this session.
> Pricing/quota specifics drift constantly — verify before committing.

## Part 1 — Judge0: keep, host, or replace?

### Current setup (and its problems)

`frontend/src/utils/submitCode.ts` calls **Judge0 CE via RapidAPI** directly from the browser:

1. `VITE_JUDGE0_API_KEY` ships in the JS bundle → **anyone can extract it and burn your quota**. This is the most urgent issue regardless of which option you pick.
2. One RapidAPI submission per test case, polled serially → slow and quota-hungry.
3. RapidAPI free tier for judge0-ce is small (~50 req/day historically). A single demo day can exhaust it.

### Options compared

| Option | Cost | Effort | Reliability | Notes |
|---|---|---|---|---|
| **Stay on RapidAPI, move calls to backend** | ~free tier | hours | medium | Fix the key leak first. Backend batches test cases into one submission (stdin-driven driver) instead of N calls |
| **Self-host Judge0 CE** (official `docker-compose`) | $5–10/mo VPS (needs ~2GB RAM, Linux) | 1–2 days incl. HTTPS | high — it's the same engine RapidAPI resells | You become the operator: updates, uptime, queue tuning |
| **Piston** (public instance or self-host) | free (public, rate-limited) / VPS to self-host | hours | medium — public instance is community-run, no SLA | Lighter than Judge0, open source (MIT), good API. Easiest "free forever" path |
| **Sphere Engine / MetaCoder / HackerEarth APIs** | $$ commercial | hours | high | Overkill at this stage |
| **Build your own sandbox** | VPS + real security work | weeks | you own every failure | Not recommended (see below) |

### Should you build your own runner?

No — with one exception. Running untrusted user code safely means kernel-level isolation (`isolate`/cgroups/namespaces/seccomp), per-language toolchains, output/memory/time limits, fork bombs, and network escape. Judge0 already wraps exactly this (`isolate`). "Your own" would be rebuilding Judge0 badly.

The pragmatic middle ground that IS worth doing yourself: a thin **queue + result-cache layer** in your Go/Node backend so identical (problem, code) pairs don't re-execute, and test cases run in **one** submission via a generated driver script instead of N RapidAPI calls.

### Recommendation

1. **This week:** move the Judge0 call from `submitCode.ts` into the backend; delete `VITE_JUDGE0_API_KEY`. Batch test cases.
2. **Next:** stand up self-hosted Judge0 CE on a small VPS (official compose file works out of the box) OR add Piston as a second provider behind one interface.
3. Keep a tiny `ExecutionProvider` interface (`submit(code, lang, stdin) -> verdict`) so RapidAPI / self-hosted Judge0 / Piston are interchangeable and you can fail over.

---

## Part 2 — Free LLM fallbacks if Gemini fails

The originality check needs only a **binary verdict**, so almost any competent model works. Verified during this session: your Gemini key works, but `gemini-1.5-flash` is retired and even `gemini-2.5-flash-lite` is closed to new projects — model churn on the free tiers is real, so a fallback chain matters.

### Candidates

| Provider | Free offering | Good models for this task | Gotchas |
|---|---|---|---|
| **Google AI Studio** (current) | Generous free tier, per-minute + per-day caps on flash-lite/flash | `gemini-3.5-flash-lite`, `gemini-flash-latest` | Model names retire often; `thinkingConfig` rejected on some 3.x models |
| **Groq** | Free dev tier, very fast inference | `llama-3.3-70b-versatile`, `llama-3.1-8b-instant` | Daily token caps; low-rate limits |
| **OpenRouter** | Many `:free` model slugs (DeepSeek, Llama, Qwen) rotate through | `deepseek/deepseek-chat:free`, `meta-llama/*:free` | Free slugs change weekly; strict daily caps; queueing at peak |
| **Mistral La Plateforme** | Free experiment tier | `mistral-small-latest` | Requires opt-in to data training on free tier |
| **Cerebras** | Free tier, extremely fast | Llama 3.x family | Fewer models |
| **GitHub Models** | Free with GitHub PAT | `gpt-4o-mini`, `o4-mini`, llama etc. | Strict rate limits, "for evaluation" terms |
| **Hugging Face Inference** | Small free monthly credits | Qwen-Coder, DeepSeek-Coder variants | Serverless endpoints are cold/flaky |
| **Ollama (local)** | Free forever, offline | `qwen2.5-coder:7b`, `llama3.2` | Needs a machine with RAM/GPU where backend runs |

### Deep dive: each provider in detail

> Limits below are what I know from training data (early 2025) — Google/Groq/OpenRouter revise them quarterly. Verify on the provider's pricing page before relying on a number. What does NOT drift: the base URLs, auth style, and API shapes.

#### 1. Groq — first fallback (LIVE VERIFIED from console.groq.com/docs/rate-limits)

- Base URL: `https://api.groq.com/openai/v1/chat/completions` (OpenAI-compatible)
- Auth: `Authorization: Bearer gsk_...`
- **Free plan models changed**: `llama-3.3-70b` is no longer on the free plan. Current free-plan chat models (scraped live):
  - `openai/gpt-oss-120b` — 30 RPM / 1K requests/day / 200K tokens/day
  - `openai/gpt-oss-20b` — same caps
  - `qwen/qwen3.6-27b` — same caps
  - `groq/compound` + `compound-mini` — 30 RPM / 250 req/day / 70K TPM
- Still very fast (LPU inference); a 600-token prompt + 5-token verdict returns in well under a second
- Weakness: 1K requests/day means volume demos need the OpenRouter fallback behind it

#### 2. OpenRouter — breadth play

- Base URL: `https://openrouter.ai/api/v1/chat/completions` (OpenAI-compatible)
- Auth: `Authorization: Bearer sk-or-...`
- Any model tagged `:free` costs nothing; pool rotates (DeepSeek V3/R1, Llama 3.3, Qwen 2.5 Coder, Mistral variants have all appeared)
- Free-tier account limits: ~20 req/min, and a daily cap that scales with whether you've ever bought $10 of credits (buy once → ~1000 req/day on free models)
- Key trick: request a **fallback list** — OpenRouter supports `models: ["deepseek/deepseek-chat:free", "meta-llama/llama-3.3-70b-instruct:free"]` in one request and routes to whichever is up. That's an entire fallback chain inside one provider
- Weakness: free slugs are queuey at peak hours; don't build anything that must respond in <2s on them

#### 3. GitHub Models — most underrated

- Endpoint: `https://models.inference.ai.azure.com/chat/completions` (OpenAI-compatible)
- Auth: any GitHub PAT with `models:read`
- Free access to `gpt-4o-mini`, `o4-mini`, `DeepSeek-R1`, `Llama-3.3-70B`, `Mistral-small`, `Phi-4` behind per-minute/per-day caps tied to your Copilot plan tier
- GPT-4o-mini is arguably the best "cheap judge" model anywhere at this price (free)
- Weakness: caps are low (tens of requests/day on some tiers); explicitly evaluation-use terms; not for production traffic

#### 4. Mistral La Plateforme

- Base URL: `https://api.mistral.ai/v1/chat/completions` (OpenAI-compatible-ish)
- Free "experiment" tier requires opting into data-training; models: `mistral-small-latest`, `open-mistral-nemo`
- Decent quality for binary classification; EU-hosted if that ever matters
- Weakness: the training opt-in means don't send anything sensitive — code submissions are borderline acceptable

#### 5. Cerebras

- Base URL: `https://api.cerebras.ai/v1/chat/completions` (OpenAI-compatible)
- Free tier; wafer-scale inference = fastest tokens/sec in the industry (thousands/sec)
- Models: Llama 3.1 8B / 70B family mostly
- Weakness: small model catalog; capacity fluctuates

#### 6. Hugging Face Inference Providers

- Router endpoint bills across providers with a small free monthly credit (~$0.10/mo historically — tiny)
- Useful mainly for coder-specific open models (`Qwen2.5-Coder-32B`) not exposed elsewhere for free
- Weakness: credits run out mid-month; cold starts

#### 7. Ollama (local) — the zero-dependency floor

- Runs on the backend box: `ollama pull qwen2.5-coder:7b` (~4GB RAM at Q4)
- Verdict quality for this prompt is fine even at 7B; latency ~1–3s on CPU, sub-second on any GPU
- Zero network dependency, zero quota, zero cost. The catch: your backend runs on a laptop/VPS without GPU today
- Worth wiring anyway as the LAST link in the chain — if every cloud provider is down/rate-limited, submissions still work, just slower

#### 8. Paid-but-cheap insurance (not free, worth knowing)

- Gemini paid tier: flash-class models are tenths of a cent per 1000 judgments after free caps
- DeepSeek official API: pennies per million tokens; very strong reasoning
- If ChainCode ever has real users, $5/month covers judging forever. The free stack is for development/demo phase

### Fit-for-task scoring (originality judge)

| Provider | Quality | Speed | Quota | Setup effort | Total |
|---|---|---|---|---|---|
| Gemini flash-lite (current) | 8 | 8 | 7 | done | keep primary |
| Groq llama-3.3-70b | 8 | 9 | 6 | trivial (30 lines) | **first fallback** |
| OpenRouter :free w/ fallback list | 7 | 5 | 6 | trivial | second |
| GitHub Models gpt-4o-mini | 9 | 7 | 3 | trivial | third / manual testing |
| Ollama qwen2.5-coder:7b | 6 | 5 (CPU) | ∞ | moderate (install) | last resort |

### "Forever free" check (live probes this session)

| Provider | Verified status | Free allowance |
|---|---|---|
| OpenRouter `:free` slugs | ✅ public models API: 22 free models incl. `z-ai/glm-5.2:free`, nemotron family, `openrouter/free` router | ~20 req/min; daily cap rises permanently after a one-time $10 top-up |
| Groq | ✅ rate-limits page scraped: gpt-oss-120b/20b, qwen3.6-27b on free plan | 30 RPM, 1K req/day, 200K tokens/day |
| NVIDIA NIM (build.nvidia.com) | ✅ site advertises "Free serverless APIs" / free endpoints | credit-based (historically ~1K requests); model catalog rotates |
| Mistral La Plateforme | ⚠️ docs say "Free for a limited amount of time" experiment tier | not guaranteed forever; trains on your data |
| Cerebras | ✅ "$5 in free credit after creating an account" + a free tier with priority processing | credit then paid |
| Cloudflare Workers AI | ✅ free daily allocation exists (neurons-based) | 10K neurons/day historically — enough for small open models |
| Z.ai (GLM direct) | ✅ GLM-5.2 first-party API exists (`api.z.ai/api/paas/v4`); signup allocation | flash-tier models have historically been $0/flat-free |
| GitHub Models | known-good, not re-probed | low daily caps, evaluation-use terms |

### "Forever free" — live-verified limits table (probed provider pages this session)

| Provider | Forever-free offer | Verified limits | Status |
|---|---|---|---|
| **Z.ai GLM Flash** | `glm-4.7-flash` and `glm-4.6v-flash` listed at **$0 in / $0 out permanently** on the official pricing page | works with existing key; service currently overloaded (429s/timeouts between correct answers) | ✅ verified verdicts |
| **Cloudflare Workers AI** | 10,000 Neurons/day forever, no card | exact quote from pricing page: "free allocation allows anyone to use a total of 10,000 Neurons per day" | ✅ verified page text |
| **OpenRouter `:free` pool** | 22 models at $0/$0 (live count) | ~20 req/min; daily cap rises permanently after one-time $10 top-up | ✅ verified via public API |
| **Groq free plan** | gpt-oss-120b/20b, qwen3.6-27b | 30 RPM / 1K req/day / 200K tok/day per model (scraped rate-limits page) | ✅ verified |
| **Cerebras** | $5 credits on signup + a standing free tier with priority processing | credit amount confirmed; standing free-tier size not published | ⚠️ partially verified |
| **NVIDIA NIM** | "Free serverless APIs" for dev endpoints | credit count not published on reachable docs | ⚠️ unverified numbers |
| **GitHub Models** | free with any PAT | low daily caps, evaluation-use terms | known-good, not re-probed |

**Truly dependable "forever free" set:** Gemini AI Studio free tier + Z.ai GLM Flash + OpenRouter `:free` pool + Groq free plan + Cloudflare Workers AI. That's five independent companies giving permanent free capacity — thousands of judgments/day total, no card required.

Note: GLM direct was enabled in the middleware chain during this session using the existing key (`glm-4.7-flash` → `glm-4.6v-flash`); its current overload is handled by the circuit breaker + fallback to Groq/OpenRouter/Gemini.

### Reliability engineering beyond the chain

1. **Circuit breaker per provider**: after 3 consecutive failures, skip a provider for 5 minutes instead of burning 8s of timeout on every submission
2. **Verdict cache**: `sha256(norm(codeA)) + sha256(norm(codeB)) -> verdict`, persisted in Mongo. Identical re-submissions never re-bill
3. **Deterministic pre-filter first** (normalize whitespace/comments, lowercase, sort imports, hash): catches copy-paste cheats with zero API calls; only near-misses reach the LLM chain
4. **Fail-open flag**: env var `ORIGINALITY_FAIL_MODE=open|closed`. Demo day = open (submissions pass with an "unverified" badge); real operation = closed
5. **Log every verdict with provider name + latency** to Mongo so you can measure which fallback actually carries load

### Adapter sketch (one file covers Groq/OpenRouter/Mistral/Cerebras/GitHub Models)

```ts
// llm/providers.ts
const OPENAI_COMPAT = [
  { name: "groq",    baseUrl: "https://api.groq.com/openai/v1",              keyEnv: "GROQ_API_KEY",      model: "llama-3.3-70b-versatile" },
  { name: "openrouter", baseUrl: "https://openrouter.ai/api/v1",             keyEnv: "OPENROUTER_API_KEY",model: "deepseek/deepseek-chat:free" },
  { name: "mistral", baseUrl: "https://api.mistral.ai/v1",                   keyEnv: "MISTRAL_API_KEY",   model: "mistral-small-latest" },
];

export async function judgeWithFallback(prompt: string): Promise<string> {
  for (const p of providers()) {           // gemini first, then OPENAI_COMPAT entries with keys present
    try {
      return await callOnce(p, prompt);    // 15s timeout, single retry
    } catch { markDown(p.name); }          // circuit breaker
  }
  throw new Error("all providers down");
}
```

### LIVE VERIFIED (queried OpenRouter's public models API during this session)

OpenRouter currently lists **22 completely free models** out of 422 total. The standouts for a code-similarity judge:

| Model | Context | Why it matters |
|---|---|---|
| `z-ai/glm-5.2:free` | 256k | reasoning model tuned for code. ⚠️ often 429 rate-limited in practice (verified live) |
| ~~nvidia/nemotron-3-super~~ | — | REMOVED from chain: misjudged identical code as unique when tested live — dangerous for an originality gate |
| `nvidia/nemotron-3-ultra-550b-a55b:free` | 1M | Open frontier-class reasoning model, 55B active MoE — absurd that it's free |
| `nvidia/nemotron-3-super-120b-a12b:free` | 262k | 120B MoE, only 12B active = fast AND smart |
| `thinkingmachines/inkling:free` | 262k | Thinking Machines Lab's 975B MoE multimodal |
| `cohere/north-mini-code:free` | 256k | Cohere's agentic coding model, 30B MoE — purpose-built for code tasks |
| `nvidia/nemotron-3-nano-30b-a3b:free` | 256k | Tiny/efficient tier |
| `openrouter/free` | 200k | Meta-fallback: a router that picks any available free model for you |

Also verified directly with Z.ai's docs: **GLM-5.2 has its own first-party API** at `https://api.z.ai/api/paas/v4/chat/completions` (OpenAI-compatible) with a free allocation on signup — so GLM can be used either through OpenRouter or direct.

**Revised fallback order for ChainCode:**
```
glm direct (needs funded account) -> openrouter [z-ai/glm-5.2:free -> openrouter/free] -> groq (qwen3.6-27b) -> gemini-flash-lite
```
Implemented in `backend/middleware/uniqueSubmissionCheck.js`.

**Live-tested 2026-08-23 with all four real keys:**
- ✅ groq/qwen3.6-27b — correct on both test pairs, ~1s
- ✅ gemini-3.5-flash-lite — correct on both pairs, ~0.8s
- ✅ openrouter/free router — correct on both pairs, ~4.5s
- ⚠️ glm direct via z.ai — "Insufficient balance" on free key; recharge then set `ZAI_ENABLED=true` to activate
- ⚠️ openrouter/glm-5.2:free — 429 at test time; works intermittently
- ❌ nvidia/nemotron-3-super:free — removed from chain (wrong verdict on identical code)

Effective production order after testing: **groq → openrouter/free → gemini** (glm re-inserts first once funded).

Caveats that apply to ALL of these: `:free` slugs rotate without notice (check the models endpoint monthly), rate limits are per-account (~20 req/min, daily caps scale if you ever top up $10), and peak-hour queueing happens.

### Recommended design: fallback chain, one interface

```
checkOriginality(codeA, codeB):
  try providers in order until one returns a verdict:
    [ gemini-flash-lite  ->  groq/llama-3.3-70b  ->  openrouter/deepseek:free ]
  all failed -> FAIL OPEN or FAIL CLOSED (see below)
```

Implementation notes:

- Each provider adapter is ~30 lines (OpenAI-compatible chat completions cover Groq/OpenRouter/GitHub Models/Mistral/Cerebras with just a base-URL swap).
- Cache verdicts by `hash(codeA) + hash(codeB)` so retries don't double-spend quota.
- Decide **fail-open vs fail-closed explicitly**: currently a Gemini error throws → 500 (fail-closed, blocks all submissions). For a demo, consider fail-open with an "unverified" badge rather than blocking the core loop entirely.
- **Reliability idea worth more than any fallback:** pre-filter deterministically before calling any LLM. Normalize both snippets (strip comments/whitespace/rename idents) and hash-compare; only near-misses go to the LLM. This cuts API usage massively because most cheating is copy-paste.
- Longer term, the LLM-judge step is your weakest guarantee — an AST/structural similarity score (tree-sitter) plus LLM only for borderline cases is cheaper and harder to fool.

---

## Immediate action items

1. [ ] Move Judge0 calls server-side; remove `VITE_JUDGE0_API_KEY` from `.env` and the bundle
2. [ ] Add provider interface for execution + LLM with a fallback chain
3. [ ] Add deterministic normalize-and-hash pre-filter before the LLM check
4. [ ] Decide fail-open/fail-closed policy for the originality gate

---

## Holesky → Sepolia migration + sandbox mint problem (2026-08-23/24)

### What broke

Holesky (the testnet `API`/`CONTRACT_ADDRESS`/`GOV_CONTRACT_ADDRESS`/`VOTING_CONTRACT_ADDRESS`
were pointed at) was shut down by the Ethereum Foundation in September 2025. Every mint was
hanging or throwing `JsonRpcProvider failed to detect network`. Confirmed via Alchemy
(`ETH_HOLESKY is not enabled for this app`) and by trying three different Holesky block
explorers (Etherscan, Blockscout, Routescan) — all decommissioned or unreachable, so there's
no way to even inspect the old contracts anymore.

### What's fixed

- **NFT contract only** (governance/voting explicitly skipped for now — still pointed at the
  dead Holesky addresses, still broken, not touched).
- Contract source recovered from `github.com/smresponsibilities/NFTMINT` (`MyToken.sol`, plain
  OpenZeppelin 5.x ERC721 + Enumerable + URIStorage + Ownable — byte-identical to a local copy
  found in `Downloads/ether js/governance token 100%/MyToken.sol`).
- Same Alchemy API key works for Sepolia (`eth-holesky` → `eth-sepolia` in the URL, no
  dashboard changes needed). Deployer wallet already had testnet ETH, no faucet needed.
- Redeployed via a plain `solc` compile + `ethers.ContractFactory` deploy (no Hardhat/Foundry
  — mirrors the reference repo's own tooling). Scripts kept at `backend/scripts/deploy-nft/`
  (`MyToken.sol`, `compile.js`, `deploy.js`) as a record / for redeploying again if needed.
- New contract: `0x313fC618ddcC0912f7Ad1aB50E5e12C3AE2d046E` on Sepolia (chain id 11155111).
  Deploy cost 2,675,117 gas (~0.0029 ETH); a single mint costs ~198,600 gas (~0.0002 ETH) at
  current gas prices. Verified end-to-end with a real mint (`status: 1` receipt,
  `tokensOfOwner` returned the new token id).
- Fixed a related bug: `nftController.js`'s `tokenURI` was hardcoded to
  `localhost:5173/<submissionId>` (the app's old flat route, before `/nft/:id` existed) —
  every certificate's on-chain URI was already dead on mint. Now `localhost:5173/nft/<id>`.
- Fixed the class of bug that caused this: `.env`'s wallet checksum was never validated at
  signup, so a malformed address (random mixed case, not real EIP-55) could register and then
  crash every mint with `bad address checksum` and zero warning at signup time. Now
  `authController.js` validates + normalizes with `ethers.getAddress()` at registration.

### Sandbox mint problem

Added a seeded problem ("Sandbox: Mint Test", topic `Sandbox`, `skipUniqueCheck: true`) that
bypasses `uniqueSubmissionCheck`'s whole AI-judge chain — lets you test/demo the mint flow
without tripping the originality gate or burning judge quota on a trivial submission. Reachable
from the nav via "Try it yourself" (`/try`, resolves the sandbox problem dynamically rather
than hardcoding its id — stays correct across reseeds).

### Env vars — updated

`API` is now a Sepolia RPC URL (was Holesky); `CONTRACT_ADDRESS` is the new deploy above.
`GOV_CONTRACT_ADDRESS` / `VOTING_CONTRACT_ADDRESS` are unchanged (still Holesky, still dead) —
same treatment needed if governance/voting ever gets migrated too.

---

## Vercel deployment notes (2026-08-23)

Structure: two services — `frontend` (Vite) and `backend` (Express at `backend/api/index.js`).

Changes made:
- `backend/app.js` exports the Express app + cached `connectDB()`; no listen
- `backend/server.js` is local-dev only; `backend/api/index.js` is the serverless entry
- Mongoose connection cached on `globalThis` so warm invocations reuse it

Env vars to set in the Vercel dashboard:
- backend service: `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `GROQ_API_KEY`, `ZAI_API_KEY`, `API`, `CONTRACT_ADDRESS`, `PRIVATE_KEY`, `GOV_CONTRACT_ADDRESS`, `VOTING_CONTRACT_ADDRESS`
  - Do NOT set `PORT` (Vercel injects its own)
  - Do NOT put `.env` values in git
- frontend service: `VITE_DOMAIN=https://<backend-service-url>` (e.g. `https://chain-code-backend.vercel.app`), plus existing `VITE_JUDGE0_API_KEY`, `VITE_JUDGE0_HOST`

Known caveats:
1. Judge0 is still called from the browser with a RapidAPI key in the bundle — move to backend before any public launch
2. Serverless cold starts: first API hit after inactivity takes ~2–5s (Mongo connect); subsequent hits are fast
3. `dns.setServers(["8.8.8.8"])` kept — harmless on Vercel, needed locally for Atlas SRV resolution
4. If the `/api` rewrite path is used instead of the service URL, mount routes under `/api` or set `VITE_DOMAIN` to "" and change rewrites so `/auth`, `/problems` etc. route to the backend too
