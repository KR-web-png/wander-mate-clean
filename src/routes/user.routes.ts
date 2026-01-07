import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as userController from '../controllers/user.controller';

const router = Router();

// Get user profile (protected)
router.get('/profile', authenticate, userController.getProfile);

// Update user profile (protected)
router.put('/profile', authenticate, userController.updateProfile);

// Get user by ID (public for viewing other profiles)
router.get('/:userId', authenticate, userController.getUserById);

export default router;
