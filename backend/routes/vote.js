import { proposeNewValue, getProposalState, castVote } from "../controllers/votingController.js";
import { Router } from "express";

const router = Router();

router.post("/propose", proposeNewValue);
router.get("/state", getProposalState);
router.post("/vote", castVote);

export default router;
