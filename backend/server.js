import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import problemRoutes from "./routes/problem.js";
import submissionRoutes from "./routes/submission.js";
import nftRoutes from "./routes/nft.js";
import pollRoutes from "./routes/poll.js";
import govRoutes from "./routes/gov.js";
import voteRoutes from "./routes/vote.js";
dotenv.config();

const app = express();

// Add CORS middleware
app.use(cors());

// Request logging middleware
app.use(
  morgan(
    "[:date[iso]] :method :url :status :response-time ms - :res[content-length]"
  )
);

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/auth", authRoutes);
app.use("/problems", problemRoutes);
app.use("/submissions", submissionRoutes);
app.use("/nft", nftRoutes);
app.use("/poll", pollRoutes);
app.use("/gov", govRoutes);
app.use("/vote", voteRoutes);

// Set the server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
