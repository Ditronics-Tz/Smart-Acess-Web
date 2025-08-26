import { apiClient } from '../api/config';

export interface LoginRequest {
  username: string;
  password: string;
  user_type: 'administrator' | 'registration_officer';
}

// Updated LoginResponse to match the new API response
export interface LoginResponse {
  access: string;
  refresh: string;
  user_type: string;
  user_id: string;
  username: string;
  message: string;
}

// Keep OTP interfaces for future use but mark as unused
export interface OTPVerifyRequest {
  session_id: string;
  otp_code: string;
  user_type: 'administrator' | 'registration_officer';
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
  user_type: 'administrator' | 'registration_officer';
}

export interface CreateOfficerRequest {
  username: string;
  full_name: string;
  email: string;
  phone_number?: string;
  user_type: 'administrator' | 'registration_officer';
  password: string;
  confirm_password: string;
}

export interface CreateOfficerResponse {
  message: string;
  user_id: string;
  username: string;
  email: string;
}

export interface CreateUserRequest {
  username: string;
  full_name: string;
  email: string;
  phone_number?: string;
  user_type: 'administrator' | 'registration_officer';
  password: string;
  confirm_password: string;
}

export interface CreateUserResponse {
  message: string;
  user_id: string;
  username: string;
  email: string;
}

class AuthService {
  private readonly baseURL = '/auth';

  // Updated login method to handle direct JWT token response
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post(`${this.baseURL}/login`, credentials);
      
      // Store tokens immediately since OTP is disabled
      const { access, refresh, user_type, user_id, username } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_type', user_type);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('username', username);
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Keep OTP methods for future use but mark as unused
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

  // Updated to use the new create-user endpoint
  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token found. Please log in again.');
      }

      const response = await apiClient.post(`${this.baseURL}/create-user`, userData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const accessToken = localStorage.getItem('access_token');
      
      if (refreshToken && accessToken) {
        // Use axios directly to avoid interceptor issues during logout
        const response = await fetch(`${window.location.origin}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refresh: refreshToken })
        });
        
        // Don't throw error if logout fails on server side
        if (!response.ok) {
          console.warn('Server logout failed, but clearing local tokens anyway');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Don't throw error, just log it and continue with local cleanup
    } finally {
      // Always clear all stored data regardless of server response
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
    }
  }

  async refreshToken(): Promise<{ access: string; refresh: string }> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiClient.post(`${this.baseURL}/refresh`, { refresh: refreshToken });
      
      // Update stored tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      return response.data;
    } catch (error: any) {
      // If refresh fails, clear all tokens
      this.logout();
      throw this.handleError(error);
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

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Handle specific error responses
      const { status, data } = error.response;
      
      if (status === 401) {
        return new Error(data.detail || 'Invalid credentials.');
      } else if (status === 403) {
        return new Error(data.detail || 'Account is locked.');
      } else if (status === 429) {
        return new Error(data.detail || 'Too many attempts. Please try again later.');
      } else if (status === 400) {
        // Handle validation errors
        if (data.detail) {
          return new Error(data.detail);
        } else if (data.username) {
          return new Error(data.username[0]);
        } else if (data.email) {
          return new Error(data.email[0]);
        } else if (data.non_field_errors) {
          return new Error(data.non_field_errors[0]);
        }
        return new Error('Validation error occurred.');
      }
      
      return new Error(data.detail || 'An error occurred during the request.');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }
}

export default new AuthService();