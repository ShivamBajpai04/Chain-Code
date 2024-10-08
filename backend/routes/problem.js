import express from 'express';
import auth from '../middleware/auth.js';
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getSubmissionsByProblemId // Import the new function
} from '../controllers/problemController.js';

const router = express.Router();

// @route    POST /problems
// @desc     Create a new problem
router.post('/', auth, createProblem);

// @route    GET /problems
// @desc     Get all problems
router.get('/', getAllProblems);

// @route    GET /problems/:id
// @desc     Get problem by ID
router.get('/:id', getProblemById);

// @route    GET /problems/:id/submissions
// @desc     Get all submissions for a specific problem
router.get('/:id/submissions', auth, getSubmissionsByProblemId); // New route for fetching submissions by problem ID

// @route    PUT /problems/:id
// @desc     Update a problem
router.put('/:id', auth, updateProblem);

// @route    DELETE /problems/:id
// @desc     Delete a problem
router.delete('/:id', auth, deleteProblem);

export default router;
