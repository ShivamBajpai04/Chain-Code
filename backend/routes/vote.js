import { proposeNewValue, getProposalState, castVote } from "../controllers/votingController.js";
import { Router } from "express";
import auth from "../middleware/auth.js";

const router = Router();

// These endpoints execute real on-chain txs from the platform wallet —
// they must never be reachable without authentication (audit finding #1).
router.post("/propose", auth, proposeNewValue);
router.get("/state", getProposalState);
router.post("/vote", auth, castVote);

export default router;
