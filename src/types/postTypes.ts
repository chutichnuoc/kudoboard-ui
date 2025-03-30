// src/types/postTypes.ts
export interface Post {
  id: string;
  board_id: string;
  author: string;  // Maps to authorName in backend
  author_id?: string; // Maps to authorID in backend
  message: string; // Maps to content in backend
  image_url?: string;
  background_color?: string;
  text_color?: string;
  position_order?: number; // Added for drag and drop ordering
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  boardId: string;
  author: string;
  message: string;
  image_url?: string;
  background_color?: string;
  text_color?: string;
}

export interface UpdatePostRequest {
  author?: string;
  message?: string;
  image_url?: string;
  background_color?: string;
  text_color?: string;
}

// This interface represents the Media type from the backend
export interface Media {
  id: number;
  post_id: number;
  type: string;
  source_type: string;
  source_url: string;
  external_id?: string;
  thumbnail_url?: string;
  created_at: string;
}