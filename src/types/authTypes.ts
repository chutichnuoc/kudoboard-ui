export interface User {
  id: number;
  name: string;
  email: string;
  profile_picture?: string;
  is_verified: boolean;
  auth_provider: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}
