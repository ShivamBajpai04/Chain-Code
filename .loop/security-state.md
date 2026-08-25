# Chain-Code Security Loop State

## Findings (from PROJECT_AUDIT.md)
| # | Sev | Description | Status |
|---|-----|-------------|--------|
| 1 | CRIT | Vote propose/vote execute chain txs unauthenticated | ✅ FIXED — auth middleware on POST /propose, /vote (GET /state left public: read-only) |
| 2 | CRIT | GET /submissions/problem/:id leaks all source code | ✅ FIXED — auth required + source stripped unless owner; submissionTab shows "Sealed submission" card fallback |
| 3 | CRIT | GET /problems leaks hidden testcases | pending |
| 4 | CRIT | Mint without ownership/double-mint guard | pending |
| 5 | HIGH | Rate limiter keys undefined user id | pending |
| 6 | HIGH | IDOR on submissions; token logging | 🔶 PARTIAL — auth middleware now logs error type only, no tokens. IDOR on /submissions/:submissionId still pending |
| 7 | HIGH | Originality judge prompt-injectable, fails open | pending |
| 8 | HIGH | Poll create hangs; NaN votes | pending |
| 9 | HIGH | No admin roles on problem delete/update | pending |
| 10 | HIGH | Frontend /nft/:id logged-out access, double-submit races | pending |

Already fixed pre-loop: JWT expiry (7d), central error middleware.

## Iteration log
- Iter 1: findings #1, #2 (+partial #6). Verified: node --check on routes/vote.js, routes/submission.js, controllers/submissionController.js, middleware/auth.js; tsc clean. Frontend traced first: submissionTab.tsx renders submission.code in recent-submissions cards → added "Sealed submission" fallback when code absent. GET /state intentionally left public (read-only, no tx).

## Blockers / decisions
- None yet.
