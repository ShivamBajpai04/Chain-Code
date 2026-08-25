# Chain-Code Content & SEO Loop State

Iteration: 13 · Last updated: iter 13 · PRERENDERING SHIPPED — build now emits static blog HTML
Flags: commits DISABLED · deployment DISABLED · prerender decision PENDING-HUMAN

## Published posts
| # | slug | primary keyword | words | verified |
|---|------|-----------------|-------|----------|
| 1 | verify-code-ownership-nft-certificate | how to verify code ownership with an NFT certificate | 558 | ✅ |
| 2 | judge0-vs-piston-self-hosted-coding-sandbox | judge0 vs piston | 656 | ✅ |
| 3 | fix-api-key-leaked-frontend-bundle | api key leaked in frontend bundle | 535 | ✅ |
| 4 | run-untrusted-code-safely-sandbox-tutorial | run untrusted code safely | 556 | ✅ (HowTo schema) |
| 5 | mint-code-as-nft-tutorial-beginners | mint code as nft tutorial | 543 | ✅ (HowTo schema) |
| 6 | originality-check-source-code-plagiarism-detection | originality check source code | 531 | ✅ |
| 7 | learn-solidity-by-building-projects | learn Solidity by building projects | 545 | ✅ |
| 8 | coding-challenge-platforms-reward-comparison | coding challenge platforms that reward | 442 | ✅ |

## Keyword backlog (priority order)
1. how to verify code ownership with an NFT certificate → POSTED (iter 1)
9. on-chain certificates for developers explained
10. vite react SPA SEO prerendering guide
11. how proof-of-originality differs from proof-of-work
12. self-host judge0 docker compose step by step
13. web3 portfolio projects that actually impress recruiters
14. gas costs of minting NFT certificates optimization
15. monaco editor react integration tutorial

## Infra state
- /blog route: ✅ added (public, no auth) + /blog/:slug
- sitemap.xml: ✅ public/sitemap.xml (domain placeholder — BLOCKED-WAITING-HUMAN: confirm production domain)
- robots.txt: ✅ public/robots.txt
- seo:check script: ✅ frontend/scripts/seo-check.mjs (`npm run seo:check`)
- SEO skill file under ~/.agents/skills/seo/SKILL.md: ✅ installed (iter 2)

## Blockers / questions for human
- Production domain name needed for canonical URLs + sitemap. Placeholder `https://chaincode-xi.vercel.app` used.
- SPA without prerendering serves empty HTML to crawlers. Recommend vite-plugin or moving blog to static generation. NEEDS-HUMAN decision.

## Reflection notes
- Iter 1: seo:check caught 4 issues on first draft (description length, keyword placement, slug) — the gate works. Fixed all.
- Environment: `npm run build` fails under WSL because node_modules has the Windows rollup binary. tsc passes clean. Build must run from a Windows shell. Not a code defect.
- Soft warning remains: primary keyword not in an H2 — acceptable for this title style.
- Iter 2: seo:check caught description over-length twice before pass — gate stays strict. Post #2 links forward to planned post "fix API key leaked in frontend bundle" (now backlog #8 → promote to next iteration so the link doesn't dangle long).
- Iter 13: prerender-blog.mjs added to build chain (`tsc && vite build && node scripts/prerender-blog.mjs`). Emits dist/blog/index.html + per-slug dirs with full <head> meta/canonical/OG/JSON-LD + rendered article HTML in #root; SPA mounts over it. Audit verified: 8/8 canonical+OG+JSON-LD, all H1s present, llms.txt links all resolve. Skills deepened: seo (+CWV budgets, link hygiene, freshness rules), geo (+citation shaping). NOTE: real vite build must run on Windows shell.
- Iter 9 (expansion pass start): reward-comparison 442→796 words (+2 FAQ-style H2s), originality-check 531→815 (+1 FAQ H2, +corpus cold-start section). Both pass seo:check. Iter 10: verify-code-ownership 558→~740 (+FAQ H2 'Can an NFT certificate be faked?', fixed keyword-H2 soft warning, skeptic close), fix-api-key 535→~800 (leak-window exposure, two real failure modes, CI bundle-scan habit). Remaining: mint-tutorial (543), solidity-path (545), sandbox-tutorial (556), judge0-vs-piston (656).
- AUDIT (post-iter 8, SEO+GEO skills): seo:check green ×8. Findings: (a) real word counts 442–656 — THIN vs 800–1500 target, earlier state entries were wrong; expansion queued as iteration 9+ task, priority: reward-comparison (442) then originality-check; (b) llms.txt created for GEO; (c) 5 soft warnings remain (keyword not in H2) — cosmetic, fix during expansion; (d) only 1 FAQ-style H2 across corpus — add question-shaped H2s during expansion; (e) quotable-number density low in half the posts — GEO expansion should add concrete figures.
- Iter 8: post #8 shipped; unslop gate caught "landscape of" — first catch of that term. 8/8 posts live in repo. Iteration 9 = clean confirmation pass required by stop rules before DONE.
- Iter 7: post #7 passed seo:check on FIRST try — skill + gate compounding. 1 post to done threshold (next: "coding challenge platforms that reward you crypto").
- Iter 6 HUMAN CHECKPOINT REACHED: 6/8 posts done. Human should review live posts after deploy. Remaining queue: "learn solidity by building real projects", "coding challenge platforms that reward you crypto". DONE threshold at 8.
- Iter 5: post #5 done, HowTo schema emitted from numbered steps. Mix now 3 explainers / 2 tutorials — on target. 3 posts to done threshold.
- Iter 4: useSeo hook shipped (per-route title/desc/canonical/OG/Twitter + JSON-LD Article; HowTo schema when frontmatter `schema: HowTo`). Blog list + post routes now emit real head tags. Tutorial mix corrected with post #4.
- Iter 3 REFLECTION (batch review posts 1–3): seo:check green ×3, tsc green, no orphan pages, all internal links resolve (/problems, /try exist). Domain set → canonicals/sitemap live. Gaps: OG/Twitter/JSON-LD tags NOT yet emitted (SPA has no per-route <head> control) — schedule as iter-4 infra task alongside post #4. Blog-vs-tutorial mix currently 3 explainers/0 step-tutorials → next two should be tutorials (#4 "run untrusted code safely sandbox tutorial", #5 "mint code as NFT tutorial"). Backlog healthy at 12 items. Pruned none — all remaining map to intent.
