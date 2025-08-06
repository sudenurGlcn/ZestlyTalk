import express from 'express';
import chatMessageController from '../controllers/chatMessageController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, chatMessageController.createMessage);
router.get('/:id', authenticate, chatMessageController.getMessageById);
router.get('/chat/:chatId', authenticate, chatMessageController.getMessagesByChatId);
router.put('/:id', authenticate, chatMessageController.updateMessage);
router.delete('/:id', authenticate, chatMessageController.deleteMessage);

export default router;
