import { Request, Response } from 'express';
import { AppDataSource } from '../config/db.js';
import { Favourite } from '../models/Favourite.js';

// Get favorite media IDs for a user
export const getFavoriteIds = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const favouriteRepository = AppDataSource.getRepository(Favourite);
    const favourites = await favouriteRepository.find({
      where: { user: { id: userId } },
    });

    const favouriteIds = favourites.map((favourite) => favourite.mediaId);
    res.json({ favouriteIds });
  } catch (error) {
    console.error('Error fetching favorite IDs:', error);
    res.status(500).json({ error: 'Failed to fetch favorite IDs' });
  }
};

// Get detailed favorites for a user
export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const favouriteRepository = AppDataSource.getRepository(Favourite);
    const favourites = await favouriteRepository.find({
      where: { user: { id: userId } },
    });

    const favouriteDetails = favourites.map((favourite) => ({
      id: favourite.mediaId,
      url: favourite.mediaUrl,
      mediaType: favourite.mediaType,
    }));

    res.json({ favourites: favouriteDetails });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

// Add a new favorite
export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { mediaId, mediaType, mediaUrl } = req.body;

    const favouriteRepository = AppDataSource.getRepository(Favourite);
    const existingFavourite = await favouriteRepository.findOne({
      where: { user: { id: userId }, mediaId },
    });

    if (existingFavourite) {
      return res.status(400).json({ error: 'Already favorited' });
    }

    // Create a new favourite
    const favourite = new Favourite();
    favourite.mediaId = mediaId;
    favourite.mediaType = mediaType;
    favourite.mediaUrl = mediaUrl;
    favourite.user = Promise.resolve(req.user);

    await favouriteRepository.save(favourite);

    res.status(201).json({ message: 'Favorite added successfully' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

// Delete a favorite
export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const pixabayId = parseInt(req.params.pixabayId, 10);

    if (isNaN(pixabayId)) {
      return res.status(400).json({ error: 'Invalid pixabay ID' });
    }

    const favouriteRepository = AppDataSource.getRepository(Favourite);

    const favourite = await favouriteRepository.findOne({
      where: { user: { id: userId }, mediaId: pixabayId },
    });

    if (!favourite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await favouriteRepository.remove(favourite);

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
};

export const getTopFavorites = async (req: Request, res: Response) => {
  try {
    const favouriteRepository = AppDataSource.getRepository(Favourite);

    const topFavorites = await favouriteRepository
      .createQueryBuilder('favourite')
      .select('favourite.mediaId', 'mediaId')
      .addSelect('favourite.mediaUrl', 'mediaUrl')
      .addSelect('COUNT(favourite.mediaId)', 'count')
      .groupBy('favourite.mediaId')
      .addGroupBy('favourite.mediaUrl')
      .orderBy('count', 'DESC')
      .limit(30) // Change the limit as needed
      .getRawMany();

    res.json({ topFavorites });
  } catch (error) {
    console.error('Error fetching top favorites:', error);
    res.status(500).json({ error: 'Failed to fetch top favorites' });
  }
};