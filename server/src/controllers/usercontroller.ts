// controllers/userController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/db.js';
import { User } from '../models/User.js';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { id, username, email } = user;
    res.json({ id, username, email });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
