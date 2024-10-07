import axios from "axios";
import Submission from "../models/Submission.js";

// export const getTokenURI = async (req, res) => {
//   const { tokenId } = req.params;
//   const { walletAddress } = req.user;

//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/query/${CONTRACT_ADDRESS}/TokenURI`,
//       {
//         network: "TESTNET",
//         blockchain: "KALP",
//         walletAddress: walletAddress,
//         args: {
//           tokenId: tokenId,
//         },
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error(
//       "Error fetching TokenURI:",
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({ error: "Failed to fetch TokenURI" });
//   }
// };

/////
export const mintNFT = async (req, res) => {
  const { submissionId } = req.params;
  const walletAddress = req.user.user.walletAddress;
  try {
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    // const tokenId = `${submission.user}-${submission._id}-${Date.now()}`;

    const tokenURI = "localhost:5000/" + submission._id.toString();
  }catch(error){
    console.log(error);
  }

    
};
