// routes/userRoutes.ts
import express from 'express';
import { getProfile } from '../controllers/usercontroller.js';
import { authenticateToken } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);

export default router;
