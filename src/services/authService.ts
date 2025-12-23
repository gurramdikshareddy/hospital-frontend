import { apiRequest } from './api';
import { User } from '@/types/hospital';

interface LoginRequest {
  user_id: string;
  password: string;
  role: 'admin' | 'doctor';
}

interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  logout(): void {
    localStorage.removeItem('auth_token');
  },

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  },
};
