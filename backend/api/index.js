import dotenv from "dotenv";
dotenv.config();

import { connectDB, default as app } from "../app.js";

// Vercel serverless entry — app is exported, never listens.
await connectDB().catch((err) => {
  console.error("DB connect failed:", err.message);
});

export default app;
