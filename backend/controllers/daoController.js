import { ethers } from "ethers";
import { abi } from "../govAbi.js";
const contractAbi = abi;

const privateKey = process.env.PRIVATE_KEY;
const api = process.env.API;

const contractAddress = process.env.GOV_CONTRACT_ADDRESS;

// Ethereum provider
const provider = new ethers.JsonRpcProvider(api);
const wallet = new ethers.Wallet(privateKey, provider);

export async function writeContractData(req, res) {
  try {
    const govToken = new ethers.Contract(contractAddress, abi, wallet);

    // Current data
    const recipientAddress = req.user.user.walletAddress; // Replace with the recipient's address
    // Replace with the token URI

    const data1 = await govToken.balanceOf(recipientAddress);
    console.log("The current data stored on blockchain is:", data1);
    // Call the safeMint function api method
    const tx = await govToken.mint(recipientAddress, 1);
    var receipt = await tx.wait();

    //api method
    const data = await govToken.balanceOf(recipientAddress);
    console.log("The current data stored on blockchain is:", data);
    res.json({receipt})
  } catch (error) {
    res.json({error})
    console.error("Error reading contract data:", error);
  }
}