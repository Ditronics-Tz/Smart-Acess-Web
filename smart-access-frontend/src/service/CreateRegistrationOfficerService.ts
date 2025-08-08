import { apiClient } from '../api/config';

export interface CreateOfficerRequest {
  username: string;
  full_name: string;
  email: string;
  phone_number?: string;
  password: string;
  confirm_password: string;
}

export interface CreateOfficerResponse {
  message: string;
  officer_id: string;
  username: string;
  email: string;
}

class CreateRegistrationOfficerService {
  private readonly baseURL = '/auth';

  async createRegistrationOfficer(officerData: CreateOfficerRequest): Promise<CreateOfficerResponse> {
    try {
      const response = await apiClient.post(`${this.baseURL}/create-registration-officer`, officerData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 403) {
        return new Error(data.detail || 'Only administrators can create registration officers.');
      } else if (status === 400) {
        // Handle validation errors
        if (data.detail) {
          return new Error(data.detail);
        } else if (data.username) {
          return new Error(`Username: ${data.username[0]}`);
        } else if (data.email) {
          return new Error(`Email: ${data.email[0]}`);
        } else if (data.non_field_errors) {
          return new Error(data.non_field_errors[0]);
        } else if (data.full_name) {
          return new Error(`Full name: ${data.full_name[0]}`);
        } else if (data.password) {
          return new Error(`Password: ${data.password[0]}`);
        }
        return new Error('Validation error occurred.');
      } else if (status === 401) {
        return new Error('Authentication required. Please log in again.');
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