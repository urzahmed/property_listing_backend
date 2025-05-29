import express, { Request, Response } from 'express';
import { register, login } from '../controllers/auth.controller';
import { protect, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route example
router.get('/me', protect, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

export default router; 