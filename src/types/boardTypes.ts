export interface Board {
    id: string;
    title: string;
    description: string;
    slug: string;
    creatorID: number;
    backgroundType: string;
    backgroundImageURL: string;
    backgroundcolor: string;
    themeID?: number;
    isPrivate: boolean;
    allowAnonymous: boolean;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
    creator?: {
        id: number;
        name: string;
        email: string;
        profilePicture?: string;
    };
    postCount?: number;
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

export interface Theme {
    id: number;
    name: string;
    description: string;
    backgroundColor: string;
    backgroundImageURL: string;
    additionalStyles: string;
    isDefault: boolean;
}
