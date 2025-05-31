import express from 'express';
import { favoriteController } from '../controllers/favorite.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Add a property to favorites
router.post('/:propertyId', favoriteController.addToFavorites);

// Remove a property from favorites
router.delete('/:propertyId', favoriteController.removeFromFavorites);

// Get all favorite properties for the authenticated user
router.get('/', favoriteController.getUserFavorites);

// Check if a property is in user's favorites
router.get('/check/:propertyId', favoriteController.checkFavoriteStatus);

export default router; 