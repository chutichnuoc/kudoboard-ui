// src/api/authApi.ts
import apiClient from './apiClient';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/authTypes';

export const authApi = {
    // User login
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },

    // User registration
    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    // Get current user info
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    // Update profile
    updateProfile: async (userData: { name?: string, profilePicture?: string }): Promise<User> => {
        const response = await apiClient.put('/auth/me', userData);
        return response.data;
    },

    // Logout (client-side only)
    logout: (): void => {
        localStorage.removeItem('token');
    }
};
