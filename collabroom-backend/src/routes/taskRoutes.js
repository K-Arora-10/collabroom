import express from 'express';
import { createTask, getTasksByRoom, updateTaskStatus } from '../controllers/taskController.js';

const router = express.Router();

router.post('/createTask/:roomId',createTask);
router.get('/getTasks/:roomId',getTasksByRoom);
router.put('/updateStatus/:taskId',updateTaskStatus);

export default router;