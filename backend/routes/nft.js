import express from 'express';
import { mintNFT, getTokenURI, getNftMetadata, getNftImage } from '../controllers/nftController.js';
import auth from '../middleware/auth.js'; // Assuming you have an auth middleware

const router = express.Router();

router.get('/token-uri/:tokenId', auth, getTokenURI);
// Public — tokenURI target; wallets/marketplaces fetch this without auth
router.get('/metadata/:submissionId', getNftMetadata);
// Public — certificate SVG art referenced by metadata `image`
router.get('/image/:submissionId', getNftImage);

router.post('/mint/:submissionId', auth, mintNFT);

export default router;
