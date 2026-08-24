import Problem from "../models/Problem.js";

export const createProblem = async (req, res) => {
  const { title, description, difficulty, topics, testcases } = req.body;

  try {
    const problem = new Problem({ title, description, difficulty, topics, testcases });
    await problem.save();
    res.json(problem);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const getProblemById = async (req, res) => {
  try {
    // judging is server-side now; expected outputs (and inputs) are none of
    // the browser's business — shipping them let users print the answer
    const problem = await Problem.findById(req.params.id).select("-testcases");
    if (!problem) return res.status(404).json({ msg: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const updateProblem = async (req, res) => {
  const { title, description, difficulty, topics, testcases } = req.body;

  try {
    let problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ msg: "Problem not found" });

    problem.title = title;
    problem.description = description;
    problem.difficulty = difficulty;
    problem.topics = topics;
    problem.testcases = testcases;

    await problem.save();
    res.json(problem);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const deleteProblem = async (req, res) => {
  try {
    let problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ msg: "Problem not found" });

    await problem.remove();
    res.json({ msg: "Problem removed" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
