import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.post('/send/:roomId', verifyToken, sendMessage);


export default router;