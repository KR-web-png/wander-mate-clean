import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Placeholder routes
router.post('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'Payment endpoint' });
});

export default router;
