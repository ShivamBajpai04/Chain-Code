#!/usr/bin/env node
// SEO linter for frontend/content/blog/*.mdx|*.md — loop acceptance criteria.
// Run: npm run seo:check   Exit 1 on any error.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "content", "blog");
const UNSLOP = /\b(delve|tapestry|testament to|pivotal|in today's world|game-?chang(er|ing)|unlock the|seamless(ly)?|leverage|utilize|fostering|showcas(e|ing)|landscape of|robust)\b/i;

let errors = 0;
const fail = (file, msg) => { errors++; console.error(`✗ ${file}: ${msg}`); };

if (!existsSync(dir)) { console.error(`No content dir at ${dir}`); process.exit(1); }
const files = readdirSync(dir).filter(f => /\.mdx?$/.test(f));
if (files.length === 0) { console.error("No posts found."); process.exit(1); }

for (const f of files) {
  const raw = readFileSync(join(dir, f), "utf8");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) { fail(f, "missing frontmatter block"); continue; }
  const fm = Object.fromEntries(fmMatch[1].split("\n").map(l => {
    const i = l.indexOf(":"); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
  }));
  const body = raw.slice(fmMatch[0].length);

  const t = fm.title || "";
  if (t.length === 0 || t.length > 60) fail(f, `title must be 1–60 chars (got ${t.length})`);
  const d = fm.description || "";
  if (d.length < 140 || d.length > 160) fail(f, `description must be 140–160 chars (got ${d.length})`);
  for (const k of ["primaryKeyword", "date", "author", "canonical", "slug"]) if (!fm[k]) fail(f, `frontmatter missing ${k}`);

  if ((body.match(/^# /gm) || []).length !== 1) fail(f, "exactly one H1 required");
  if ((body.match(/^## /gm) || []).length < 2) fail(f, "at least two H2s required");
  if (!/^# /m.test(body)) fail(f, "H1 missing");

  const kw = (fm.primaryKeyword || "").toLowerCase();
  if (kw) {
    if (!t.toLowerCase().includes(kw)) fail(f, `primary keyword "${kw}" not in title`);
    if (!body.toLowerCase().slice(0, 600).includes(kw)) fail(f, `primary keyword not in first ~100 words`);
    if (!new RegExp(`^## .*${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "im").test(body))
      console.warn(`⚠ ${f}: primary keyword not in any H2 (soft check)`);
    if (!(fm.slug || "").toLowerCase().includes(kw.split(" ").filter(w => w.length > 3)[0] || ""))
      fail(f, "slug should contain main keyword words");
  }

  const m = body.match(UNSLOP);
  if (m) fail(f, `unslop banned term: "${m[0]}"`);

  // internal links: count markdown links that aren't external
  const internal = (body.match(/\]\((\/[^)]*)\)/g) || []).length;
  if (internal < 2) fail(f, `needs ≥2 internal links (found ${internal})`);
}

console.log(errors ? `\n${errors} error(s)` : `\nAll ${files.length} post(s) pass seo:check ✓`);
process.exit(errors ? 1 : 0);
