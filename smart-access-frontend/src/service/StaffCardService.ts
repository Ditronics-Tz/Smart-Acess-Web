import apiClient from '../api/config';

// Interfaces for Staff Card Management
export interface StaffWithoutCard {
	staff_uuid: string;
	staff_number: string;
	full_name: string;
	department: string;
	position: string;
	employment_status: string;
}

export interface StaffWithoutCardsResponse {
	count: number;
	staff: StaffWithoutCard[];
	message: string;
}

export interface CreateSingleStaffCardRequest {
  card_type: 'staff';
  staff_uuid: string;
  generate_rfid?: boolean;
  expiry_date?: string;
}

export interface CreateSingleStaffCardResponse {
  card_uuid: string;
  rfid_number: string;
  card_type: string;
  is_active: boolean;
  staff: {
    staff_number: string;
    full_name: string;
  };
  created_by: {
    username: string;
    user_type: string;
  };
}

export interface BulkCreateStaffCardsRequest {
  staff_uuids: string[];
  generate_rfid?: boolean;
}

export interface CreatedStaffCard {
	card_uuid: string;
	rfid_number: string;
	staff: {
		staff_number: string;
		full_name?: string;
	};
}

export interface BulkCreateStaffCardsResponse {
	success: boolean;
	message: string;
	created_cards: CreatedStaffCard[];
	errors: Array<{
		staff_uuid: string;
		errors: any;
	}>;
	summary: {
		total_requested: number;
		successful: number;
		failed: number;
	};
}

export interface PrintStaffCardResponse {
	// The response is a PDF file, so this can be a Blob or void
}

export interface StaffCard {
  card_uuid: string;
  rfid_number: string;
  card_type: string;
  card_holder_name: string;
  card_holder_number: string;
  department: string;
  status: string; // This appears to be employment_status
  is_active: boolean;
  issued_date: string;
  expiry_date?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface StaffCardsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StaffCard[];
  summary: {
    total_cards: number;
    active_cards: number;
    inactive_cards: number;
  };
}

export interface VerifyStaffCardResponse {
	success: boolean;
	verified: boolean;
	staff: {
		staff_number: string;
		full_name: string;
		department: string;
		position: string;
		employment_status: string;
		photo_url: string;
		has_card: boolean;
		card_active: boolean;
	};
	verified_at: string;
	institution: string;
}

export interface StaffCardDetails {
  card_uuid: string;
  rfid_number: string;
  card_type: string;
  card_holder_name: string;
  card_holder_number: string;
  department: string;
  status: string; // This appears to be employment_status
  is_active: boolean;
  issued_date: string;
  expiry_date?: string | null;
  created_at: string;
  updated_at?: string;
  user_permissions?: {
    can_modify: boolean;
    can_deactivate: boolean;
    can_delete: boolean;
  };
}

export interface StaffCardFilters {
  search?: string;
  is_active?: boolean;
  staff__department?: string;
  staff__employment_status?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

class StaffCardService {
  private baseUrl = '/api/cards';

  // 1. Create a single staff card
  async createStaffCard(data: CreateSingleStaffCardRequest): Promise<CreateSingleStaffCardResponse> {
    const response = await apiClient.post(`${this.baseUrl}/`, data);
    return response.data;
  }

  // 2. List staff without cards
  async listStaffWithoutCards(params?: { search?: string; department?: string }): Promise<StaffWithoutCardsResponse> {
		const response = await apiClient.get(`${this.baseUrl}/staff-without-cards/`, { params });
		return response.data;
	}

	// 3. Bulk create staff cards
	async bulkCreateStaffCards(data: BulkCreateStaffCardsRequest): Promise<BulkCreateStaffCardsResponse> {
		const response = await apiClient.post(`${this.baseUrl}/bulk-create-staff-cards/`, data);
		return response.data;
	}

	// 5. Get staff card details
	async getStaffCard(cardUuid: string): Promise<StaffCardDetails> {
		const response = await apiClient.get(`${this.baseUrl}/${cardUuid}/`);
		return response.data;
	}

	// 6. List staff cards with filtering and pagination
	async listStaffCards(params?: StaffCardFilters): Promise<StaffCardsListResponse> {
		const response = await apiClient.get(`${this.baseUrl}/`, {
			params: {
				...params,
				card_type: 'staff'
			}
		});

		// Handle different response formats
		const data = response.data;
		if (Array.isArray(data)) {
			// API returns array directly
			return {
				count: data.length,
				next: null,
				previous: null,
				results: data,
				summary: {
					total_cards: data.length,
					active_cards: data.filter(card => card.is_active).length,
					inactive_cards: data.filter(card => !card.is_active).length
				}
			};
		} else {
			// API returns paginated response as documented
			return data;
		}
	}
}

export default new StaffCardService();
