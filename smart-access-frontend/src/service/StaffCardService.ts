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

	// 4. Print staff card (returns PDF Blob)
	async printStaffCard(cardUuid: string): Promise<Blob> {
		const response = await apiClient({
			url: `${this.baseUrl}/${cardUuid}/print-staff-card/`,
			method: 'GET',
			responseType: 'blob',
		});
		return response.data;
	}

	// 5. Verify staff card (public endpoint)
	async verifyStaffCard(staffUuid: string): Promise<VerifyStaffCardResponse> {
		const response = await apiClient.get(`${this.baseUrl}/verify/staff/${staffUuid}/`);
		return response.data;
	}
}

export default new StaffCardService();
