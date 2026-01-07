import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Placeholder routes
router.get('/', authenticate, (req, res) => {
  res.json({ success: true, matches: [] });
});

export default router;
