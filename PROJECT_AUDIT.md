# Chain-Code Full-Stack Audit — Aug 2026

> Method: two exhaustive code audits (frontend + backend, file:line verified), personal UI
> spot-checks, and cross-reference against 200 comparable platforms
> (see `COMPETITOR_FEATURES.md`). Grades are lettered; every claim carries a file reference.

## Scorecard

| Dimension | Grade | One-line verdict |
|---|---|---|
| **UI craft & design identity** | **A−** | Rare among solo projects: a real design constitution (DESIGN.md) that actively maintained screens follow |
| **UX flows** | **B−** | Mint journey is genuinely excellent; auth, wallet, and error-recovery journeys lag far behind |
| **Accessibility** | **C−** | Semantic HTML discipline is good; systemic sub-AA contrast and ignored reduced-motion sink it |
| **Frontend architecture** | **C+** | Works, with three clever pieces; no API layer, no code splitting, Monaco from CDN |
| **Backend security** | **D** | Four CRITICAL holes: unauthenticated on-chain txs, public source-code dump, testcase leak on list endpoint, mint-without-ownership |
| **Backend reliability/arch** | **C−** | No error middleware, broken poll route ships in prod, rate limiter keys `undefined`, JWTs never expire |
| **Features vs market** | **C** | Core loop (solve→originality→mint) works end-to-end; zero retention loop around it |
| **Testing & DX** | **F** | Zero tests anywhere, `npm test` fails by design, no CI, no lint, no `.env.example` |

**Overall: C.** A distinctive product skin over an insecure core. The design system is
portfolio-grade; the backend is prototype-grade. Every critical issue is small and fixable —
none require architectural rewrites.

---

## 1 · What's genuinely good (preserve these)

- **DESIGN.md exists and is enforced** (`frontend/DESIGN.md`, 109 lines): locked type stack
  (Cabinet Grotesk / Inter / Geist Mono), single gold accent ramp, forbidden-list of AI-slop
  fonts/gradients/copy ("Never 'Get started', 'Learn more'"). Actively maintained screens
  comply at high rates — verified across ~17 files using the `.f-display`/`.f-mono` classes.
- **Hero is hand-crafted**, not templated (`HeroSection.tsx`): custom SVG hexagon loader,
  canvas particle field capped per DESIGN.md, decomposed into 8 single-purpose subcomponents.
- **The mint UX is best-in-class for this niche**: honest 3-phase tracker (judging→verifying→
  minting) with sandbox labeling (`codeEditor.tsx:50–64`), a 30s "still minting" reassurance
  toast (`:74–86`), 5-minute timeout that says "may still complete — check My NFTs" instead of
  lying (`submitCode.ts:117–141`), success toast deep-links to certificate + Etherscan.
- **Auth event-bus** (`utils/auth.ts`): storage-event pattern fixes stale-token re-renders —
  deliberate and documented.
- **Per-problem+language draft preservation** (`problems.tsx:42–66`) — competitors like
  LeetCode don't even do the language half.
- **Empty/loading states nearly universal**, with next-step CTAs per DESIGN.md
  (`nftpage.tsx:55–63`, `PollList.tsx:62–66`).
- **Strict TS** (`noUnusedLocals`, build runs `tsc &&` first) and zero TODO debt in both apps.
- **Server-side judging migration done right**: hidden tests never leave the server on the
  execute path, provider quirks normalized (`services/execution/index.js`).
- **Seed scripts have dry-run + sanity guards** (`seedProblems.mjs:46–65`) — unusual care.

## 2 · Critical findings (fix before anything else)

