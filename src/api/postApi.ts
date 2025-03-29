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

    // Add this to postApi.ts:
    reorderPosts: async (boardId: string, postOrders: { id: string, positionOrder: number }[]): Promise<void> => {
        const formattedData = {
            post_orders: postOrders.map(order => ({
                id: parseInt(order.id),
                position_order: order.positionOrder
            }))
        };

        await apiClient.put(`/boards/${boardId}/posts/reorder`, formattedData);
    }
};

// Helper function to transform backend response to Post format with safe handling of undefined
function transformResponseToPost(data: any): Post {
    if (!data) {
        console.error('No data received from API');
        // Return a default post with empty values
        return {
            id: '0',
            boardId: '0',
            author: 'Unknown',
            message: '',
            background_color: '#ffffff',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    // Add safe string conversion for values that might be undefined
    const safeToString = (value: any): string => {
        return value !== undefined && value !== null ? String(value) : '';
    };

    return {
        id: safeToString(data.id),
        boardId: safeToString(data.boardID || data.boardId),
        author: data.authorName || 'Unknown',
        message: data.content || '',
        background_color: data.backgroundColor || '#ffffff',
        imageUrl: data.media?.length > 0 ? data.media[0].sourceURL : undefined,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
    };
}