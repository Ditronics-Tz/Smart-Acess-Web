import { apiClient } from '../api/config'; // Use apiClient instead of apiConfig

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

class SecurityPersonnelService {
  private readonly baseURL = 'api/administrator/security-personnel';

  // Fix: Use same authentication pattern as UserManagementService
  private getAuthHeaders() {
    const accessToken = localStorage.getItem('access_token'); // Fixed: Use correct key
    if (!accessToken) {
      throw new Error('No access token found. Please log in again.');
    }

    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  // Fix: Use consistent error handling pattern
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
        return new Error(data.detail || 'Validation error occurred.');
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

  // 1. Create Security Personnel
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

  // 2. List All Security Personnel with Pagination and Filtering
  async listSecurityPersonnel(params: SecurityPersonnelListParams = {}): Promise<SecurityPersonnelListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
      if (params.ordering) queryParams.append('ordering', params.ordering);

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

  // 3. Get Single Security Personnel by ID
  async getSecurityPersonnelById(securityId: string): Promise<SecurityPersonnel> {
    try {
      const response = await apiClient.get(`${this.baseURL}/${securityId}/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // 3. Get Single Security Personnel (Alias for backward compatibility)
  async getSecurityPersonnel(securityId: string): Promise<SecurityPersonnel> {
    return this.getSecurityPersonnelById(securityId);
  }

  // 4. Update Security Personnel (Full Update)
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

  // 5. Partial Update Security Personnel
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

  // 6. Delete Security Personnel (Soft Delete)
  async deleteSecurityPersonnel(securityId: string): Promise<DeleteResponse> {
    try {
      const response = await apiClient.delete(`${this.baseURL}/${securityId}/delete/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // 7. Restore Security Personnel
  async restoreSecurityPersonnel(securityId: string): Promise<RestoreResponse> {
    try {
      const response = await apiClient.post(`${this.baseURL}/${securityId}/restore/`, {}, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
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
    } catch (error: any) {
      throw this.handleError(error);
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
    } catch (error: any) {
      throw this.handleError(error);
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // 13. Reactivate Security Personnel (Remove termination date and activate)
  async reactivateSecurityPersonnel(securityId: string): Promise<SecurityPersonnel> {
    try {
      return await this.partialUpdateSecurityPersonnel(securityId, {
        termination_date: null,
        is_active: true,
      });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}

export default new SecurityPersonnelService();