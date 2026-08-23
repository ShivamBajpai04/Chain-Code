// Local dev entry — `node server.js`. Production entry for Vercel is api/index.js
import dotenv from "dotenv";
dotenv.config();

import { connectDB, default as app } from "./app.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
