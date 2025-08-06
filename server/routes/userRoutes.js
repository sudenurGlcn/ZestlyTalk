import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:id/set-level-from-test', authenticate, userController.setLevelFromTestResult);
router.post('/', userController.createUser);
router.get('/', authenticate, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

router.put('/:id/update-password', authenticate, userController.updatePassword);
router.put('/:id/update-email', authenticate, userController.updateEmail);

export default router;
