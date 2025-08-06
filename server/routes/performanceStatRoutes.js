import express from 'express';
import performanceStatController from '../controllers/performanceStatController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, performanceStatController.createStat);
router.get('/:id', authenticate, performanceStatController.getStatById);
router.get('/user/:userId', authenticate, performanceStatController.getStatsByUserId);
router.put('/:id', authenticate, performanceStatController.updateStat);
router.delete('/:id', authenticate, performanceStatController.deleteStat);

export default router;
