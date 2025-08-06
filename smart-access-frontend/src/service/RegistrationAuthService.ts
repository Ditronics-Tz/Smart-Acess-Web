import { apiClient } from '../api/config';

export interface LoginRequest {
  username: string;
  password: string;
  user_type: 'registration_officer';
}

export interface LoginResponse {
  session_id: string;
  message: string;
}

export interface OTPVerifyRequest {
  session_id: string;
  otp_code: string;
  user_type: 'registration_officer';
}

export interface OTPVerifyResponse {
  access: string;
  refresh: string;
  user_type: string;
  user_id: string;
  username: string;
}

export interface ResendOTPRequest {
  session_id: string;
  user_type: 'registration_officer';
}

class RegistrationAuthService {
  private readonly baseURL = '/auth';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post(`${this.baseURL}/login`, credentials);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async verifyOTP(otpData: OTPVerifyRequest): Promise<OTPVerifyResponse> {
    try {
      const response = await apiClient.post(`${this.baseURL}/verify-otp`, otpData);
      
      // Store tokens
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_type', response.data.user_type);
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('username', response.data.username);
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async resendOTP(resendData: ResendOTPRequest): Promise<{ message: string; session_id: string }> {
    try {
      const response = await apiClient.post(`${this.baseURL}/resend-otp`, resendData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await apiClient.post(`${this.baseURL}/logout`, { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all stored data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getUserType(): string | null {
    return localStorage.getItem('user_type');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        return new Error(data.detail || 'Invalid credentials.');
      } else if (status === 403) {
        return new Error(data.detail || 'Account is locked.');
      } else if (status === 429) {
        return new Error(data.detail || 'Too many attempts. Please try again later.');
      } else if (status === 400) {
        return new Error(data.detail || 'Validation error occurred.');
      }
      
      return new Error(data.detail || 'An error occurred during the request.');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    }

        return new Error('An unexpected error occurred.');
      }
    }