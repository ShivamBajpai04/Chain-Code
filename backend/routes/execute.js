import express from "express";
import auth from "../middleware/auth.js";
import { executeCode } from "../controllers/executeController.js";

const router = express.Router();

// @route    POST /execute/:problemId
// @desc     Run code against a problem's hidden test cases (server-side judging)
router.post("/:problemId", auth, executeCode);

export default router;
