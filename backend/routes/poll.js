import express from "express";
import {
  createPoll,
  vote,
  getAllPolls,
  getPollById,
} from "../controllers/pollController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, createPoll);
router.post("/vote", auth, vote);
router.get("/all", getAllPolls);
router.get("/:pollId", auth, getPollById);

export default router;

