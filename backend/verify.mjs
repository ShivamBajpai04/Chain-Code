import dotenv from "dotenv";
dotenv.config();

const src = (await import("fs")).readFileSync("middleware/uniqueSubmissionCheck.js", "utf8");
console.log("chain order:", [...src.matchAll(/if \((?:process\.env\.(\w+))[^{]*\{|\{ name: `?([^"`]+)`?[ ,}]/g)]
  .map(m => m[2] || (m[1] ? `<${m[1]}>` : null)).filter(Boolean).join(" -> "));

import axios from "axios";
const mongoose = (await import("mongoose")).default;
await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });

const Problem = (await import("./models/Problem.js")).default;
const Submission = (await import("./models/Submission.js")).default;

// find a real existing submission to test against
let prior = await Submission.findOne({ code: { $exists: true, $ne: "" } });
let problem = await Problem.findOne({ _id: prior?.problem });
if (!prior || !problem) {
  console.log("no real submission/problem pair in DB — cannot run end-to-end");
  await mongoose.disconnect();
  process.exit(0);
}

const check = (await import("./middleware/uniqueSubmissionCheck.js")).default;
const res = {
  code: null, body: null,
  status(c) { this.code = c; return this; },
  json(o) { this.body = o; },
};
let nextCalled = false;
// brute-force python vs whatever the stored solution is
await check(
  { body: { problemId: String(problem._id), code: `def solve(a):\n    for i in range(len(a)):\n        for j in range(i+1,len(a)):\n            if a[i]+a[j]==0: return [i,j]` }, params: {} },
  res,
  () => { nextCalled = true; }
);
console.log("middleware result:", nextCalled ? "NEXT (accepted)" : `BLOCKED ${res.code} ${JSON.stringify(res.body)}`);
await mongoose.disconnect();
