// src/api/postApi.ts
import apiClient from './apiClient';
import { Post, CreatePostRequest, UpdatePostRequest } from '../types/postTypes';

export const postApi = {
    // Create a new post for an authenticated user
    createPost: async (postData: CreatePostRequest): Promise<Post> => {
        const formattedData = {
            content: postData.message,
            author_name: postData.author,
            background_color: postData.background_color || '#ffffff',
            text_color: '#000000',
            is_anonymous: false
        };

        console.log('Creating post with data:', formattedData);
        console.log('For board ID:', postData.boardId);

        const response = await apiClient.post(`/boards/${postData.boardId}/posts`, formattedData);
        console.log('Create post response:', response.data);

        return transformResponseToPost(response.data);
    },

    // Create an anonymous post
    createAnonymousPost: async (postData: CreatePostRequest): Promise<Post> => {
        const formattedData = {
            content: postData.message,
            author_name: postData.author,
            background_color: postData.background_color || '#ffffff',
            text_color: '#000000',
            is_anonymous: true
        };

        console.log('Creating anonymous post with data:', formattedData);
        console.log('For board ID:', postData.boardId);

        const response = await apiClient.post(`/anonymous/boards/${postData.boardId}/posts`, formattedData);
        console.log('Create anonymous post response:', response.data);

        return transformResponseToPost(response.data);
    },

    // Update a post
    updatePost: async (postId: string, postData: UpdatePostRequest): Promise<Post> => {
        const formattedData: any = {};

        if (postData.message !== undefined) formattedData.content = postData.message;
        if (postData.background_color !== undefined) formattedData.background_color = postData.background_color;
        if (postData.text_color !== undefined) formattedData.text_color = postData.text_color;

        const response = await apiClient.put(`/posts/${postId}`, formattedData);
        return transformResponseToPost(response.data);
    },

    // Delete a post
    deletePost: async (postId: string): Promise<void> => {
        await apiClient.delete(`/posts/${postId}`);
    },

    // Like a post
    likePost: async (postId: string): Promise<number> => {
        const response = await apiClient.post(`/posts/${postId}/like`);
        return response.data?.likes_count || 0;
    },

    // Unlike a post
    unlikePost: async (postId: string): Promise<number> => {
        const response = await apiClient.delete(`/posts/${postId}/like`);
        return response.data?.likes_count || 0;
    },

    reorderPosts: async (boardId: string, postOrders: { id: string, positionOrder: number }[]): Promise<void> => {
        // Convert the post orders to the format expected by the backend
        // The backend expects IDs as integers, so we need to parse them
        const formattedData = {
            post_orders: postOrders.map(order => ({
                id: parseInt(order.id), // Convert to number if backend expects a number
                position_order: order.positionOrder
            }))
        };

        console.log('Sending reorder request:', { boardId, formattedData });

        try {
            // Make the API call
            await apiClient.put(`/boards/${boardId}/posts/reorder`, formattedData);
        } catch (error) {
            console.error('Error reordering posts:', error);
            throw error;
        }
    }
};

// Helper function to transform backend response to Post format with safe handling of undefined
function transformResponseToPost(data: any): Post {
    if (!data) {
        console.error('No data received from API');
        // Return a default post with empty values
        return {
            id: '0',
            board_id: '0',
            author: 'Unknown',
            message: '',
            background_color: '#ffffff',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }

    // Add safe string conversion for values that might be undefined
    const safeToString = (value: any): string => {
        return value !== undefined && value !== null ? String(value) : '';
    };

    return {
        id: safeToString(data.id),
        board_id: safeToString(data.boardID || data.boardId),
        author: data.authorName || 'Unknown',
        message: data.content || '',
        background_color: data.backgroundColor || '#ffffff',
        image_url: data.media?.length > 0 ? data.media[0].sourceURL : undefined,
        created_at: data.createdAt || new Date().toISOString(),
        updated_at: data.updatedAt || new Date().toISOString()
    };
}