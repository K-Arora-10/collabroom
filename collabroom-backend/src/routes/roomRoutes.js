import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createRoom, displayAllRooms, joinRoom } from '../controllers/roomController.js';
import { getRoomInfo } from '../controllers/particularRoomController.js';

const router = express.Router();

router.post('/create', verifyToken, createRoom);
router.get('/displayRooms', verifyToken, displayAllRooms);
// router.get('/members/:roomId', verifyToken, getRoomMembers);
router.get('/room/:roomId', verifyToken, getRoomInfo);
router.post('/join/:inviteCode', verifyToken, joinRoom);


export default router;