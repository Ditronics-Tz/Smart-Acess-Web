import { apiClient } from '../api/config';

// Interfaces based on the API documentation
export interface SecurityPersonnel {
  security_id: string;
  employee_id: string;
  badge_number: string;
  full_name: string;
  phone_number?: string;
  hire_date?: string;
  termination_date?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateSecurityPersonnelRequest {
  employee_id: string;
  badge_number: string;
  full_name: string;
  phone_number?: string;
  hire_date?: string;
}

export interface UpdateSecurityPersonnelRequest {
  employee_id?: string;
  badge_number?: string;
  full_name?: string;
  phone_number?: string;
  hire_date?: string;
  termination_date?: string | null;
  is_active?: boolean;
}

export interface SecurityPersonnelListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SecurityPersonnel[];
}

export interface SecurityPersonnelFilters {
  employee_id?: string;
  badge_number?: string;
  full_name?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}

export interface ApiResponse {
  message: string;
}

class SecurityPersonelService {
  private readonly baseURL = '/api/administrator/security-personnel';

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
   * List all security personnel with optional filters and pagination
   */
  async listSecurityPersonnel(filters?: SecurityPersonnelFilters): Promise<SecurityPersonnelListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }

      const url = queryParams.toString() 
        ? `${this.baseURL}/?${queryParams.toString()}`
        : `${this.baseURL}/`;

      const response = await apiClient.get(url, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new security personnel
   */
  async createSecurityPersonnel(data: CreateSecurityPersonnelRequest): Promise<SecurityPersonnel> {
    try {
      const response = await apiClient.post(`${this.baseURL}/create/`, data, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get specific security personnel by ID
   */
  async getSecurityPersonnel(securityId: string): Promise<SecurityPersonnel> {
    try {
      const response = await apiClient.get(`${this.baseURL}/${securityId}/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Update security personnel (full update - PUT)
   */
  async updateSecurityPersonnel(securityId: string, data: UpdateSecurityPersonnelRequest): Promise<SecurityPersonnel> {
    try {
      const response = await apiClient.put(`${this.baseURL}/${securityId}/update/`, data, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Partially update security personnel (partial update - PATCH)
   */
  async partialUpdateSecurityPersonnel(securityId: string, data: Partial<UpdateSecurityPersonnelRequest>): Promise<SecurityPersonnel> {
    try {
      const response = await apiClient.patch(`${this.baseURL}/${securityId}/update/`, data, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Soft delete security personnel
   */
  async deleteSecurityPersonnel(securityId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete(`${this.baseURL}/${securityId}/delete/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Restore deleted security personnel
   */
  async restoreSecurityPersonnel(securityId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(`${this.baseURL}/${securityId}/restore/`, {}, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get active security personnel only
   */
  async getActiveSecurityPersonnel(page?: number, pageSize?: number): Promise<SecurityPersonnelListResponse> {
    return this.listSecurityPersonnel({
      is_active: true,
      page,
      page_size: pageSize
    });
  }

  /**
   * Get inactive security personnel only
   */
  async getInactiveSecurityPersonnel(page?: number, pageSize?: number): Promise<SecurityPersonnelListResponse> {
    return this.listSecurityPersonnel({
      is_active: false,
      page,
      page_size: pageSize
    });
  }

  /**
   * Search security personnel by name
   */
  async searchSecurityPersonnelByName(name: string, page?: number, pageSize?: number): Promise<SecurityPersonnelListResponse> {
    return this.listSecurityPersonnel({
      full_name: name,
      page,
      page_size: pageSize
    });
  }

  /**
   * Get security personnel by employee ID
   */
  async getSecurityPersonnelByEmployeeId(employeeId: string): Promise<SecurityPersonnelListResponse> {
    return this.listSecurityPersonnel({
      employee_id: employeeId
    });
  }

  /**
   * Get security personnel by badge number
   */
  async getSecurityPersonnelByBadgeNumber(badgeNumber: string): Promise<SecurityPersonnelListResponse> {
    return this.listSecurityPersonnel({
      badge_number: badgeNumber
    });
  }

  /**
   * Deactivate security personnel (set is_active to false)
   */
  async deactivateSecurityPersonnel(securityId: string, terminationDate?: string): Promise<SecurityPersonnel> {
    const updateData: Partial<UpdateSecurityPersonnelRequest> = {
      is_active: false
    };

    if (terminationDate) {
      updateData.termination_date = terminationDate;
    }

    return this.partialUpdateSecurityPersonnel(securityId, updateData);
  }

  /**
   * Reactivate security personnel (set is_active to true and clear termination date)
   */
  async reactivateSecurityPersonnel(securityId: string): Promise<SecurityPersonnel> {
    return this.partialUpdateSecurityPersonnel(securityId, {
      is_active: true,
      termination_date: null
    });
  }

  /**
   * Update contact information
   */
  async updateContactInfo(securityId: string, phoneNumber: string): Promise<SecurityPersonnel> {
    return this.partialUpdateSecurityPersonnel(securityId, {
      phone_number: phoneNumber
    });
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
        return new Error(data.detail || 'Security personnel not found.');
      } else if (status === 400) {
        // Handle validation errors
        if (data.detail) {
          return new Error(data.detail);
        } else if (data.employee_id) {
          return new Error(Array.isArray(data.employee_id) ? data.employee_id[0] : data.employee_id);
        } else if (data.badge_number) {
          return new Error(Array.isArray(data.badge_number) ? data.badge_number[0] : data.badge_number);
        } else if (data.full_name) {
          return new Error(Array.isArray(data.full_name) ? data.full_name[0] : data.full_name);
        } else if (data.phone_number) {
          return new Error(Array.isArray(data.phone_number) ? data.phone_number[0] : data.phone_number);
        } else if (data.hire_date) {
          return new Error(Array.isArray(data.hire_date) ? data.hire_date[0] : data.hire_date);
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

export default new SecurityPersonelService();