import { apiClient } from '../api/config';
import { AxiosResponse } from 'axios';

// Staff model interfaces
export interface Staff {
  staff_uuid: string;
  surname: string;
  first_name: string;
  middle_name?: string;
  mobile_phone?: string;
  staff_number: string;
  department: string;
  position: string;
  employment_status: 'Active' | 'Inactive' | 'Terminated' | 'Retired' | 'On Leave';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStaffRequest {
  surname: string;
  first_name: string;
  middle_name?: string;
  mobile_phone?: string;
  staff_number: string;
  department: string;
  position: string;
  employment_status?: 'Active' | 'Inactive' | 'Terminated' | 'Retired' | 'On Leave';
}

export interface UpdateStaffRequest {
  surname?: string;
  first_name?: string;
  middle_name?: string;
  mobile_phone?: string;
  staff_number?: string;
  department?: string;
  position?: string;
  employment_status?: 'Active' | 'Inactive' | 'Terminated' | 'Retired' | 'On Leave';
}

export interface StaffListParams {
  page?: number;
  page_size?: number;
  search?: string;
  department?: string;
  employment_status?: string;
  is_active?: boolean;
  ordering?: string;
}

export interface StaffListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Staff[];
  summary: {
    total_staff: number;
    active_staff: number;
    inactive_staff: number;
  };
  user_permissions: {
    current_user: string;
    user_type: string;
    can_create: boolean;
    can_modify: boolean;
    can_delete: boolean;
  };
}

export interface StaffDetailsResponse extends Staff {
  user_permissions: {
    can_modify: boolean;
    can_delete: boolean;
  };
  photo?: {
    url: string;
    uploaded_at: string;
  };
}

export interface CreateStaffResponse extends Staff {
  created_by: {
    username: string;
    user_type: string;
    full_name: string;
  };
}

export interface CSVUploadResponse {
  success: boolean;
  message: string;
  data: {
    total_created: number;
    total_skipped: number;
    skipped_records: any[];
    staff_members: Staff[];
    uploaded_by: {
      username: string;
      user_type: string;
      full_name: string;
      upload_timestamp: string;
    };
  };
}

export interface PhotoUploadResponse {
  success: boolean;
  message: string;
  data: {
    staff_uuid: string;
    staff_number: string;
    photo_url: string;
    uploaded_at: string;
    uploaded_by: {
      username: string;
      user_type: string;
      full_name: string;
    };
  };
}

export interface ValidationInfoResponse {
  required_fields: string[];
  optional_fields: string[];
  employment_status_choices: string[];
  file_requirements: {
    format: string;
    max_size: string;
    encoding: string;
  };
  validation_rules: {
    staff_number: string;
    mobile_phone: string;
    employment_status: string;
    department: string;
    position: string;
  };
  user_permissions: {
    current_user: string;
    user_type: string;
    can_create: boolean;
    can_upload_csv: boolean;
    can_download_template: boolean;
    can_upload_photos: boolean;
    can_modify: boolean;
    can_delete: boolean;
  };
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errors?: string | Record<string, string[]>;
  detail?: string;
  [key: string]: any;
}

class StaffService {
  private readonly baseURL = '/api/staff';

