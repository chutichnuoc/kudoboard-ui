export interface Board {
    id: string;
    title: string;
    description?: string;
    coverImage?: string;
    createdAt: string;
    updatedAt: string;
    ownerId?: string;
    isPublic: boolean;
}

export interface CreateBoardRequest {
    title: string;
    description?: string;
    coverImage?: string;
    isPublic?: boolean;
}

export interface UpdateBoardRequest {
    title?: string;
    description?: string;
    coverImage?: string;
    isPublic?: boolean;
}
