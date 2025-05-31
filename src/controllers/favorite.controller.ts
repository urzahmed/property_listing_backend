import { Response } from 'express';
import { Favorite } from '../models/favorite.model';
import { Property } from '../models/property.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const favoriteController = {
  // Add a property to favorites
  async addToFavorites(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      const { propertyId } = req.params;
      const userId = req.user._id;

      // Check if property exists
      const property = await Property.findOne({id:propertyId });
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      // Create new favorite
      const favorite = new Favorite({
        user: userId,
        property: property._id,
      });

      await favorite.save();
      res.status(201).json({ message: 'Property added to favorites', favorite });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Property already in favorites' });
      }
      res.status(500).json({ message: 'Error adding to favorites', error: error.message });
    }
  },

  // Remove a property from favorites
  async removeFromFavorites(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      const { propertyId } = req.params; // This is the custom ID like 'PROP1002'
      const userId = req.user._id;
  
      // First, find the property by its custom ID
      const property = await Property.findOne({ id: propertyId });
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
  
      // Then delete the favorite using the actual MongoDB ObjectId
      const favorite = await Favorite.findOneAndDelete({
        user: userId,
        property: property._id,
      });
  
      if (!favorite) {
        return res.status(404).json({ message: 'Favorite not found' });
      }
  
      res.json({ message: 'Property removed from favorites' });
    } catch (error: any) {
      res.status(500).json({ message: 'Error removing from favorites', error: error.message });
    }
  },
  

  // Get all favorite properties for a user
  async getUserFavorites(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      const userId = req.user._id;

      const favorites = await Favorite.find({ user: userId })
        .populate({
          path: 'property',
          select: 'title type price state city areaSqFt bedrooms bathrooms amenities furnished availableFrom listedBy tags colorTheme rating isVerified listingType',
        });

      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching favorites', error: error.message });
    }
  },

  // Check if a property is in user's favorites
  async checkFavoriteStatus(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      const { propertyId } = req.params;
      const userId = req.user._id;

      const favorite = await Favorite.findOne({
        user: userId,
        property: propertyId,
      });

      res.json({ isFavorite: !!favorite });
    } catch (error: any) {
      res.status(500).json({ message: 'Error checking favorite status', error: error.message });
    }
  },
}; 