  /**
   * Get list of staff members with optional filtering and pagination
   */
  async getStaffList(params?: StaffListParams): Promise<StaffListResponse> {
    try {
      const response: AxiosResponse<StaffListResponse> = await apiClient.get(
        this.baseURL + '/',
        { params }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get detailed information about a specific staff member
   */
  async getStaffDetails(staffUuid: string): Promise<StaffDetailsResponse> {
    try {
      const response: AxiosResponse<StaffDetailsResponse> = await apiClient.get(
        `${this.baseURL}/${staffUuid}/`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new staff member
   */
  async createStaff(staffData: CreateStaffRequest): Promise<CreateStaffResponse> {
    try {
      const response: AxiosResponse<CreateStaffResponse> = await apiClient.post(
        this.baseURL + '/',
        staffData
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Update an existing staff member (full update)
   */
  async updateStaff(staffUuid: string, staffData: UpdateStaffRequest): Promise<Staff> {
    try {
      const response: AxiosResponse<Staff> = await apiClient.put(
        `${this.baseURL}/${staffUuid}/`,
        staffData
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Partially update an existing staff member
   */
  async patchStaff(staffUuid: string, staffData: Partial<UpdateStaffRequest>): Promise<Staff> {
    try {
      const response: AxiosResponse<Staff> = await apiClient.patch(
        `${this.baseURL}/${staffUuid}/`,
        staffData
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a staff member
   */
  async deleteStaff(staffUuid: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseURL}/${staffUuid}/`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload CSV file containing staff data
   */
  async uploadCSV(csvFile: File): Promise<CSVUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('csv_file', csvFile);

      const response: AxiosResponse<CSVUploadResponse> = await apiClient.post(
        `${this.baseURL}/upload-csv/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Download CSV template for staff data
   */
  async downloadCSVTemplate(): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await apiClient.get(
        `${this.baseURL}/csv-template/`,
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload photo for a staff member
   */
  async uploadStaffPhoto(staffUuid: string, photoFile: File): Promise<PhotoUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);

      const response: AxiosResponse<PhotoUploadResponse> = await apiClient.post(
        `${this.baseURL}/${staffUuid}/upload-photo/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get validation information and user permissions
   */
  async getValidationInfo(): Promise<ValidationInfoResponse> {
    try {
      const response: AxiosResponse<ValidationInfoResponse> = await apiClient.get(
        `${this.baseURL}/validation-info/`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Search staff members by query string
   */
  async searchStaff(query: string, additionalParams?: Omit<StaffListParams, 'search'>): Promise<StaffListResponse> {
    try {
      const params = { search: query, ...additionalParams };
      return await this.getStaffList(params);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get staff by department
   */
  async getStaffByDepartment(department: string, additionalParams?: Omit<StaffListParams, 'department'>): Promise<StaffListResponse> {
    try {
      const params = { department, ...additionalParams };
      return await this.getStaffList(params);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get staff by employment status
   */
  async getStaffByEmploymentStatus(employmentStatus: string, additionalParams?: Omit<StaffListParams, 'employment_status'>): Promise<StaffListResponse> {
    try {
      const params = { employment_status: employmentStatus, ...additionalParams };
      return await this.getStaffList(params);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get active/inactive staff
   */
  async getStaffByActiveStatus(isActive: boolean, additionalParams?: Omit<StaffListParams, 'is_active'>): Promise<StaffListResponse> {
    try {
      const params = { is_active: isActive, ...additionalParams };
      return await this.getStaffList(params);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate staff number uniqueness
   */
  async validateStaffNumber(staffNumber: string, excludeUuid?: string): Promise<boolean> {
    try {
      const response = await this.searchStaff(staffNumber);
      const existingStaff = response.results.find(staff => 
        staff.staff_number === staffNumber && staff.staff_uuid !== excludeUuid
      );
      return !existingStaff; // Return true if staff number is available
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Helper method to download CSV template with proper filename
   */
  async downloadCSVTemplateWithFilename(): Promise<void> {
    try {
      const blob = await this.downloadCSVTemplate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'staff_template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Bulk operations helper - check if user can perform bulk operations
   */
  async canPerformBulkOperations(): Promise<boolean> {
    try {
      const validationInfo = await this.getValidationInfo();
      return validationInfo.user_permissions.can_upload_csv && 
             validationInfo.user_permissions.can_create;
    } catch (error: any) {
      return false;
    }
  }

  /**
   * Get employment status options
   */
  async getEmploymentStatusOptions(): Promise<string[]> {
    try {
      const validationInfo = await this.getValidationInfo();
      return validationInfo.employment_status_choices;
    } catch (error: any) {
      // Fallback to default options if API call fails
      return ['Active', 'Inactive', 'Terminated', 'Retired', 'On Leave'];
    }
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: any): Error {
    console.error('Staff Service Error:', error);

    if (error.response) {
      const errorData = error.response.data as ApiErrorResponse;
      
      // Handle validation errors
      if (error.response.status === 400 && errorData.errors) {
        if (typeof errorData.errors === 'string') {
          throw new Error(errorData.errors);
        } else if (typeof errorData.errors === 'object') {
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('; ');
          throw new Error(errorMessages);
        }
      }

      // Handle other error responses
      if (errorData.message) {
        throw new Error(errorData.message);
      }

      if (errorData.detail) {
        throw new Error(errorData.detail);
      }

      // Generic error based on status code
      switch (error.response.status) {
        case 401:
          throw new Error('Authentication required. Please log in again.');
        case 403:
          throw new Error('You do not have permission to perform this action.');
        case 404:
          throw new Error('Staff member not found.');
        case 500:
          throw new Error('Internal server error. Please try again later.');
        default:
          throw new Error(`Request failed with status ${error.response.status}`);
      }
    }

    if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    throw new Error(error.message || 'An unexpected error occurred.');
  }
}

// Export singleton instance
const staffService = new StaffService();
export default staffService;

// Export the class for testing purposes
export { StaffService };
