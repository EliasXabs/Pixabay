import { Router } from 'express';
import {
  signup,
  login,
  verifyEmail,
  checkVerificationStatus,
  initiatePasswordReset,
  completePasswordReset,
} from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/check-verification-status', checkVerificationStatus);
router.post('/initiate-password-reset', initiatePasswordReset);
router.post('/complete-password-reset', completePasswordReset);

export default router;
