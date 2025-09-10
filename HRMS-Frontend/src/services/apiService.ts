import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest 
} from '../types/auth.types';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    return this.handleResponse(response);
  }

  async register(userData: RegisterRequest): Promise<{ message: string; userId: number }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    return this.handleResponse(response);
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  async deleteAccount(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/1`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();