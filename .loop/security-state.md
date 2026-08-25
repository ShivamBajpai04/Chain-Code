# Chain-Code Security Loop State

## Findings (from PROJECT_AUDIT.md)
| # | Sev | Description | Status |
|---|-----|-------------|--------|
| 1 | CRIT | Vote propose/vote execute chain txs unauthenticated | ✅ FIXED — auth middleware on POST /propose, /vote (GET /state left public: read-only) |
| 2 | CRIT | GET /submissions/problem/:id leaks all source code | ✅ FIXED — auth required + source stripped unless owner; submissionTab shows "Sealed submission" card fallback |
| 3 | CRIT | GET /problems leaks hidden testcases | ✅ FIXED — .select("-testcases") on list, same as by-id |
| 4 | CRIT | Mint ownership+double-mint guard | 🔶 MOSTLY FIXED — ownership (403) + double-mint (409 with existing tx hash) added. Pass-gate deferred: server has no pass/fail record — judging is client-side Judge0; real gate arrives with server-side judging move. NEEDS-HUMAN-DECISION on timing |
| 5 | HIGH | Rate limiter keys undefined user id | pending |
| 6 | HIGH | IDOR on submissions; token logging | 🔶 PARTIAL — auth middleware now logs error type only, no tokens. IDOR on /submissions/:submissionId still pending |
| 7 | HIGH | Originality judge prompt-injectable, fails open | pending |
| 8 | HIGH | Poll create hangs; NaN votes | pending |
| 9 | HIGH | No admin roles on problem delete/update | pending |
| 10 | HIGH | Frontend /nft/:id logged-out access, double-submit races | pending |

Already fixed pre-loop: JWT expiry (7d), central error middleware.

## Iteration log
- Iter 2: finding #3 fixed via .select("-testcases") mirroring by-id endpoint. Finding #4: ownership + double-mint guards in mintNFT; pass-gate deferred NEEDS-HUMAN (server doesn't store pass status; fix properly = server-side judging per RESEARCH.md). Verified node --check ×2.
- Iter 1: findings #1, #2 (+partial #6). Verified: node --check on routes/vote.js, routes/submission.js, controllers/submissionController.js, middleware/auth.js; tsc clean. Frontend traced first: submissionTab.tsx renders submission.code in recent-submissions cards → added "Sealed submission" fallback when code absent. GET /state intentionally left public (read-only, no tx).

## Blockers / decisions
- None yet.
