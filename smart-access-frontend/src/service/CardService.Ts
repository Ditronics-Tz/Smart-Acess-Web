import { apiClient } from '../api/config';

// Card Interfaces (keep all existing interfaces)
export interface Card {
  card_uuid: string;
  rfid_number: string;
  card_type: string;
  card_holder_name: string;
  card_holder_number: string;
  department: string;
  status: 'Enrolled' | 'Withdrawn' | 'Suspended';
  is_active: boolean;
  issued_date: string;
  expiry_date?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CardDetails extends Card {
  user_permissions: {
    can_modify: boolean;
    can_deactivate: boolean;
    can_delete: boolean;
  };
}

export interface CreateCardRequest {
  card_type?: string;
  student_uuid?: string;
  rfid_number?: string;
  generate_rfid?: boolean;
  expiry_date?: string;
}

export interface CreateCardResponse {
  card_uuid: string;
  rfid_number: string;
  student_info: {
    student_uuid: string;
    first_name: string;
    surname: string;
    registration_number: string;
    department: string;
  };
  is_active: boolean;
  issued_date: string;
  created_by: {
    username: string;
    user_type: string;
    full_name: string;
  };
}

export interface CardsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Card[];
  summary: {
    total_cards: number;
    active_cards: number;
    inactive_cards: number;
  };
}

export interface CardFilters {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  student__department?: string;
  student__student_status?: 'Enrolled' | 'Withdrawn' | 'Suspended';
  ordering?: string;
}

export interface StudentWithoutCard {
  student_uuid: string;
  registration_number: string;
  full_name: string;
  department: string;
  student_status: 'Enrolled' | 'Withdrawn' | 'Suspended';
  created_at: string;
}

export interface StudentsWithoutCardsResponse {
  count: number;
  students: StudentWithoutCard[];
  message: string;
}

export interface CardStatistics {
  summary: {
    total_students: number;
    total_cards: number;
    active_cards: number;
    inactive_cards: number;
    students_without_cards: number;
    coverage_percentage: number;
    recent_cards_30_days: number;
  };
  cards_by_department: Array<{
    student__department: string;
    count: number;
  }>;
  user_info: {
    current_user: string;
    user_type: string;
    generated_at: string;
  };
}

export interface BulkCreateRequest {
  card_type?: string;
  student_uuids?: string[];
  generate_rfid?: boolean;
}

export interface BulkCreateResponse {
  success: boolean;
  message: string;
  created_cards: CreateCardResponse[];
  errors: any[];
  summary: {
    total_requested: number;
    successful: number;
    failed: number;
  };
  created_by: {
    username: string;
    user_type: string;
    timestamp: string;
  };
}

export interface CardActionResponse {
  message: string;
  data: CardDetails;
}

class CardService {
  private readonly baseURL = '/api/cards';

  // Helper method to ensure we have a valid token (same as StudentService)
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
  // STANDARD CRUD METHODS
  // ================================

