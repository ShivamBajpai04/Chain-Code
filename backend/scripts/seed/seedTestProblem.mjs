// Seeds (or updates) one sandbox problem that skips the AI originality check,
// so the mint flow can be tested/demoed without a real judge call in the way.
// Usage: node scripts/seed/seedTestProblem.mjs
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

import Problem from "../../models/Problem.js";

const TITLE = "Sandbox: Mint Test";

const doc = {
  title: TITLE,
  description: [
    "## Sandbox: Mint Test",
    "",
    "**Difficulty**: Easy  ",
    "**Topics**: Sandbox",
    "",
    "This problem exists to test and demo the minting flow. It skips the AI",
    "originality check — any correct submission mints an NFT immediately,",
    "even if it's identical to someone else's.",
    "",
    "### Statement",
    "",
    "Print the number `42`.",
    "",
    "### Input Format",
    "",
    "Ignored — any input is fed in, your solution doesn't need to read it.",
    "",
    "### Output Format",
    "",
    "Print `42`.",
    "",
    "### Example 1",
    "",
    "**Input**",
    "```",
    "0",
    "```",
    "",
    "**Output**",
    "```",
    "42",
    "```",
    "",
  ].join("\n"),
  difficulty: "Easy",
  topics: ["Sandbox"],
  skipUniqueCheck: true,
  testcases: [{ input: "0", output: "42" }],
};

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI missing — check backend/.env");
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const existing = await Problem.findOne({ title: TITLE });
  if (existing) {
    await Problem.updateOne({ _id: existing._id }, { $set: doc });
    console.log("Updated existing sandbox problem:", existing._id.toString());
  } else {
    const created = await Problem.create(doc);
    console.log("Created sandbox problem:", created._id.toString());
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
