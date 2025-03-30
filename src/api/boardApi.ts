// src/api/boardApi.ts
import apiClient from './apiClient';
import { Board, CreateBoardRequest, UpdateBoardRequest } from '../types/boardTypes';

export const boardApi = {
    // Get all boards for current user
    getBoards: async (page = 1, perPage = 10): Promise<{ boards: Board[]; pagination: any }> => {
        const response = await apiClient.get('/boards', {
            params: { page, per_page: perPage }
        });
        
        // The API returns data wrapped in a structure with data and pagination
        return {
            boards: response.data,
            pagination: response.data?.pagination || null
        };
    },

    // Get public boards
    getPublicBoards: async (page = 1, perPage = 10): Promise<{ boards: Board[]; pagination: any }> => {
        const response = await apiClient.get('/boards/public', {
            params: { page, per_page: perPage }
        });
        
        return {
            boards: response.data,
            pagination: response.data?.pagination || null
        };
    },

    // Get a single board by slug
    getBoardBySlug: async (slug: string): Promise<{board: Board, posts: any[]}> => {
        const response = await apiClient.get(`/boards/slug/${slug}`);
        return response.data;
    },

    // Create a new board
    createBoard: async (boardData: CreateBoardRequest): Promise<Board> => {
        const formattedData = {
            title: boardData.title,
            description: boardData.description || '',
            backgroundImageURL: boardData.cover_image || '',
            isPrivate: !boardData.is_public,
            allowAnonymous: true,
            backgroundType: boardData.cover_image ? 'image' : 'color',
            backgroundcolor: '#ffffff'
        };
        
        const response = await apiClient.post('/boards', formattedData);
        return response.data;
    },

    // Update a board
    updateBoard: async (id: string, boardData: UpdateBoardRequest): Promise<Board> => {
        const formattedData: any = {};
        
        if (boardData.title !== undefined) formattedData.title = boardData.title;
        if (boardData.description !== undefined) formattedData.description = boardData.description;
        if (boardData.cover_image !== undefined) {
            formattedData.backgroundImageURL = boardData.cover_image;
            formattedData.backgroundType = 'image';
        }
        if (boardData.is_public !== undefined) formattedData.isPrivate = !boardData.is_public;
        
        const response = await apiClient.put(`/boards/${id}`, formattedData);
        return response.data;
    },

    // Delete a board
    deleteBoard: async (id: string): Promise<void> => {
        await apiClient.delete(`/boards/${id}`);
    }
};