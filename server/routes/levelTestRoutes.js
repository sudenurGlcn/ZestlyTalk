import express from 'express';
import levelTestController from '../controllers/levelTestController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, levelTestController.createTest);
router.get('/:id', authenticate, levelTestController.getTestById);
router.get('/user/:userId', authenticate, levelTestController.getTestsByUserId);
router.delete('/:id', authenticate, levelTestController.deleteTest);

export default router;
