import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from './auth.middleware';

const router = Router();

// Public endpoints
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);

// Protected endpoints
router.post('/logout', authMiddleware as any, AuthController.logout as any);
router.get('/me', authMiddleware as any, AuthController.me as any);

export default router;
