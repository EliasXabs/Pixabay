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

export const checkVerificationStatus = async (email: string) => {
    const response = await axios.post(`${API_URL}/auth/check-verification-status`, {
      email
    });
    return response.data;
  };

export const getProfile = async (accessToken: string) => {
  const response = await axios.get(`${API_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
};

export const getFavoriteIds = async (accessToken: string) => {
  const response = await axios.get(`${API_URL}/favourite/ids`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.favouriteIds;
};

// Get detailed favorites for a user
export const getFavorites = async (accessToken: string) => {
  const response = await axios.get(`${API_URL}/favourite`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.favourites;
};

// Add a new favorite
export const addFavorite = async (
  accessToken: string,
  mediaId: number,
  mediaType: string,
  mediaUrl: string
) => {
  const response = await axios.post(
    `${API_URL}/favourite`,
    { mediaId, mediaType, mediaUrl },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// Delete a favorite
export const deleteFavorite = async (accessToken: string, mediaId: number) => {
  const response = await axios.delete(`${API_URL}/favourite/${mediaId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};