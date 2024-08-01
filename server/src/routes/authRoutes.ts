import { Router } from 'express';
import { signup, login, verifyEmail, checkVerificationStatus } from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/check-verification-status', checkVerificationStatus);

export default router;
