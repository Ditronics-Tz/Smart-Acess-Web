import { apiClient } from '../api/config';

// Interfaces based on the API documentation
export interface RegistrationOfficer {
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  phone_number?: string;
  user_type: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  failed_login_attempts: number;
  account_locked: boolean;
}

export interface RegistrationOfficersListResponse {
  registration_officers: RegistrationOfficer[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
    page_size: number;
  };
}

export interface UserDetailsResponse {
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  phone_number?: string;
  user_type: string;
  is_active: boolean;
}

export interface ChangePasswordRequest {
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface DeactivateUserResponse {
  message: string;
}

export interface UserManagementFilters {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
}

class UserManagementService {
  private readonly baseURL = 'auth';

  // Helper method to ensure we have a valid token
  private getAuthHeaders() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please log in again.');
    }

    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * List all registration officers with optional filters and pagination
   */
  async listRegistrationOfficers(filters?: UserManagementFilters): Promise<RegistrationOfficersListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }

      // Fixed: Remove trailing slash from the endpoint
      const url = queryParams.toString()
        ? `${this.baseURL}/registration-officers?${queryParams.toString()}`
        : `${this.baseURL}/registration-officers`;

      const response = await apiClient.get(url, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get detailed information about a specific registration officer
   */
  async getRegistrationOfficer(userId: string): Promise<UserDetailsResponse> {
    try {
      // Fixed: Remove trailing slash from the endpoint
      const response = await apiClient.get(`${this.baseURL}/users/${userId}`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Change password for a registration officer (admin only)
   */
  async changeOfficerPassword(userId: string, passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      // Validate password data before sending
      if (!passwordData.new_password || !passwordData.confirm_password) {
        throw new Error('Both new_password and confirm_password are required.');
      }

      if (passwordData.new_password !== passwordData.confirm_password) {
        throw new Error('Passwords do not match.');
      }

      if (passwordData.new_password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }

      const response = await apiClient.patch(`${this.baseURL}/users/${userId}/change-password`, passwordData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Deactivate a registration officer account
   */
  async deactivateRegistrationOfficer(userId: string): Promise<DeactivateUserResponse> {
    try {
      const response = await apiClient.patch(`${this.baseURL}/users/${userId}/deactivate`, {}, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get active registration officers only
   */
  async getActiveRegistrationOfficers(page?: number, pageSize?: number): Promise<RegistrationOfficersListResponse> {
    return this.listRegistrationOfficers({
      is_active: true,
      page,
      page_size: pageSize
    });
  }

  /**
   * Get inactive registration officers only
   */
  async getInactiveRegistrationOfficers(page?: number, pageSize?: number): Promise<RegistrationOfficersListResponse> {
    return this.listRegistrationOfficers({
      is_active: false,
      page,
      page_size: pageSize
    });
  }

  /**
   * Search registration officers by name, username, or email
   */
  async searchRegistrationOfficers(searchTerm: string, page?: number, pageSize?: number): Promise<RegistrationOfficersListResponse> {
    return this.listRegistrationOfficers({
      search: searchTerm,
      page,
      page_size: pageSize
    });
  }

  /**
   * Get registration officers with pagination
   */
  async getRegistrationOfficersPage(page: number, pageSize: number = 10): Promise<RegistrationOfficersListResponse> {
    return this.listRegistrationOfficers({
      page,
      page_size: pageSize
    });
  }

  /**
   * Check if a user account is locked
   */
  async isUserAccountLocked(userId: string): Promise<boolean> {
    try {
      const userDetails = await this.getRegistrationOfficer(userId);
      return userDetails.is_active === false;
    } catch (error) {
      // If we can't get user details, assume account is not locked
      return false;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(): Promise<{
    total_users: number;
    active_users: number;
    inactive_users: number;
    locked_accounts: number;
  }> {
    try {
      const allUsers = await this.listRegistrationOfficers({ page_size: 1000 }); // Get all users

      const stats = {
        total_users: allUsers.pagination.total_count,
        active_users: allUsers.registration_officers.filter(user => user.is_active).length,
        inactive_users: allUsers.registration_officers.filter(user => !user.is_active).length,
        locked_accounts: allUsers.registration_officers.filter(user => user.account_locked).length
      };

      return stats;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Error handler for API responses
   */
  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        return new Error(data.detail || 'Authentication required. Please log in again.');
      } else if (status === 403) {
        return new Error(data.detail || 'You do not have permission to perform this action.');
      } else if (status === 404) {
        return new Error(data.detail || 'User not found.');
      } else if (status === 400) {
        // Handle validation errors
        if (data.detail) {
          return new Error(data.detail);
        } else if (data.new_password) {
          return new Error(Array.isArray(data.new_password) ? data.new_password[0] : data.new_password);
        } else if (data.confirm_password) {
          return new Error(Array.isArray(data.confirm_password) ? data.confirm_password[0] : data.confirm_password);
        } else if (data.non_field_errors) {
          return new Error(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors);
        }
        return new Error('Validation error occurred.');
      } else if (status === 429) {
        return new Error(data.detail || 'Too many requests. Please try again later.');
      }

      return new Error(data.detail || 'An error occurred during the request.');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }
}

export default new UserManagementService();