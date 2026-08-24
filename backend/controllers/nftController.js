import Submission from "../models/Submission.js";
import { ethers } from "ethers";
import { contractAbi } from "../abi.js";

const privateKey = process.env.PRIVATE_KEY;
const api = process.env.API;

const contractAddress = process.env.CONTRACT_ADDRESS;

// Ethereum provider
const provider = new ethers.JsonRpcProvider(api);
const wallet = new ethers.Wallet(privateKey, provider);

export const getTokenURI = async (req, res) => {
  const { tokenId } = req.params;
  const { walletAddress } = req.user;

  try {
    const response = await axios.post(
      `${api}/query/${contractAddress}/TokenURI`,
      {
        network: "TESTNET",
        blockchain: "KALP",
        walletAddress: walletAddress,
        args: {
          tokenId: tokenId,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching TokenURI:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch TokenURI" });
  }
};

/////
export const mintNFT = async (req, res) => {
  const { submissionId } = req.params;
  const MyToken = new ethers.Contract(contractAddress, contractAbi, wallet);

  const tokenURI = "localhost:5173/nft/" + submissionId.toString();

  try {
    // accounts registered before signup validated the wallet checksum can
    // still carry a wrong-case (or outright invalid) address in their JWT —
    // re-checksum here rather than crash on ethers' cryptic "bad address
    // checksum" mid-mint
    let walletAddress;
    try {
      walletAddress = ethers.getAddress(req.user.user.walletAddress);
    } catch {
      return res.status(400).json({
        error: "Your account's wallet address is invalid — please re-register with a valid Ethereum wallet address.",
      });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    const tx = await MyToken.safeMint(walletAddress, tokenURI);
    const recipt = await tx.wait();


    const data = await MyToken.tokensOfOwner(walletAddress);
    console.log(recipt);
    console.log(data);
    if (recipt) {
      submission.mintTxHash = tx.hash;
      submission.minted = true;
      await submission.save();
      return res.status(201).json({ message: "NFT minted Successfully", mintTxHash: tx.hash });
    }
    // const tokenId = `${submission.user}-${submission._id}-${Date.now()}`;
  } catch (error) {
    // previously swallowed silently — the client got no response at all and
    // could only ever find out via its own request timeout, indistinguishable
    // from a genuine hang. Always answer, so failures are fast and honest.
    console.error("mintNFT error:", error);
    // ethers' CALL_EXCEPTION from estimateGas doesn't always route through
    // the contract interface for decoding, so ABI-known custom errors can
    // still show up as "unknown custom error" — decode manually so the
    // actual on-chain reason surfaces instead of that dead end
    if (error.data) {
      try {
        const parsed = MyToken.interface.parseError(error.data);
        if (parsed?.name === "ERC721InvalidReceiver") {
          return res.status(400).json({
            error: "Your wallet address can't receive NFTs — it looks like a contract address, not a real wallet. Check your account's wallet address.",
          });
        }
      } catch {}
    }
    res.status(500).json({ error: error.shortMessage || error.message || "Minting failed" });
  }
};

// async function writeContractData() {
//   try {

//     //api method

//   } catch (error) {
//     console.error("Error reading contract data:", error);
//   }
// }

// writeContractData();
