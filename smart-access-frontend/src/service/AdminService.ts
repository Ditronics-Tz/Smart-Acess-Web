import { apiClient } from '../api/config';

// Physical Locations Interfaces
export interface PhysicalLocation {
  location_id: string;
  location_name: string;
  location_type: 'campus' | 'building' | 'floor' | 'room' | 'gate' | 'area';
  description?: string;
  is_restricted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreatePhysicalLocationRequest {
  location_name: string;
  location_type: 'campus' | 'building' | 'floor' | 'room' | 'gate' | 'area';
  description?: string;
  is_restricted?: boolean;
}

export interface PhysicalLocationsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PhysicalLocation[];
}

export interface PhysicalLocationFilters {
  page?: number;
  page_size?: number;
  search?: string;
  location_type?: 'campus' | 'building' | 'floor' | 'room' | 'gate' | 'area';
  is_restricted?: boolean;
  ordering?: string;
}

// Access Gates Interfaces
export interface AccessGate {
  gate_id: string;
  gate_code: string;
  gate_name: string;
  location: string;
  location_name: string;
  location_type: string;
  gate_type: 'entry' | 'exit' | 'bidirectional';
  hardware_id: string;
  ip_address?: string;
  mac_address?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  emergency_override_enabled: boolean;
  backup_power_available: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateAccessGateRequest {
  gate_code: string;
  gate_name: string;
  location: string;
  gate_type?: 'entry' | 'exit' | 'bidirectional';
  hardware_id: string;
  ip_address?: string;
  mac_address?: string;
  status?: 'active' | 'inactive' | 'maintenance' | 'error';
  emergency_override_enabled?: boolean;
  backup_power_available?: boolean;
}

export interface AccessGatesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AccessGate[];
}

export interface AccessGateFilters {
  page?: number;
  page_size?: number;
  search?: string;
  gate_type?: 'entry' | 'exit' | 'bidirectional';
  status?: 'active' | 'inactive' | 'maintenance' | 'error';
  location?: string;
  ordering?: string;
}

// Common Response Interfaces
export interface DeleteResponse {
  message: string;
  deleted_at: string;
}

export interface RestoreResponse {
  message: string;
  data: PhysicalLocation | AccessGate;
}

class AdminService {
  private readonly physicalLocationsBaseURL = 'api/administrator/physical-locations';
  private readonly accessGatesBaseURL = 'api/administrator/access-gates';

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

  // ================================
  // PHYSICAL LOCATIONS METHODS
  // ================================

