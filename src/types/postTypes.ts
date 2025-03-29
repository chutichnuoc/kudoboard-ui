// src/types/postTypes.ts
export interface Post {
  id: string;
  boardId: string;
  author: string;  // Maps to authorName in backend
  authorId?: string; // Add this line - Maps to authorID in backend
  message: string; // Maps to content in backend
  imageUrl?: string;
  background_color?: string;
  text_color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  boardId: string;
  author: string;
  message: string;
  imageUrl?: string;
  background_color?: string;
  text_color?: string;
}

export interface UpdatePostRequest {
  author?: string;
  message?: string;
  imageUrl?: string;
  background_color?: string;
  text_color?: string;
}

// This interface represents the Media type from the backend
export interface Media {
  id: number;
  postId: number;
  type: string;
  sourceType: string;
  sourceURL: string;
  externalId?: string;
  thumbnailURL?: string;
  createdAt: string;
}
