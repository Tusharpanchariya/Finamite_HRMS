export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  paymentstatus: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  paymentstatus?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}