| # | Sev | Finding | Where |
|---|---|---|---|
| 1 | CRIT | `/api/vote/propose` + `/api/vote/vote` execute real chain txs from the platform wallet with **zero auth** — anyone can drain gas | `routes/vote.js:6,8`, `votingController.js:15,100` |
| 2 | CRIT | `GET /api/submissions/problem/:id` returns **every user's full source code, unauthenticated** — also kills the originality premise | `routes/submission.js:16`, `submissionController.js:112–124` |
| 3 | CRIT | `GET /api/problems` returns all ~210 docs **with hidden testcases** — the strip fix was applied only to the by-id endpoint | `problemController.js:17` vs `:28` |
| 4 | CRIT | Mint has no ownership check, no double-mint guard, no pass gate — any authed user can mint any submission, repeatedly | `nftController.js:62–76` |
| 5 | HIGH | Execute rate limiter keys `req.user.id` which is `undefined` under the actual payload shape → one global bucket platform-wide | `executeController.js:27` vs `auth.js:35` |
| 6 | HIGH | IDOR: any authed user reads any submission by ID; JWTs signed with **no expiresIn** (valid forever); middleware logs raw bearer tokens | `submissionController.js:96–105`, `authController.js:53,83`, `auth.js:27` |
| 7 | HIGH | Originality judge is prompt-injectable (`extractVerdict` takes last true/false in reply; user code concatenated verbatim) and **fails open** when all LLMs are down | `uniqueSubmissionCheck.js:15–16,27–30,210–215` |
| 8 | HIGH | `POST /api/poll/create` hangs forever in production (handler mounted with wrong signature); poll voting writes NaN (schema `{agree,decline}` vs array-style access) | `routes/poll.js:12`, `pollController.js:4,30`, `Poll.js:23–26` |
| 9 | HIGH | No admin roles — **any registered user can delete/update any problem**, including seeded testcases | `routes/problem.js:9,21,25`; no role in JWT payload |
| 10 | HIGH | Frontend `/nft/:id` reachable logged-out, sends literal `Authorization: null`; login/signup buttons don't disable during submit (double-submit races); no 401 recovery anywhere (expired token = silent scattered failures) | `App.tsx:165`, `dnft.tsx:19`, `login.tsx:160`, `signup.tsx:368` |

Fast wins in the same pass: unique index on `walletAddress`, `{user, createdAt}` +
`{problem}` indexes on Submission, delete dual `bcrypt`, remove token `console.log`,
`.env.example`, fix `package.json.main` → `server.js`, reconcile root `vercel.json`
(non-standard schema contradicting `api/index.js`), upgrade axios (CVE-2025-27152 range).

## 3 · UX research synthesis — where ChainCode sits among 200 peers

Patterns proven across the catalog, mapped to current gaps:

| Proven pattern (examples) | ChainCode today | Gap size |
|---|---|---|
| **Streak/daily hook** — GfG POTD Geek Bits (editorial peek forfeits the bit AND breaks streak!), InterviewBit halved streaks, Mimo shields/widgets, LeetCode daily | none | huge |
| **Verifiable credential surface** — POK/ChainAnchor verify URL + QR; LinkedIn Assessments share-back loop | cert exists but `tokenURI` hardcodes localhost; no public verify page, no QR, no share cards | huge (P0) |
| **Profile as proof-of-work** — Microsoft Learn badges/trophies/levels, Trailhead Ranks (Scout→Ranger→All Star), freeCodeCamp cert walls, beecrowd ELO-scored profiles with historical badges | no profile page at all | big |
| **Leaderboards incl. private/friends** — AoC private boards, picoCTF classroom scoreboards, Trail Tracker team dashboards | none | medium |
| **Gated solutions/editorials** — Project Euler solve-gate, DMOJ auto-publish, Codewars Best-Practices voting | accepted-solutions feed exists but is publicly dumped (finding #2) — right idea, wrong enforcement | medium |
| **Pre-mint address confirmation** — every credential issuer confirms destination before issuance (irreversible!) | wallet address regex-only at signup, typo mints permanently to wrong address | medium |
| **Classrooms/orgs** — picoCTF classrooms, Kattis course mode, GitHub Classroom | none | later |
| **Peer feedback economy** — Exercism mentors, Dacade pays for reviews, 42 peer evals | none | later |

The strategic read: ChainCode's differentiator (verifiable on-chain certificates) targets the
*least-served quadrant* of the market — but only once the certificate is externally checkable
and shareable. Retention mechanics (streaks → profile → leaderboard) then compound it.

## 4 · Recommended order

1. **Security day (1–2 days):** findings #1–#6 + fast wins. Nothing else matters until these land.
2. **Certificate legitimacy week:** IPFS metadata + generated SVG art, public `/verify/:tokenId`
   page + QR, LinkedIn/X share cards, fix tokenURI domain. (Unlocks the entire pitch.)
3. **Auth/journey hardening:** axios instance + 401 interceptor + token expiry, pending states,
   pre-mint address confirmation modal, retry button on judge failure.
4. **Retention loop:** daily problem + streak counter (steal GfG's "peeking breaks streak"),
   profile page with cert gallery + stats card, global leaderboard.
5. **Then** topics/roadmaps, gated editorials, plagiarism pre-filter (RESEARCH.md item #3).

*Grades rest on evidence in §1–§2; strategy rests on the 200-platform catalog.*
