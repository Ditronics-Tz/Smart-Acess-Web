import apiConfig from '../api/config';

// Types and Interfaces
export interface SecurityPersonnel {
  security_id: string;
  employee_id: string;
  badge_number: string;
  full_name: string;
  phone_number?: string;
  hire_date: string;
  termination_date?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
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
  next?: string | null;
  previous?: string | null;
  results: SecurityPersonnel[];
}

export interface SecurityPersonnelListParams {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  ordering?: string;
}

export interface DeleteResponse {
  message: string;
  deleted_at: string;
  is_active: boolean;
}

export interface RestoreResponse {
  message: string;
  data: SecurityPersonnel;
}

class SecurityPersonelService {
  // Get the base URL from the Axios instance defaults
  private baseURL = `${apiConfig.defaults.baseURL}/api/administrator/security-personnel`;

  // Helper method to get headers with authentication
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Helper method to handle API responses
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
      
      if (response.status === 401) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin-login';
        throw new Error('Authentication required');
      } else if (response.status === 403) {
        throw new Error('Access denied. Administrator privileges required.');
      } else if (response.status === 404) {
        throw new Error('Security personnel not found');
      } else if (response.status === 400) {
        // Validation errors
        const errorMessage = typeof errorData === 'object' && errorData.detail 
          ? errorData.detail 
          : 'Validation error';
        throw new Error(errorMessage);
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // 1. Create Security Personnel
  async createSecurityPersonnel(data: CreateSecurityPersonnelRequest): Promise<SecurityPersonnel> {
    try {
      const response = await fetch(`${this.baseURL}/create/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      return await this.handleResponse<SecurityPersonnel>(response);
    } catch (error) {
      console.error('Error creating security personnel:', error);
      throw error;
    }
  }

  // 2. List All Security Personnel with Pagination and Filtering
  async listSecurityPersonnel(params: SecurityPersonnelListParams = {}): Promise<SecurityPersonnelListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
      if (params.ordering) queryParams.append('ordering', params.ordering);

      const url = `${this.baseURL}/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await this.handleResponse<SecurityPersonnelListResponse>(response);
    } catch (error) {
      console.error('Error fetching security personnel list:', error);
      throw error;
    }
  }

  // 3. Get Single Security Personnel by ID
  async getSecurityPersonnelById(securityId: string): Promise<SecurityPersonnel> {
    try {
      const response = await fetch(`${this.baseURL}/${securityId}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await this.handleResponse<SecurityPersonnel>(response);
    } catch (error) {
      console.error('Error fetching security personnel by ID:', error);
      throw error;
    }
  }

  // 3. Get Single Security Personnel (Alias for backward compatibility)
  async getSecurityPersonnel(securityId: string): Promise<SecurityPersonnel> {
    return this.getSecurityPersonnelById(securityId);
  }

  // 4. Update Security Personnel (Full Update)
  async updateSecurityPersonnel(securityId: string, data: UpdateSecurityPersonnelRequest): Promise<SecurityPersonnel> {
    try {
      const response = await fetch(`${this.baseURL}/${securityId}/update/`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      return await this.handleResponse<SecurityPersonnel>(response);
    } catch (error) {
      console.error('Error updating security personnel:', error);
      throw error;
    }
  }

  // 5. Partial Update Security Personnel
  async partialUpdateSecurityPersonnel(securityId: string, data: Partial<UpdateSecurityPersonnelRequest>): Promise<SecurityPersonnel> {
    try {
      const response = await fetch(`${this.baseURL}/${securityId}/update/`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      return await this.handleResponse<SecurityPersonnel>(response);
    } catch (error) {
      console.error('Error partially updating security personnel:', error);
      throw error;
    }
  }

  // 6. Delete Security Personnel (Soft Delete)
  async deleteSecurityPersonnel(securityId: string): Promise<DeleteResponse> {
    try {
      const response = await fetch(`${this.baseURL}/${securityId}/delete/`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return await this.handleResponse<DeleteResponse>(response);
    } catch (error) {
      console.error('Error deleting security personnel:', error);
      throw error;
    }
  }

  // 7. Restore Security Personnel
  async restoreSecurityPersonnel(securityId: string): Promise<RestoreResponse> {
    try {
      const response = await fetch(`${this.baseURL}/${securityId}/restore/`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      return await this.handleResponse<RestoreResponse>(response);
    } catch (error) {
      console.error('Error restoring security personnel:', error);
      throw error;
    }
  }

  // 8. Get Security Personnel Statistics (Custom method for dashboard)
  async getSecurityPersonnelStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    recentlyAdded: number;
  }> {
    try {
      // Get total count
      const allPersonnel = await this.listSecurityPersonnel({ page_size: 1 });
      
      // Get active count
      const activePersonnel = await this.listSecurityPersonnel({ 
        is_active: true, 
        page_size: 1 
      });
      
      // Get inactive count
      const inactivePersonnel = await this.listSecurityPersonnel({ 
        is_active: false, 
        page_size: 1 
      });

      // Get recently added (last 30 days) - using ordering by created_at
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentPersonnel = await this.listSecurityPersonnel({ 
        ordering: '-created_at',
        page_size: 100 // Get more to filter by date
      });

      // Filter by created date (client-side filtering since API doesn't support date filtering)
      const recentCount = recentPersonnel.results.filter(person => 
        new Date(person.created_at) >= thirtyDaysAgo
      ).length;

      return {
        total: allPersonnel.count,
        active: activePersonnel.count,
        inactive: inactivePersonnel.count,
        recentlyAdded: recentCount,
      };
    } catch (error) {
      console.error('Error fetching security personnel statistics:', error);
      throw error;
    }
  }

  // 9. Search Security Personnel (Convenience method)
  async searchSecurityPersonnel(searchTerm: string, isActive?: boolean): Promise<SecurityPersonnel[]> {
    try {
      const response = await this.listSecurityPersonnel({
        search: searchTerm,
        is_active: isActive,
        page_size: 100, // Get more results for search
      });

      return response.results;
    } catch (error) {
      console.error('Error searching security personnel:', error);
      throw error;
    }
  }

  // 10. Validate Employee ID (Check if unique)
  async validateEmployeeId(employeeId: string, excludeSecurityId?: string): Promise<boolean> {
    try {
      const response = await this.searchSecurityPersonnel(employeeId);
      
      // If we're updating, exclude the current record
      const conflicts = excludeSecurityId 
        ? response.filter(person => person.security_id !== excludeSecurityId)
        : response;
        
      return conflicts.length === 0;
    } catch (error) {
      console.error('Error validating employee ID:', error);
      return false;
    }
  }

  // 11. Validate Badge Number (Check if unique)
  async validateBadgeNumber(badgeNumber: string, excludeSecurityId?: string): Promise<boolean> {
    try {
      const response = await this.searchSecurityPersonnel(badgeNumber);
      
      // If we're updating, exclude the current record
      const conflicts = excludeSecurityId 
        ? response.filter(person => person.security_id !== excludeSecurityId)
        : response;
        
      return conflicts.length === 0;
    } catch (error) {
      console.error('Error validating badge number:', error);
      return false;
    }
  }

  // 12. Terminate Security Personnel (Set termination date and deactivate)
  async terminateSecurityPersonnel(securityId: string, terminationDate?: string): Promise<SecurityPersonnel> {
    try {
      const termDate = terminationDate || new Date().toISOString().split('T')[0];
      
      return await this.partialUpdateSecurityPersonnel(securityId, {
        termination_date: termDate,
        is_active: false,
      });
    } catch (error) {
      console.error('Error terminating security personnel:', error);
      throw error;
    }
  }

  // 13. Reactivate Security Personnel (Remove termination date and activate)
  async reactivateSecurityPersonnel(securityId: string): Promise<SecurityPersonnel> {
    try {
      return await this.partialUpdateSecurityPersonnel(securityId, {
        termination_date: null,
        is_active: true,
      });
    } catch (error) {
      console.error('Error reactivating security personnel:', error);
      throw error;
    }
  }
}

export default new SecurityPersonelService();