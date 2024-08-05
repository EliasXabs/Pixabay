// routes/favouriteRoutes.ts
import express from 'express';
import {
  getFavoriteIds,
  getFavorites,
  addFavorite,
  deleteFavorite,
} from '../controllers/favouriteController.js';
import { authenticateToken } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Get favorite IDs for a user
router.get('/ids', authenticateToken, getFavoriteIds);

// Get detailed favorites for a user
router.get('/', authenticateToken, getFavorites);

// Add a new favorite
router.post('/', authenticateToken, addFavorite);

// Delete a favorite
router.delete('/:pixabayId', authenticateToken, deleteFavorite);

export default router;
