// src/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const signup = async (username: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/signup`, {
    username,
    email,
    password,
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await axios.get(`${API_URL}/auth/verify-email`, {
    params: { token },
  });
  return response.data;
};

export const checkVerificationStatus = async (userId: number) => {
  const response = await axios.get(`${API_URL}/auth/check-verification`, {
    params: { userId },
  });
  return response.data;
};
