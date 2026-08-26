import Submission from "../models/Submission.js";
import { ethers } from "ethers";
import { contractAbi } from "../abi.js";

const privateKey = process.env.PRIVATE_KEY;
const api = process.env.API;
const contractAddress = process.env.CONTRACT_ADDRESS;
const publicSepoliaRpc = "https://ethereum-sepolia-rpc.publicnode.com";

export async function getSepoliaProvider() {
  const urls = [...new Set([publicSepoliaRpc, process.env.FALLBACK_API, api].filter(Boolean))];

  for (const url of urls) {
    try {
      const provider = new ethers.JsonRpcProvider(url, 11155111, { staticNetwork: true });
      const chainId = await provider.send("eth_chainId", []);
      if (BigInt(chainId) !== 11155111n) throw new Error("RPC is not connected to Sepolia");
      if ((await provider.getCode(contractAddress)) === "0x") {
        throw new Error("NFT contract is not deployed on this RPC");
      }
      return provider;
    } catch (error) {
      const host = (() => {
        try {
          return new URL(url).host;
        } catch {
          return "configured RPC";
        }
      })();
      console.warn(`Sepolia RPC ${host} unavailable:`, error.shortMessage || error.code || error.message);
    }
  }

  throw new Error("No working Sepolia RPC endpoint");
}

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
  // ERC-721 tokenURI must be a publicly fetchable metadata URL — wallets and
  // marketplaces GET it to render the certificate. A localhost link dies for
  // every viewer outside the dev machine (and with it, the cert display).
  const BACKEND_URL = process.env.PUBLIC_BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  const tokenURI = `${BACKEND_URL}/api/nft/metadata/${submissionId.toString()}`;
  let MyToken;

  try {
    if (!privateKey || !contractAddress) {
      return res.status(500).json({ error: "NFT minting is not configured on the server." });
    }

    const provider = await getSepoliaProvider();
    const wallet = new ethers.Wallet(privateKey, provider);
    MyToken = new ethers.Contract(contractAddress, contractAbi, wallet);

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

    // Ownership gate — you can only mint your own work (audit finding #4)
    if (String(submission.user) !== String(req.user.user.id)) {
      return res.status(403).json({ error: "You can only mint your own submissions." });
    }

    // Double-mint guard — a certificate already exists for this submission
    if (submission.minted) {
      return res.status(409).json({
        error: "This submission is already minted.",
        mintTxHash: submission.mintTxHash || undefined,
      });
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
    if (error.data && MyToken) {
      try {
        const parsed = MyToken.interface.parseError(error.data);
        if (parsed?.name === "ERC721InvalidReceiver") {
          return res.status(400).json({
            error: "Your wallet address can't receive NFTs — it looks like a contract address, not a real wallet. Check your account's wallet address.",
          });
        }
      } catch {}
    }
    const rpcRejected = /403|forbidden|no working sepolia rpc/i.test(
      `${error.shortMessage || ""} ${error.message || ""}`
    );
    res.status(rpcRejected ? 503 : 500).json({
      error: rpcRejected
        ? "The Sepolia network rejected the mint request. Please retry in a moment."
        : error.shortMessage || "Minting failed on Sepolia.",
    });
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

// Generated SVG certificate art — referenced by metadata `image`.
// Deterministic per submission; no external storage needed yet.
export const getNftImage = async (req, res) => {
  try {
    const id = req.params.submissionId.replace(/\.svg$/i, "");
    const submission = await Submission.findById(id)
      .populate("problem", "title difficulty")
      .populate("user", "username");
    if (!submission || !submission.minted) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const esc = (s) =>
      String(s ?? "").replace(/[<>&"']/g, (c) =>
        ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c])
      );

    const title = esc(submission.problem.title);
    const solver = esc(submission.user?.username || "Anonymous");
    const language = esc(submission.language);
    const difficulty = esc(submission.problem.difficulty);
    const date = submission.createdAt
      ? new Date(submission.createdAt).toISOString().slice(0, 10)
      : "";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#14102e"/>
  <rect x="24" y="24" width="752" height="452" fill="none" stroke="#d4a017" stroke-width="2"/>
  <text x="400" y="110" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#d4a017" letter-spacing="4">CHAINCODE CERTIFICATE</text>
  <text x="400" y="150" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#8a83a8" letter-spacing="2">PROOF OF ORIGINALITY · SEPOLIA</text>
  <text id="cert-title" x="400" y="235" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#f5f1e8">${title}</text>
  <text x="400" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#8a83a8">solved by</text>
  <text x="400" y="335" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#f5f1e8">${solver}</text>
  <text x="400" y="395" text-anchor="middle" font-family="monospace" font-size="15" fill="#b9b3d0">${language} · ${difficulty}${date ? ` · ${date}` : ""}</text>
</svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(svg);
  } catch (error) {
    console.error("getNftImage error:", error);
    res.status(500).json({ error: "Failed to render certificate image" });
  }
};

// Public ERC-721 metadata endpoint — this is what tokenURI points at.
// No auth: wallets and marketplaces fetch it server-side, they have no JWT.
// Only minted submissions expose metadata; source code never leaks here.
export const getNftMetadata = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId)
      .populate("problem", "title difficulty")
      .populate("user", "username");
    if (!submission || !submission.minted) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const BACKEND_URL = process.env.PUBLIC_BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const FRONTEND_URL = process.env.PUBLIC_FRONTEND_URL || "https://chaincode-xi.vercel.app";
    const mintDate = submission.createdAt
      ? new Date(submission.createdAt).toISOString().slice(0, 10)
      : undefined;

    res.json({
      name: `ChainCode Certificate — ${submission.problem.title}`,
      description: `On-chain certificate of originality. ${submission.user?.username || "A developer"} solved "${submission.problem.title}" in ${submission.language}${mintDate ? ` on ${mintDate}` : ""}, passed all testcases, and cleared the originality check. Verified on Sepolia.`,
      image: `${BACKEND_URL}/api/nft/image/${submission._id}.svg`,
      external_url: `${FRONTEND_URL}/nft/${submission._id}`,
      attributes: [
        { trait_type: "Problem", value: submission.problem.title },
        { trait_type: "Difficulty", value: submission.problem.difficulty },
        { trait_type: "Language", value: submission.language },
        ...(mintDate ? [{ trait_type: "Solved On", value: mintDate }] : []),
        { trait_type: "Network", value: "Sepolia" },
      ],
    });
  } catch (error) {
    console.error("getNftMetadata error:", error);
    res.status(500).json({ error: "Failed to load certificate metadata" });
  }
};
