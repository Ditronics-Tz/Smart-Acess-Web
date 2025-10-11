import apiClient from '../api/config';

// Interfaces for Security Card Management

export interface SecurityWithoutCard {
  security_id: string;
  employee_id: string;
  badge_number: string;
  full_name: string;
  phone_number: string;
}

export interface SecurityWithoutCardsResponse {
  count: number;
  security: SecurityWithoutCard[];
  message: string;
}

export interface CreateSingleSecurityCardRequest {
  card_type: 'security';
  security_uuid: string;
  generate_rfid?: boolean;
  expiry_date?: string;
}

export interface CreateSingleSecurityCardResponse {
  card_uuid: string;
  rfid_number: string;
  card_type: string;
  is_active: boolean;
  security: {
    employee_id: string;
    full_name: string;
  };
  created_by: {
    username: string;
    user_type: string;
  };
}

export interface BulkCreateSecurityCardsRequest {
  security_uuids: string[];
  generate_rfid?: boolean;
}

export interface CreatedSecurityCard {
	card_uuid: string;
	rfid_number: string;
	security: {
		employee_id: string;
		full_name?: string;
	};
}

export interface BulkCreateSecurityCardsResponse {
	success: boolean;
	message: string;
	created_cards: CreatedSecurityCard[];
	errors: Array<{
		security_uuid: string;
		errors: any;
	}>;
	summary: {
		total_requested: number;
		successful: number;
		failed: number;
	};
}

export interface PrintSecurityCardResponse {
	// The response is a PDF file, so this can be a Blob or void
}

export interface SecurityCard {
  card_uuid: string;
  rfid_number: string;
  card_type: string;
  card_holder_name: string;
  card_holder_number: string; // employee_id
  department?: string;
  status?: string;
  is_active: boolean;
  issued_date: string;
  expiry_date?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface SecurityCardsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SecurityCard[];
  summary: {
    total_cards: number;
    active_cards: number;
    inactive_cards: number;
  };
}

export interface VerifySecurityCardResponse {
	success: boolean;
	verified: boolean;
	security: {
    employee_id: string;
    badge_number: string;
    full_name: string;
    phone_number: string;
    hire_date: string;
    has_card: boolean;
    card_active: boolean;
	};
	verified_at: string;
	institution: string;
}

export interface SecurityCardDetails {
  id: number;
  student_info: any;
  staff_info: any;
  security_info: {
    security_id: string;
    employee_id: string;
    badge_number: string;
    full_name: string;
    phone_number: string;
    is_active: boolean;
    photo_url?: string;
    hire_date?: string;
  };
  card_holder_name: string;
  card_holder_number: string;
  department: string;
  card_uuid: string;
  rfid_number: string;
  card_type: string;
  is_active: boolean;
  issued_date: string;
  expiry_date?: string | null;
  created_at: string;
  updated_at?: string;
  student: any;
  staff: any;
  security_personnel: string;
  user_permissions: {
    can_modify: boolean;
    can_deactivate: boolean;
    can_delete: boolean;
  };
}

export interface SecurityCardFilters {
  search?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
  card_type?: string;
}

export interface UpdateSecurityCardRequest {
  security_uuid?: string;
  rfid_number?: string;
  generate_rfid?: boolean;
  is_active?: boolean;
}

export interface SecurityCardStatistics {
  summary: {
    total_personnel: number;
    total_students: number;
    total_staff: number;
    total_security: number;
    total_cards: number;
    active_cards: number;
    inactive_cards: number;
    student_cards: number;
    staff_cards: number;
    security_cards: number;
    students_without_cards: number;
    staff_without_cards: number;
    security_without_cards: number;
    coverage_percentage: number;
    recent_cards_30_days: number;
  };
  cards_by_type: {
    student: number;
    staff: number;
    security: number;
  };
  user_info?: {
    current_user: string;
    user_type: string;
    generated_at: string;
  };
}

class SecurityCardService {
  private baseUrl = '/api/cards';

  // 1. Create a single security card
  async createSecurityCard(data: CreateSingleSecurityCardRequest): Promise<CreateSingleSecurityCardResponse> {
    const response = await apiClient.post(`${this.baseUrl}/`, data);
    return response.data;
  }

  // 2. List security without cards
  async listSecurityWithoutCards(params?: { search?: string }): Promise<SecurityWithoutCardsResponse> {
		const response = await apiClient.get(`${this.baseUrl}/security-without-cards/`, { params });
		return response.data;
	}

	// 3. Bulk create security cards
	async bulkCreateSecurityCards(data: BulkCreateSecurityCardsRequest): Promise<BulkCreateSecurityCardsResponse> {
		const response = await apiClient.post(`${this.baseUrl}/bulk-create-security-cards/`, data);
		return response.data;
	}

	// 4. Get security card details
	async getSecurityCard(cardUuid: string): Promise<SecurityCardDetails> {
		const response = await apiClient.get(`${this.baseUrl}/${cardUuid}/`);
		return response.data;
	}

	// 5. List security cards with filtering and pagination
	async listSecurityCards(params?: SecurityCardFilters): Promise<SecurityCardsListResponse> {
		const response = await apiClient.get(`${this.baseUrl}/`, {
			params: {
				...params,
				card_type: 'security'
			}
		});

		// Handle both response formats: direct array or paginated response
		if (Array.isArray(response.data)) {
			// Server returns array directly
			return {
				count: response.data.length,
				next: null,
				previous: null,
				results: response.data,
				summary: {
					total_cards: response.data.length,
					active_cards: response.data.filter(card => card.is_active).length,
					inactive_cards: response.data.filter(card => !card.is_active).length,
				}
			};
		} else {
			// Server returns paginated response
			return response.data;
		}
	}

  // 6. Print Security Card
  async printSecurityCard(cardUuid: string): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/${cardUuid}/print-security-card/`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // 7. Deactivate Card
  async deactivateCard(cardUuid: string): Promise<any> {
    const response = await apiClient.patch(`${this.baseUrl}/${cardUuid}/deactivate/`);
    return response.data;
  }

  // 8. Activate Card
  async activateCard(cardUuid: string): Promise<any> {
    const response = await apiClient.patch(`${this.baseUrl}/${cardUuid}/activate/`);
    return response.data;
  }

  // 9. Update Security Card
  async updateSecurityCard(cardUuid: string, data: UpdateSecurityCardRequest): Promise<SecurityCardDetails> {
    const response = await apiClient.patch(`${this.baseUrl}/${cardUuid}/`, data);
    return response.data;
  }

  // 10. Delete Security Card
  async deleteSecurityCard(cardUuid: string): Promise<any> {
    const response = await apiClient.delete(`${this.baseUrl}/${cardUuid}/`);
    return response.data;
  }

  // 11. Get Card Statistics
  async getCardStatistics(): Promise<SecurityCardStatistics> {
    const response = await apiClient.get(`${this.baseUrl}/statistics/`);
    return response.data;
  }

  // 12. Verify Security Card
  async verifySecurityCard(securityUuid: string): Promise<VerifySecurityCardResponse> {
    const response = await apiClient.get(`${this.baseUrl}/verify/security/${securityUuid}/`);
    return response.data;
  }

  // Convenience methods for better naming consistency
  async activateSecurityCard(cardUuid: string): Promise<any> {
    return this.activateCard(cardUuid);
  }

  async deactivateSecurityCard(cardUuid: string): Promise<any> {
    return this.deactivateCard(cardUuid);
  }

  async getSecurityCardDetails(cardUuid: string): Promise<SecurityCardDetails> {
    return this.getSecurityCard(cardUuid);
  }
}

export default new SecurityCardService();