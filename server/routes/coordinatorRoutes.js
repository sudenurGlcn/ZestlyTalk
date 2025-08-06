import express from 'express';
import coordinatorController from '../controllers/coordinatorController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/message', authenticate, coordinatorController.handleUserMessage);
router.post('/end-conversation', authenticate, coordinatorController.handleEndOfConversation);
router.post('/hints', authenticate, coordinatorController.getHints); 
router.post('/mentor-tips', authenticate, coordinatorController.getMentorTips); 
router.post('/free-talk', coordinatorController.handleFreeChat); 

export default router;
