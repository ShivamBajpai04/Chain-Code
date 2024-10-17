//create poll
import Poll from "../models/Poll.js";

export const createPoll = async (req, res) => {
  try {
    const { title, description } = req.body;
    const poll = new Poll({ title, description });
    await poll.save();
    res.status(201).json({
      message: "Poll created successfully",
      poll,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while creating poll",
      error: error.message,
    });
  }
};

//vote

export const vote = async (req, res) => {
  try {
    const { pollId, option } = req.body;
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    if (option < 0 || option > 2) {
      return res.status(400).json({ message: "Invalid vote option" });
    }
    if (poll.voters.includes(req.user.user.id)) {
      return res.status(400).json({ message: "User already voted" });
    }
    poll.votes[option]++;
    poll.voters.push(req.user.user.id);
    console.log(poll.votes, poll.votes[option]);
    await poll.save();
    res.status(200).json({
      message: "Vote submitted successfully",
      poll,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while voting",
    });
  }
};

//get all polls

export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.status(200).json({
      message: "Polls fetched successfully",
      polls,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching polls",
    });
  }
};

//get poll by id

export const getPollById = async (req, res) => {
  try {
    const { pollId } = req.params;
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    res.status(200).json({
      message: "Poll fetched successfully",
      poll,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching poll",
    });
  }
};
