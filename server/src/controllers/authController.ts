import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/db.js';
import { User } from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtUtils.js';
import { sendVerificationEmail } from '../utils/emailUtils.js';
import { randomBytes } from 'crypto';

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
    const verificationToken = randomBytes(32).toString('hex');

    const newUser = userRepository.create({ username, email, password: hashedPassword, verificationToken });
    await userRepository.save(newUser);

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    newUser.refreshToken = refreshToken;
    await userRepository.save(newUser);

    const verificationUrl = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationUrl);

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

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
  
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }
  
      if (!user.verified) {
        res.status(403).json({ message: 'Please verify your email to log in.' });
        return;
      }
  
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
  
      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Error during login', error });
    }
  };  

  export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.query;
  
      if (!token || typeof token !== 'string') {
        res.status(400).json({ message: 'Verification token is required and must be a string' });
        return;
      }
  
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { verificationToken: token } });
  
      if (!user) {
        res.status(400).json({ message: 'Invalid or expired verification token' });
        return;
      }
  
      user.verified = true;
      user.verificationToken = "";
      await userRepository.save(user);
  
      res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).json({ message: 'Error verifying email', error });
    }
  };
  