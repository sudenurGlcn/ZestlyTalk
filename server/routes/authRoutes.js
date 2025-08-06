import express from 'express';
import authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.get('/me', authenticate, authController.me);
router.post('/logout', authenticate, authController.logout);

export default router;