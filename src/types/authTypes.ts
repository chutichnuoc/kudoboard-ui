export interface User {
  id: number;
  name: string;
  email: string;
  profilePicture?: string;
  isVerified: boolean;
  authProvider: string;
  createdAt: string;
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
