import { apiClient } from '../api/config';

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

class CreateRegistrationOfficerService {
  private readonly baseURL = 'auth';

  async createRegistrationOfficer(officerData: CreateOfficerRequest): Promise<CreateOfficerResponse> {
    try {
      // Get the access token for authentication
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found. Please log in again.');
      }

      // Add user_type as registration_officer by default
      const requestData = {
        ...officerData,
        user_type: 'registration_officer' as const
      };

      const response = await apiClient.post(`${this.baseURL}/create-user`, requestData, {
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

  async createUser(userData: CreateOfficerRequest): Promise<CreateOfficerResponse> {
    try {
      // Get the access token for authentication
      const accessToken = localStorage.getItem('access_token');
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

  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 403) {
        return new Error(data.detail || 'Only administrators can create users.');
      } else if (status === 401) {
        return new Error('Authentication required. Please log in again.');
      } else if (status === 400) {
        // Handle validation errors based on new API documentation
        if (data.detail) {
          return new Error(data.detail);
        } else if (data.username) {
          return new Error(Array.isArray(data.username) ? data.username[0] : data.username);
        } else if (data.email) {
          return new Error(Array.isArray(data.email) ? data.email[0] : data.email);
        } else if (data.non_field_errors) {
          return new Error(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors);
        } else if (data.full_name) {
          return new Error(Array.isArray(data.full_name) ? data.full_name[0] : data.full_name);
        } else if (data.password) {
          return new Error(Array.isArray(data.password) ? data.password[0] : data.password);
        } else if (data.confirm_password) {
          return new Error(Array.isArray(data.confirm_password) ? data.confirm_password[0] : data.confirm_password);
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

export default new CreateRegistrationOfficerService();