  /**
   * Create a new card for a student
   * POST /api/cards/
   */
  async createCard(cardData: CreateCardRequest): Promise<CreateCardResponse> {
    try {
      const response = await apiClient.post(`${this.baseURL}/`, cardData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * List all cards with optional filters and pagination
   * GET /api/cards/
   */
  async listCards(filters?: CardFilters): Promise<CardsListResponse> {
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

      // Handle the actual API response format - it returns a direct array
      if (Array.isArray(response.data)) {
        const cards = response.data as Card[];
        const activeCards = cards.filter(card => card.is_active).length;
        const inactiveCards = cards.filter(card => !card.is_active).length;
        
        return {
          count: cards.length,
          next: null,
          previous: null,
          results: cards,
          summary: {
            total_cards: cards.length,
            active_cards: activeCards,
            inactive_cards: inactiveCards
          }
        };
      } else if (response.data && response.data.results) {
        return response.data;
      } else {
        const cards = Array.isArray(response.data) ? response.data : [response.data];
        const activeCards = cards.filter(card => card.is_active).length;
        const inactiveCards = cards.filter(card => !card.is_active).length;
        
        return {
          count: cards.length,
          next: null,
          previous: null,
          results: cards,
          summary: {
            total_cards: cards.length,
            active_cards: activeCards,
            inactive_cards: inactiveCards
          }
        };
      }
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get detailed information about a specific card
   * GET /api/cards/{card_uuid}/
   */
  async getCard(cardUuid: string): Promise<CardDetails> {
    try {
      const response = await apiClient.get(`${this.baseURL}/${cardUuid}/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Update card information (partial update)
   * PATCH /api/cards/{card_uuid}/
   */
  async updateCard(cardUuid: string, updateData: Partial<CreateCardRequest>): Promise<CardDetails> {
    try {
      const response = await apiClient.patch(`${this.baseURL}/${cardUuid}/`, updateData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Full update of card information
   * PUT /api/cards/{card_uuid}/
   */
  async replaceCard(cardUuid: string, cardData: CreateCardRequest): Promise<CardDetails> {
    try {
      const response = await apiClient.put(`${this.baseURL}/${cardUuid}/`, cardData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a card (only administrators)
   * DELETE /api/cards/{card_uuid}/
   */
  async deleteCard(cardUuid: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`${this.baseURL}/${cardUuid}/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ================================
  // CARD STATUS MANAGEMENT
  // ================================

  /**
   * Activate a card
   * PATCH /api/cards/{card_uuid}/activate/
   */
  async activateCard(cardUuid: string): Promise<CardActionResponse> {
    try {
      const response = await apiClient.patch(`${this.baseURL}/${cardUuid}/activate/`, {}, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Deactivate a card
   * PATCH /api/cards/{card_uuid}/deactivate/
   */
  async deactivateCard(cardUuid: string): Promise<CardActionResponse> {
    try {
      const response = await apiClient.patch(`${this.baseURL}/${cardUuid}/deactivate/`, {}, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ================================
  // SPECIALIZED ENDPOINTS
  // ================================

  /**
   * Get students who don't have cards yet
   * GET /api/cards/students-without-cards/
   */
  async getStudentsWithoutCards(filters?: { search?: string; department?: string }): Promise<StudentsWithoutCardsResponse> {
    try {
      // Add retry logic with delay
      const executeWithRetry = async (attempt = 1): Promise<StudentsWithoutCardsResponse> => {
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
            ? `${this.baseURL}/students-without-cards/?${queryParams.toString()}`
            : `${this.baseURL}/students-without-cards/`;

          const response = await apiClient.get(url, {
            headers: this.getAuthHeaders()
          });

          return response.data;
        } catch (error: any) {
          // If unauthorized and we haven't retried too many times, try again
          if (error.response?.status === 401 && attempt < 3) {
            console.log(`Auth token not ready yet, retrying (${attempt}/3)...`);
            // Wait a bit before retrying to let token settle
            await new Promise(resolve => setTimeout(resolve, 500));
            return executeWithRetry(attempt + 1);
          }
          throw error;
        }
      };

      return await executeWithRetry();
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get comprehensive card statistics
   * GET /api/cards/statistics/
   */
  async getCardStatistics(): Promise<CardStatistics> {
    try {
      // Add retry logic with delay
      const executeWithRetry = async (attempt = 1): Promise<CardStatistics> => {
        try {
          const response = await apiClient.get(`${this.baseURL}/statistics/`, {
            headers: this.getAuthHeaders()
          });
          return response.data;
        } catch (error: any) {
          // If unauthorized and we haven't retried too many times, try again
          if (error.response?.status === 401 && attempt < 3) {
            console.log(`Auth token not ready yet, retrying (${attempt}/3)...`);
            // Wait a bit before retrying to let token settle
            await new Promise(resolve => setTimeout(resolve, 500));
            return executeWithRetry(attempt + 1);
          }
          throw error;
        }
      };

      return await executeWithRetry();
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Bulk create cards for multiple students
   * POST /api/cards/bulk-create/
   */
  async bulkCreateCards(requestData: BulkCreateRequest): Promise<BulkCreateResponse> {
    try {
      // Ensure card_type is set for student cards
      const dataWithCardType = {
        ...requestData,
        card_type: 'student'
      };

      const response = await apiClient.post(`${this.baseURL}/bulk-create/`, dataWithCardType, {
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
   * Get all cards (unpaginated for dropdowns)
   */
  async getAllCards(): Promise<Card[]> {
    try {
      const response = await this.listCards({ page_size: 1000 });
      return response.results;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get active cards only
   */
  async getActiveCards(filters?: Omit<CardFilters, 'is_active'>): Promise<CardsListResponse> {
    return this.listCards({
      ...filters,
      is_active: true
    });
  }

  /**
   * Get inactive cards only
   */
  async getInactiveCards(filters?: Omit<CardFilters, 'is_active'>): Promise<CardsListResponse> {
    return this.listCards({
      ...filters,
      is_active: false
    });
  }

  /**
   * Search cards by RFID number, student name, or registration number
   */
  async searchCards(searchTerm: string, filters?: Omit<CardFilters, 'search'>): Promise<CardsListResponse> {
    return this.listCards({
      ...filters,
      search: searchTerm,
      page_size: 50
    });
  }

  /**
   * Get cards by department
   */
  async getCardsByDepartment(department: string, filters?: Omit<CardFilters, 'student__department'>): Promise<CardsListResponse> {
    return this.listCards({
      ...filters,
      student__department: department
    });
  }

  /**
   * Get cards by student status
   */
  async getCardsByStudentStatus(
    status: 'Enrolled' | 'Withdrawn' | 'Suspended',
    filters?: Omit<CardFilters, 'student__student_status'>
  ): Promise<CardsListResponse> {
    return this.listCards({
      ...filters,
      student__student_status: status
    });
  }

  /**
   * Find card by RFID number
   */
  async getCardByRFID(rfidNumber: string): Promise<Card | null> {
    try {
      const response = await this.searchCards(rfidNumber);
      const card = response.results.find(c => c.rfid_number === rfidNumber);
      return card || null;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Find card by student registration number
   */
  async getCardByStudentRegistration(registrationNumber: string): Promise<Card | null> {
    try {
      const response = await this.searchCards(registrationNumber);
      const card = response.results.find(c => c.card_holder_number === registrationNumber);
      return card || null;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Create card with auto-generated RFID
   */
  async createCardWithAutoRFID(studentUuid: string, expiryDate?: string): Promise<CreateCardResponse> {
    return this.createCard({
      card_type: 'student',
      student_uuid: studentUuid,
      generate_rfid: true,
      expiry_date: expiryDate
    });
  }

  /**
   * Create card with specific RFID - FIXED THE METHOD NAME
   */
  async createCardWithRFID(studentUuid: string, rfidNumber: string, expiryDate?: string): Promise<CreateCardResponse> {
    return this.createCard({
      card_type: 'student',
      student_uuid: studentUuid,
      rfid_number: rfidNumber,
      generate_rfid: false,
      expiry_date: expiryDate
    });
  }

  /**
   * Bulk activate cards
   */
  async bulkActivateCards(cardUuids: string[]): Promise<{ activated: number; errors: any[] }> {
    const results = { activated: 0, errors: [] as any[] };

    for (const cardUuid of cardUuids) {
      try {
        await this.activateCard(cardUuid);
        results.activated++;
      } catch (error: any) {
        results.errors.push({
          card_uuid: cardUuid,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Bulk deactivate cards
   */
  async bulkDeactivateCards(cardUuids: string[]): Promise<{ deactivated: number; errors: any[] }> {
    const results = { deactivated: 0, errors: [] as any[] };

    for (const cardUuid of cardUuids) {
      try {
        await this.deactivateCard(cardUuid);
        results.deactivated++;
      } catch (error: any) {
        results.errors.push({
          card_uuid: cardUuid,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Get dashboard statistics for cards
   */
  async getCardDashboardStats(): Promise<{
    total_cards: number;
    active_cards: number;
    inactive_cards: number;
    coverage_percentage: number;
    students_without_cards: number;
    recent_cards: number;
    cards_by_department: { [department: string]: number };
    cards_by_status: { [status: string]: number };
  }> {
    try {
      // Try to get statistics from the statistics endpoint first
      try {
        const stats = await this.getCardStatistics();
        
        // Transform the response to match dashboard needs
        const cardsByDepartment: { [department: string]: number } = {};
        stats.cards_by_department.forEach(item => {
          cardsByDepartment[item.student__department] = item.count;
        });

        const response = await this.listCards({ page_size: 1000 });
        const cards = response.results;

        const cardsByStatus: { [status: string]: number } = {};
        cards.forEach(card => {
          if (!cardsByStatus[card.status]) {
            cardsByStatus[card.status] = 0;
          }
          cardsByStatus[card.status]++;
        });

        return {
          total_cards: stats.summary.total_cards,
          active_cards: stats.summary.active_cards,
          inactive_cards: stats.summary.inactive_cards,
          coverage_percentage: stats.summary.coverage_percentage,
          students_without_cards: stats.summary.students_without_cards,
          recent_cards: stats.summary.recent_cards_30_days,
          cards_by_department: cardsByDepartment,
          cards_by_status: cardsByStatus
        };
      } catch (statsError) {
        // Fallback: calculate stats from card list
        const response = await this.listCards({ page_size: 1000 });
        const cards = response.results;

        const cardsByDepartment: { [department: string]: number } = {};
        const cardsByStatus: { [status: string]: number } = {};

        cards.forEach(card => {
          // Department stats
          if (!cardsByDepartment[card.department]) {
            cardsByDepartment[card.department] = 0;
          }
          cardsByDepartment[card.department]++;

          // Status stats
          if (!cardsByStatus[card.status]) {
            cardsByStatus[card.status] = 0;
          }
          cardsByStatus[card.status]++;
        });

        const activeCards = cards.filter(card => card.is_active).length;
        const inactiveCards = cards.filter(card => !card.is_active).length;

        // Calculate recent cards (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentCards = cards.filter(card => 
          new Date(card.issued_date) >= thirtyDaysAgo
        ).length;

        return {
          total_cards: cards.length,
          active_cards: activeCards,
          inactive_cards: inactiveCards,
          coverage_percentage: 0, // Can't calculate without student count
          students_without_cards: 0, // Can't calculate without student count
          recent_cards: recentCards,
          cards_by_department: cardsByDepartment,
          cards_by_status: cardsByStatus
        };
      }
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get unique departments that have cards
   */
  async getDepartmentsWithCards(): Promise<string[]> {
    try {
      const response = await this.listCards({ page_size: 1000 });
      const departments = Array.from(new Set(response.results.map(card => card.department)));
      return departments.sort();
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Check if RFID number is available
   */
  async isRFIDAvailable(rfidNumber: string): Promise<boolean> {
    try {
      const card = await this.getCardByRFID(rfidNumber);
      return card === null;
    } catch (error: any) {
      // If there's an error searching, assume RFID is not available for safety
      return false;
    }
  }

  /**
   * Get recently issued cards (last 30 days)
   */
  async getRecentCards(days: number = 30): Promise<Card[]> {
    try {
      const response = await this.listCards({ 
        ordering: '-issued_date',
        page_size: 100
      });

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return response.results.filter(card => {
        const issuedDate = new Date(card.issued_date);
        return issuedDate >= cutoffDate;
      });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get expiring cards within specified days
   */
  async getExpiringCards(days: number = 30): Promise<Card[]> {
    try {
      const response = await this.listCards({ 
        is_active: true,
        page_size: 1000
      });

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      return response.results.filter(card => {
        if (!card.expiry_date) return false;
        const expiryDate = new Date(card.expiry_date);
        return expiryDate <= futureDate && expiryDate >= new Date();
      });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get expired cards
   */
  async getExpiredCards(): Promise<Card[]> {
    try {
      const response = await this.listCards({ 
        page_size: 1000
      });

      const now = new Date();

      return response.results.filter(card => {
        if (!card.expiry_date) return false;
        const expiryDate = new Date(card.expiry_date);
        return expiryDate < now;
      });
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
        return new Error(data.detail || 'You do not have permission to perform this action. Administrator privileges may be required.');
      } else if (status === 404) {
        return new Error(data.detail || 'Card not found.');
      } else if (status === 400) {
        // Handle validation errors
        if (data.detail) {
          return new Error(data.detail);
        } else if (data.student) {
          return new Error(Array.isArray(data.student) ? data.student[0] : data.student);
        } else if (data.rfid_number) {
          return new Error(Array.isArray(data.rfid_number) ? data.rfid_number[0] : data.rfid_number);
        } else if (data.card_type) {
          return new Error(Array.isArray(data.card_type) ? data.card_type[0] : data.card_type);
        } else if (data.student_uuid) {
          return new Error(Array.isArray(data.student_uuid) ? data.student_uuid[0] : data.student_uuid);
        } else if (data.expiry_date) {
          return new Error(Array.isArray(data.expiry_date) ? data.expiry_date[0] : data.expiry_date);
        } else if (data.non_field_errors) {
          return new Error(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors);
        } else if (data.student_uuids) {
          return new Error(Array.isArray(data.student_uuids) ? data.student_uuids[0] : data.student_uuids);
        }
        return new Error('Validation error occurred.');
      } else if (status === 409) {
        return new Error(data.detail || 'Conflict: Student already has a card or RFID number is already in use.');
      } else if (status === 429) {
        return new Error(data.detail || 'Too many requests. Please try again later.');
      }

      return new Error(data.detail || data.message || 'An error occurred during the request.');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }
}

export default new CardService();
