# Chain-Code Security Loop State

## Findings (from PROJECT_AUDIT.md)
| # | Sev | Description | Status |
|---|-----|-------------|--------|
| 1 | CRIT | Vote propose/vote execute chain txs unauthenticated | ✅ FIXED — auth middleware on POST /propose, /vote (GET /state left public: read-only) |
| 2 | CRIT | GET /submissions/problem/:id leaks all source code | ✅ FIXED — auth required + source stripped unless owner; submissionTab shows "Sealed submission" card fallback |
| 3 | CRIT | GET /problems leaks hidden testcases | ✅ FIXED — .select("-testcases") on list, same as by-id |
| 4 | CRIT | Mint ownership+double-mint guard | 🔶 MOSTLY FIXED — ownership (403) + double-mint (409 with existing tx hash) added. Pass-gate deferred: server has no pass/fail record — judging is client-side Judge0; real gate arrives with server-side judging move. NEEDS-HUMAN-DECISION on timing |
| 5 | HIGH | Rate limiter keys undefined user id | ✅ FIXED — keys by req.user.user.id (real payload shape), falls back to req.ip so buckets can't collapse into one
| 6 | HIGH | IDOR on submissions; token logging | ✅ FIXED — getSubmissionById returns code:null for non-owners (certificate metadata stays viewable, matching public-verification product premise); dnft.tsx shows Sealed certificate card. Token logging fixed in iter 1
| 7 | HIGH | Originality judge prompt-injectable, fails open | ✅ FIXED — sanitized code blocks (delimiters stripped, assistant/verdict lines removed, 20k cap), hardened prompt, fail-CLOSED (503) with ORIGINALITY_FAIL_OPEN env override
| 8 | HIGH | Poll create hangs; NaN votes | ✅ FIXED — createPoll is a proper req/res handler with validation; vote maps option 0/1 → votes.agree/decline counters; voter push restored
| 9 | HIGH | No admin roles on problem delete/update | ✅ FIXED — User.role enum (user|admin), role in JWT payload, requireAdmin middleware on POST/PUT/DELETE /problems. Promote admin via db.users.updateOne({username},{$set:{role:'admin'}}). Pre-change tokens lack role → rejected → re-login
| 10 | HIGH | Frontend /nft/:id logged-out, double-submit races | ✅ ALREADY RESOLVED in current code — /nft/:id auth-gated in App.tsx; login/signup have isSubmitting guards + disabled buttons. Marked stale against audit snapshot

Already fixed pre-loop: JWT expiry (7d), central error middleware.

## Iteration log
- Iter 5: finding #9 — role system end-to-end; #10 verified already-resolved. .env.example created with all 23 env vars documented. Remaining: CI workflow + smoke tests (Testing & DX acceptance criteria).
- Iter 4: finding #7 — sanitizeForJudge + delimited prompt + fail-closed default. Finding #8 — poll create/vote rewritten as real handlers; note frontend currently uses /vote/* gov endpoints for actions, only GET /poll/all consumed, so no frontend changes needed. Verified node --check ×2.
- Iter 3: finding #5 — rateLimited(req.user?.user?.id || req.ip). Finding #6 — IDOR closed with owner-sees-code / others-get-null pattern; dnft.tsx renders "Sealed certificate" card (public verification via Etherscan link preserved per product premise). Verified node --check ×2 + tsc.
- Iter 2: finding #3 fixed via .select("-testcases") mirroring by-id endpoint. Finding #4: ownership + double-mint guards in mintNFT; pass-gate deferred NEEDS-HUMAN (server doesn't store pass status; fix properly = server-side judging per RESEARCH.md). Verified node --check ×2.
- Iter 1: findings #1, #2 (+partial #6). Verified: node --check on routes/vote.js, routes/submission.js, controllers/submissionController.js, middleware/auth.js; tsc clean. Frontend traced first: submissionTab.tsx renders submission.code in recent-submissions cards → added "Sealed submission" fallback when code absent. GET /state intentionally left public (read-only, no tx).

## Blockers / decisions
- None yet.
