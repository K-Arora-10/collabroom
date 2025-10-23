import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createRoom, displayAllRooms } from '../controllers/roomController.js';

const router = express.Router();

router.post('/create', verifyToken, createRoom);
router.get('/displayRooms', verifyToken, displayAllRooms);


export default router;