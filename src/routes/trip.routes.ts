import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Placeholder routes - will implement later
router.get('/', authenticate, (req, res) => {
  res.json({ success: true, trips: [] });
});

router.post('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'Create trip endpoint' });
});

export default router;
