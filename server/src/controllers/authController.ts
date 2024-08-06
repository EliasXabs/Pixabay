import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/db.js';
import { User } from '../models/User.js';
import { generateAccessToken, generateRefreshToken, generatePasswordResetToken, verifyToken } from '../utils/jwtUtils.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailUtils.js';
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
  
  export const checkVerificationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
  
      if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
      }
  
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      if (user.verified) {
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
  
        res.status(200).json({
          message: 'Email verified successfully.',
          verified: true,
          accessToken,
          refreshToken,
        });
      } else {
        res.status(200).json({ verified: false });
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      res.status(500).json({ message: 'Error checking verification status', error });
    }
  };

  export const initiatePasswordReset = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const resetToken = generatePasswordResetToken(user.id);
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour from now
      await userRepository.save(user);
  
      await sendPasswordResetEmail(email, resetToken);
  
      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Error initiating password reset:', error);
      res.status(500).json({ error: 'Failed to initiate password reset' });
    }
  };
  
  // Complete Password Reset
  export const completePasswordReset = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      const userRepository = AppDataSource.getRepository(User);
  
      const decoded = verifyToken(token, process.env.RESET_TOKEN_SECRET!);
  
      if (!decoded) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
  
      const user = await userRepository.findOne({
        where: { passwordResetToken: token, id: decoded.userId },
      });
  
      if (!user || user.passwordResetExpires < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
  
      user.password = await bcrypt.hash(newPassword, 10);
      user.passwordResetToken = '';
      user.passwordResetExpires = new Date(0);
  
      await userRepository.save(user);
  
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error completing password reset:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  };