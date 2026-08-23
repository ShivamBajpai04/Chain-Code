// Seeds classic algorithm problems into the database.
// Usage: node scripts/seed/seedProblems.mjs [--dry-run]
// Skips any problem whose title already exists (case-insensitive).
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

import Problem from "../../models/Problem.js";
import { problemsA } from "./problems-a.mjs";
import { problemsB } from "./problems-b.mjs";
import { problemsC } from "./problems-c.mjs";
import { problemsD } from "./problems-d.mjs";
import { problemsE } from "./problems-e.mjs";
import { problemsF } from "./problems-f.mjs";

const dryRun = process.argv.includes("--dry-run");

function buildDescription(p) {
  const lines = [];
  lines.push(`## ${p.title}`, "", `**Difficulty**: ${p.difficulty}  `, `**Topics**: ${p.topics}`, "");
  lines.push(`### Statement`, "", p.statement, "");
  lines.push(
    `### Input Format`,
    "",
    "Read from standard input.",
    "",
    p.input,
    ""
  );
  lines.push(`### Output Format`, "", "Write to standard output.", "", p.output, "");
  p.tests.slice(0, 2).forEach((t, i) => {
    lines.push(`### Example ${i + 1}`, "", "**Input**", "```", t.input, "```", "", "**Output**", "```", t.output, "```", "");
  });
  lines.push(`### Constraints`, "", ...p.constraints.map((c) => `- ${c}`), "");
  lines.push(`### Hint`, "", p.hint, "");
  return lines.join("\n");
}

async function main() {
  const all = [...problemsA, ...problemsB, ...problemsC, ...problemsD, ...problemsE, ...problemsF];

  // sanity checks before touching the DB
  if (all.length !== 200) {
    throw new Error(`Expected exactly 200 problems, found ${all.length}`);
  }
  const titles = all.map((p) => p.title.toLowerCase());
  if (new Set(titles).size !== all.length) {
    throw new Error("Duplicate titles inside seed data");
  }
  for (const p of all) {
    if (!["Easy", "Medium", "Hard"].includes(p.difficulty)) {
      throw new Error(`${p.title}: bad difficulty "${p.difficulty}"`);
    }
    if (!Array.isArray(p.tests) || p.tests.length === 0) {
      throw new Error(`${p.title}: no test cases`);
    }
  }

  console.log(`Seed data OK: ${all.length} problems`);
  const byDiff = all.reduce((acc, p) => ((acc[p.difficulty] = (acc[p.difficulty] || 0) + 1), acc), {});
  console.log("Difficulty mix:", byDiff);

  if (dryRun) return;

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI missing — check backend/.env");
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const existing = await Problem.find({}, { title: 1, topics: 1 }).lean();
  const existingByTitle = new Map(existing.map((d) => [d.title.toLowerCase(), d]));

  let inserted = 0;
  let skipped = 0;
  let backfilled = 0;
  let failed = 0;
  for (const p of all) {
    const topics = p.topics.split(",").map((t) => t.trim());
    const existingDoc = existingByTitle.get(p.title.toLowerCase());
    if (existingDoc) {
      skipped++;
      if (!existingDoc.topics || existingDoc.topics.length === 0) {
        await Problem.updateOne({ _id: existingDoc._id }, { $set: { topics } });
        backfilled++;
      }
      continue;
    }
    try {
      await Problem.create({
        title: p.title,
        description: buildDescription(p),
        difficulty: p.difficulty,
        topics,
        testcases: p.tests.map((t) => ({ input: t.input, output: t.output })),
      });
      inserted++;
    } catch (err) {
      failed++;
      console.error(`Skipping "${p.title}": ${err.message}`);
    }
  }

  const total = await Problem.countDocuments();
  console.log(
    `Inserted: ${inserted}, skipped (already existed): ${skipped}, backfilled topics: ${backfilled}, failed: ${failed}`
  );
  console.log(`Total problems in DB now: ${total}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
