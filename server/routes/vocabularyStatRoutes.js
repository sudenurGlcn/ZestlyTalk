import express from 'express';
import vocabularyStatController from '../controllers/vocabularyStatController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, vocabularyStatController.createStat);
router.get('/:id', authenticate, vocabularyStatController.getStatById);
router.get('/user/:userId', authenticate, vocabularyStatController.getStatsByUserId);
router.put('/:id', authenticate, vocabularyStatController.updateStat);
router.delete('/:id', authenticate, vocabularyStatController.deleteStat);

export default router;
