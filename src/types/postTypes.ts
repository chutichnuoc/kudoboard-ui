// src/types/postTypes.ts
export interface Post {
  id: string;
  boardId: string;
  author: string;  // Maps to authorName in backend
  message: string; // Maps to content in backend
  imageUrl?: string;
  backgroundColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  boardId: string;
  author: string;
  message: string;
  imageUrl?: string;
  backgroundColor?: string;
}

export interface UpdatePostRequest {
  author?: string;
  message?: string;
  imageUrl?: string;
  backgroundColor?: string;
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
