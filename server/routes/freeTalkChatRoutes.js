// src/routes/freeTalkChat.routes.js
import express from 'express';
import freeTalkChatController from '../controllers/freeTalkChatController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticate, freeTalkChatController.createChat);
router.get('/:chatId', authenticate, freeTalkChatController.getChat);

export default router;
