import { ethers } from "ethers";
import { voteAbi } from "../voteAbi.js";
import { createPoll } from "./pollController.js";

const privateKey = process.env.PRIVATE_KEY;
const api = process.env.API;

const contractAddress = process.env.VOTING_CONTRACT_ADDRESS;

// Ethereum provider
const provider = new ethers.JsonRpcProvider(api);
provider.pollingInterval = 1000; // Adjust polling interval
const wallet = new ethers.Wallet(privateKey, provider);

export async function proposeNewValue(req, res) {
  try {
    console.log("Connecting to contract at address:", contractAddress);
    const MyToken = new ethers.Contract(contractAddress, voteAbi, wallet);
    console.log("Contract instance created");

    // Example proposal data
    const targets = [contractAddress];
    const values = [0]; // No ETH being sent
    const uniqueValue = new Date().getTime();
    const calldata = ethers.AbiCoder.defaultAbiCoder().encode(
      ["uint256"],
      [uniqueValue]
    );

    console.log(
      `Attempting to create a proposal from account: ${wallet.address}`
    );

    const tx = await MyToken.propose(
      targets,
      values,
      [calldata],
      "description",
      {
        gasLimit: 1000000,
      }
    );
    console.log("Transaction sent. Hash:", tx.hash);
    console.log("Waiting for transaction to be mined...");

    const receipt = await tx.wait(2); // Wait for 2 confirmations
    console.log("Transaction mined. Receipt:", receipt);

    const proposalCreatedEvent = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "ProposalCreated"
    );

    if (proposalCreatedEvent) {
      const proposalId = proposalCreatedEvent.args[0];
      console.log("Proposal created with ID:", proposalId.toString());
      await createPoll(req.body.title, req.body.description, proposalId.toString());

      res.status(200).json({ proposalId: proposalId.toString(), poll });
    } else {
      console.log("ProposalCreated event not found in the logs");
      console.log("All events:", receipt.logs);
      res.status(500).json({ error: "Proposal creation failed" });
    }
  } catch (error) {
    console.error("Error creating proposal:", error);
    if (error.reason) console.error("Error reason:", error.reason);
    if (error.data) console.error("Error data:", error.data);
    res.status(500).json({ error: error.message });
  }
}

export async function getProposalState(req, res) {
  const proposalId = req.body.proposalId;
  try {
    const MyToken = new ethers.Contract(contractAddress, voteAbi, wallet);

    console.log(`Attempting to get state for proposal: ${proposalId}`);

    const state = await MyToken.state(proposalId);

    const stateMap = [
      "Pending",
      "Active",
      "Canceled",
      "Defeated",
      "Succeeded",
      "Queued",
      "Expired",
      "Executed",
    ];

    console.log(`Proposal state: ${stateMap[state]} (${state})`);
    res.status(200).json({ state: stateMap[state] });
  } catch (error) {
    console.error("Error getting proposal state:", error);
    res.status(500).json({ error: "Error getting proposal state:" });
  }
}

export async function castVote(req, res) {
  // support -> vote is a boolean
  const proposalId = req.body.proposalId;
  const support = req.body.support;
  try {
    const MyToken = new ethers.Contract(contractAddress, voteAbi, wallet);

    console.log(`Attempting to cast vote on proposal ${proposalId}`);
    console.log(`Vote: ${support ? "For" : "Against"}`);

    const tx = await MyToken.castVote(proposalId, support ? 1 : 0, {
      gasLimit: 300000,
    });
    console.log("Transaction sent. Hash:", tx.hash);
    console.log("Waiting for transaction to be mined...");

    const receipt = await tx.wait(2); // Wait for 2 confirmations
    console.log("Vote cast successfully. Receipt:", receipt);

    const voteEvent = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "VoteCast"
    );

    if (voteEvent) {
      const voter = voteEvent.args.voter;
      const weight = voteEvent.args.weight;
      console.log(`Vote cast by ${voter} with weight ${weight.toString()}`);
    } else {
      console.log("VoteCast event not found in the logs");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error casting vote:", error);
    if (error.reason) console.error("Error reason:", error.reason);
    if (error.data) console.error("Error data:", error.data);
    res.status(500).json({ success: false });
  }
}