  /**
   * Create a new physical location
   */
  async createPhysicalLocation(locationData: CreatePhysicalLocationRequest): Promise<PhysicalLocation> {
    try {
      const response = await apiClient.post(`${this.physicalLocationsBaseURL}/create/`, locationData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * List all physical locations with optional filters and pagination
   */
  async listPhysicalLocations(filters?: PhysicalLocationFilters): Promise<PhysicalLocationsListResponse> {
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
        ? `${this.physicalLocationsBaseURL}/?${queryParams.toString()}`
        : `${this.physicalLocationsBaseURL}/`;

      const response = await apiClient.get(url, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get detailed information about a specific physical location
   */
  async getPhysicalLocation(locationId: string): Promise<PhysicalLocation> {
    try {
      const response = await apiClient.get(`${this.physicalLocationsBaseURL}/${locationId}/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Update physical location information (partial update)
   */
  async updatePhysicalLocation(locationId: string, updateData: Partial<CreatePhysicalLocationRequest>): Promise<PhysicalLocation> {
    try {
      const response = await apiClient.patch(`${this.physicalLocationsBaseURL}/${locationId}/update/`, updateData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Full update of physical location information
   */
  async replacePhysicalLocation(locationId: string, locationData: CreatePhysicalLocationRequest): Promise<PhysicalLocation> {
    try {
      const response = await apiClient.put(`${this.physicalLocationsBaseURL}/${locationId}/update/`, locationData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Soft delete a physical location
   */
  async deletePhysicalLocation(locationId: string): Promise<DeleteResponse> {
    try {
      const response = await apiClient.delete(`${this.physicalLocationsBaseURL}/${locationId}/delete/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Restore a previously soft-deleted physical location
   */
  async restorePhysicalLocation(locationId: string): Promise<RestoreResponse> {
    try {
      const response = await apiClient.post(`${this.physicalLocationsBaseURL}/${locationId}/restore/`, {}, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ================================
  // ACCESS GATES METHODS
  // ================================

  /**
   * Create a new access gate
   */
  async createAccessGate(gateData: CreateAccessGateRequest): Promise<AccessGate> {
    try {
      const response = await apiClient.post(`${this.accessGatesBaseURL}/create/`, gateData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * List all access gates with optional filters and pagination
   */
  async listAccessGates(filters?: AccessGateFilters): Promise<AccessGatesListResponse> {
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
        ? `${this.accessGatesBaseURL}/?${queryParams.toString()}`
        : `${this.accessGatesBaseURL}/`;

      const response = await apiClient.get(url, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get detailed information about a specific access gate
   */
  async getAccessGate(gateId: string): Promise<AccessGate> {
    try {
      const response = await apiClient.get(`${this.accessGatesBaseURL}/${gateId}/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Update access gate information (partial update)
   */
  async updateAccessGate(gateId: string, updateData: Partial<CreateAccessGateRequest>): Promise<AccessGate> {
    try {
      const response = await apiClient.patch(`${this.accessGatesBaseURL}/${gateId}/update/`, updateData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Full update of access gate information
   */
  async replaceAccessGate(gateId: string, gateData: CreateAccessGateRequest): Promise<AccessGate> {
    try {
      const response = await apiClient.put(`${this.accessGatesBaseURL}/${gateId}/update/`, gateData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Soft delete an access gate
   */
  async deleteAccessGate(gateId: string): Promise<DeleteResponse> {
    try {
      const response = await apiClient.delete(`${this.accessGatesBaseURL}/${gateId}/delete/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Restore a previously soft-deleted access gate
   */
  async restoreAccessGate(gateId: string): Promise<RestoreResponse> {
    try {
      const response = await apiClient.post(`${this.accessGatesBaseURL}/${gateId}/restore/`, {}, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ================================
  // CONVENIENCE METHODS
  // ================================

  /**
   * Get all physical locations (unpaginated for dropdowns)
   */
  async getAllPhysicalLocations(): Promise<PhysicalLocation[]> {
    try {
      const response = await this.listPhysicalLocations({ page_size: 1000 });
      return response.results;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get active access gates only
   */
  async getActiveAccessGates(filters?: Omit<AccessGateFilters, 'status'>): Promise<AccessGatesListResponse> {
    return this.listAccessGates({
      ...filters,
      status: 'active'
    });
  }

  /**
   * Search physical locations by name
   */
  async searchPhysicalLocations(searchTerm: string, locationType?: PhysicalLocation['location_type']): Promise<PhysicalLocationsListResponse> {
    return this.listPhysicalLocations({
      search: searchTerm,
      location_type: locationType,
      page_size: 50
    });
  }

  /**
   * Search access gates by name, code, or hardware ID
   */
  async searchAccessGates(searchTerm: string, filters?: Omit<AccessGateFilters, 'search'>): Promise<AccessGatesListResponse> {
    return this.listAccessGates({
      ...filters,
      search: searchTerm,
      page_size: 50
    });
  }

  /**
   * Get access gates for a specific location
   */
  async getAccessGatesByLocation(locationId: string, filters?: Omit<AccessGateFilters, 'location'>): Promise<AccessGatesListResponse> {
    return this.listAccessGates({
      ...filters,
      location: locationId
    });
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{
    total_locations: number;
    restricted_locations: number;
    total_gates: number;
    active_gates: number;
    inactive_gates: number;
    maintenance_gates: number;
  }> {
    try {
      const [locationsResponse, gatesResponse] = await Promise.all([
        this.listPhysicalLocations({ page_size: 1000 }),
        this.listAccessGates({ page_size: 1000 })
      ]);

      const locations = locationsResponse.results;
      const gates = gatesResponse.results;

      return {
        total_locations: locations.length,
        restricted_locations: locations.filter(loc => loc.is_restricted).length,
        total_gates: gates.length,
        active_gates: gates.filter(gate => gate.status === 'active').length,
        inactive_gates: gates.filter(gate => gate.status === 'inactive').length,
        maintenance_gates: gates.filter(gate => gate.status === 'maintenance').length
      };
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
        return new Error(data.detail || 'You do not have permission to perform this action. Administrator privileges required.');
      } else if (status === 404) {
        return new Error(data.detail || 'Resource not found.');
      } else if (status === 400) {
        // Handle validation errors
        if (data.detail) {
          return new Error(data.detail);
        } else if (data.gate_code) {
          return new Error(Array.isArray(data.gate_code) ? data.gate_code[0] : data.gate_code);
        } else if (data.hardware_id) {
          return new Error(Array.isArray(data.hardware_id) ? data.hardware_id[0] : data.hardware_id);
        } else if (data.location_name) {
          return new Error(Array.isArray(data.location_name) ? data.location_name[0] : data.location_name);
        } else if (data.non_field_errors) {
          return new Error(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors);
        } else if (data.error) {
          return new Error(data.error);
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

export default new AdminService();