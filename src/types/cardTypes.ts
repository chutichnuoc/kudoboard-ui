export interface Card {
  id: string;
  boardId: string;
  author: string;
  message: string;
  imageUrl?: string;
  backgroundColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardRequest {
  boardId: string;
  author: string;
  message: string;
  imageUrl?: string;
  backgroundColor?: string;
}

export interface UpdateCardRequest {
  author?: string;
  message?: string;
  imageUrl?: string;
  backgroundColor?: string;
}
