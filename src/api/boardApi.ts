import apiClient from './apiClient';
import { Board, CreateBoardRequest, UpdateBoardRequest } from '../types/boardTypes';

export const boardApi = {
    // Get all boards
    getBoards: async (): Promise<Board[]> => {
        const response = await apiClient.get('/boards');
        return response.data.data;
    },

    // Get a single board by id
    getBoard: async (id: string): Promise<Board> => {
        const response = await apiClient.get(`/boards/${id}`);
        return response.data.data;
    },

    // Create a new board
    createBoard: async (boardData: CreateBoardRequest): Promise<Board> => {
        const response = await apiClient.post('/boards', boardData);
        return response.data.data;
    },

    // Update a board
    updateBoard: async (id: string, boardData: UpdateBoardRequest): Promise<Board> => {
        const response = await apiClient.put(`/boards/${id}`, boardData);
        return response.data.data;
    },

    // Delete a board
    deleteBoard: async (id: string): Promise<void> => {
        await apiClient.delete(`/boards/${id}`);
    }
};
