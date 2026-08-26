//create poll
import Poll from "../models/Poll.js";

// Was mounted directly as handler while expecting plain args — requests hung
// forever (audit finding #8). Now a proper req/res handler with validation.
export const createPoll = async (req, res) => {
  try {
    const { title, description, proposalId } = req.body ?? {};
    if (!title?.trim() || !description?.trim() || !proposalId) {
      return res.status(400).json({ message: "title, description and proposalId are required" });
    }
    const poll = new Poll({
      title: title.trim(),
      description: description.trim(),
      proposalId,
    });
    await poll.save();
    return res.status(201).json({ message: "Poll created", poll });
  } catch (error) {
    console.error("createPoll error:", error.message);
    return res.status(500).json({ message: "Error creating poll" });
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
    // Schema stores votes as {agree, decline} counters; option must map onto
    // those keys. Previously indexed the object with a raw number → NaN.
    const optionKey = option === 0 || option === "0" ? "agree"
      : option === 1 || option === "1" ? "decline"
      : null;
    if (optionKey === null) {
      return res.status(400).json({ message: "Invalid vote option" });
    }
    if (typeof poll.votes[optionKey] !== "number") {
      return res.status(500).json({ message: "Poll vote counters are corrupt" });
    }
    if (poll.voters.includes(req.user.user.id)) {
      return res.status(400).json({ message: "User already voted" });
    }
    poll.votes[optionKey]++;
    poll.voters.push(req.user.user.id);
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

//get poll by its on-chain proposalId — every /polls/:id link in the app
//uses proposalId, not the Mongo _id, so look up the same way

export const getPollById = async (req, res) => {
  try {
    const { pollId } = req.params;
    const poll = await Poll.findOne({ proposalId: pollId });
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
