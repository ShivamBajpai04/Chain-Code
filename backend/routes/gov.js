import express from 'express';
import { writeContractData } from '../controllers/daoController.js';
import auth from '../middleware/auth.js'; // Assuming you have an auth middleware

const router = express.Router();

// router.get('/token-uri/:tokenId', auth, getTokenURI);
router.post('/', auth, writeContractData);

export default router;