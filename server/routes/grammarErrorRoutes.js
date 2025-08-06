import express from 'express';
import grammarErrorController from '../controllers/grammarErrorController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, grammarErrorController.createError);
router.get('/user/errors/topics', authenticate, grammarErrorController.getUserErrorTopicsByPeriod);
router.get('/:id', authenticate, grammarErrorController.getErrorById);
router.get('/chat/:chatId', authenticate, grammarErrorController.getErrorsByChatId);
router.get('/message/:messageId', authenticate, grammarErrorController.getErrorsByMessageId);
router.delete('/:id', authenticate, grammarErrorController.deleteError);

export default router;
