// src/routes/chat.routes.js
import express from 'express';
import chatController from '../controllers/chatController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/force-new', authenticate, chatController.forceCreateNewChat);
router.post('/', authenticate, chatController.getOrCreateChat);
router.get('/:id', authenticate, chatController.getChatById);
router.get('/user/:userId', authenticate, chatController.getChatsByUserId);
router.get('/user/:userId/active', authenticate, chatController.getActiveChatsByUserId);
router.get('/user/:userId/active-completed', authenticate, chatController.getActiveAndCompletedChatsByUser); // ✅ yeni
router.get('/user/:userId/radar-scores', authenticate, chatController.getRadarScores);
router.get('/scenario/:scenarioId', authenticate, chatController.getChatsByScenarioId);
router.put('/:id', authenticate, chatController.updateChat);
router.delete('/:id', authenticate, chatController.deleteChat);

export default router;
