import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/db.js';
import { User } from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtUtils.js';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    
    const existingUser = await userRepository.findOne({ where: [{ username }, { email }] });
    if (existingUser) {
      res.status(400).json({ message: 'Username or email already taken' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({ username, email, password: hashedPassword });
    await userRepository.save(newUser);

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    newUser.refreshToken = refreshToken;
    await userRepository.save(newUser);

    res.status(201).json({
      message: 'User created successfully',
      userId: newUser.id,
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};
