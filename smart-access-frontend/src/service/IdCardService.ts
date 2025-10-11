import { apiClient } from '../api/config';

// ID Card Print Response Interface
export interface IDCardPrintResponse {
  success: boolean;
  message: string;
  print_log: {
    printed_at: string;
    printed_by: string;
    user_type: string;
  };
}

// ID Card Verification Response Interface
export interface IDCardVerificationResponse {
  success: boolean;
  verified: boolean;
  student?: {
    registration_number: string;
    full_name: string;
    department: string;
    program: string;
    class_code: string;
    status: string;
    academic_status: string;
    photo_url?: string;
    has_card: boolean;
    card_active: boolean;
  };
  verified_at?: string;
  institution?: string;
  message?: string;
}

class IdCardService {
  private readonly baseURL = 'api/cards';

  // Helper method to ensure we have a valid token
  private getAuthHeaders() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please log in again.');
    }

    return {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    };
  }

  /**
   * Print ID Card for a student
   * POST /api/cards/{card_uuid}/print-card/
   * 
   * Downloads a PDF of the student ID card with QR code
   * 
   * @param cardUuid - The UUID of the card
   * @returns Promise that resolves when download starts
   */
  async printIDCard(cardUuid: string): Promise<void> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in again.');
      }

      const response = await apiClient({
        method: 'POST',
        url: `${this.baseURL}/${cardUuid}/print-card/`,
        responseType: 'blob', // Important for PDF download
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        }
      });

      // Create blob link to download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `id_card_${cardUuid}_${timestamp}.pdf`);
      link.style.display = 'none';
      
      // Add to document, click, and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Verify student via QR code or direct link (Public endpoint)
   * GET /api/cards/verify/{student_uuid}/
   * 
   * @param studentUuid - The UUID of the student
   * @returns Promise with verification response
   */
  async verifyStudent(studentUuid: string): Promise<IDCardVerificationResponse> {
    try {
      const response = await apiClient.get(`${this.baseURL}/verify/${studentUuid}/`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Open print dialog for ID card (alternative to auto-download)
   * Opens the PDF in a new tab for printing
   * 
   * @param cardUuid - The UUID of the card
   */
  async openPrintDialog(cardUuid: string): Promise<void> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in again.');
      }

      const response = await apiClient({
        method: 'POST',
        url: `${this.baseURL}/${cardUuid}/print-card/`,
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        }
      });

      // Create blob URL and open in new tab
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open in new window for printing
      const printWindow = window.open(url, '_blank');
      
      if (!printWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Clean up after a delay (give time for PDF to load)
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
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
        return new Error('Authentication required. Please log in again.');
      } else if (status === 403) {
        return new Error('You do not have permission to print ID cards.');
      } else if (status === 404) {
        return new Error('Card not found or student does not exist.');
      } else if (status === 400) {
        // Handle validation errors
        if (data.detail) {
          return new Error(data.detail);
        } else if (data.error) {
          return new Error(data.error);
        } else if (data.message) {
          return new Error(data.message);
        }
        return new Error('Invalid request. Please check the card details.');
      } else if (status === 500) {
        return new Error('Failed to generate ID card. Please try again later.');
      }

      return new Error(data.detail || data.message || 'An error occurred while processing ID card.');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }
}

export default new IdCardService();
