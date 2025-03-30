export interface Board {
    id: string;
    title: string;
    description: string;
    slug: string;
    creator_id: number;
    background_type: string;
    background_image_url: string;
    background_color: string;
    theme_id?: number;
    is_private: boolean;
    allow_anonymous: boolean;
    expires_at?: string;
    created_at: string;
    updated_at: string;
    creator?: {
        id: number;
        name: string;
        email: string;
        profile_picture?: string;
    };
    post_count?: number;
}

export interface CreateBoardRequest {
    title: string;
    description?: string;
    cover_image?: string;
    is_public?: boolean;
}

export interface UpdateBoardRequest {
    title?: string;
    description?: string;
    cover_image?: string;
    is_public?: boolean;
}

export interface Theme {
    id: number;
    name: string;
    description: string;
    background_color: string;
    background_image_url: string;
    additional_styles: string;
    is_default: boolean;
}
