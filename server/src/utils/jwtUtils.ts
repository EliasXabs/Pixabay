// utils/jwtUtils.ts
import jwt, { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET!;

export interface JwtPayload extends DefaultJwtPayload {
  userId: number;
}

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const generatePasswordResetToken = (userId: number) => {
  return jwt.sign({ userId }, RESET_TOKEN_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string, secret: string): JwtPayload | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};