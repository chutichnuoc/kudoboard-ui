import apiClient from './apiClient';
import { Card, CreateCardRequest, UpdateCardRequest } from '../types/cardTypes';

export const cardApi = {
    // Get all cards for a board
    getBoardCards: async (boardId: string): Promise<Card[]> => {
        const response = await apiClient.get(`/boards/${boardId}/cards`);
        return response.data.data;
    },

    // Get a single card
    getCard: async (boardId: string, cardId: string): Promise<Card> => {
        const response = await apiClient.get(`/boards/${boardId}/cards/${cardId}`);
        return response.data.data;
    },

    // Create a new card
    createCard: async (cardData: CreateCardRequest): Promise<Card> => {
        const response = await apiClient.post(`/boards/${cardData.boardId}/cards`, cardData);
        return response.data.data;
    },

    // Update a card
    updateCard: async (boardId: string, cardId: string, cardData: UpdateCardRequest): Promise<Card> => {
        const response = await apiClient.put(`/boards/${boardId}/cards/${cardId}`, cardData);
        return response.data.data;
    },

    // Delete a card
    deleteCard: async (boardId: string, cardId: string): Promise<void> => {
        await apiClient.delete(`/boards/${boardId}/cards/${cardId}`);
    }
};
