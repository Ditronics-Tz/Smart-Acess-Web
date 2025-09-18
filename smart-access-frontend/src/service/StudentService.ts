import { apiClient } from '../api/config';

// Student Interfaces
export interface Student {
  id: number;
  student_uuid: string;
  surname: string;
  first_name: string;
  middle_name?: string;
  mobile_phone?: string;
  registration_number: string;
  department: string;
  soma_class_code?: string;
  academic_year_status: 'Continuing' | 'Retake' | 'Deferred' | 'Probation' | 'Completed';
  student_status: 'Enrolled' | 'Withdrawn' | 'Suspended';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateStudentRequest {
  surname: string;
  first_name: string;
  middle_name?: string;
  mobile_phone?: string;
  registration_number: string;
  department: string;
  soma_class_code?: string;
  academic_year_status?: 'Continuing' | 'Retake' | 'Deferred' | 'Probation' | 'Completed';
  student_status?: 'Enrolled' | 'Withdrawn' | 'Suspended';
}

export interface StudentsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Student[];
}

export interface StudentFilters {
  page?: number;
  page_size?: number;
  search?: string;
  department?: string;
  academic_year_status?: 'Continuing' | 'Retake' | 'Deferred' | 'Probation' | 'Completed';
  student_status?: 'Enrolled' | 'Withdrawn' | 'Suspended';
  is_active?: boolean;
  ordering?: string;
  // Removed: program field (not in API documentation)
}

// CSV Upload Interfaces
export interface CSVUploadResponse {
  success: boolean;
  message: string;
  data: {
    total_created: number;
    students: Student[];
    uploaded_by: {
      username: string;
      user_type: string;
      full_name: string;
      upload_timestamp: string;
    };
  };
}

export interface CSVUploadError {
  success: false;
  message: string;
  errors: {
    csv_file?: string[];
    csv_errors?: string[];
    total_rows?: number;
    valid_rows?: number;
    error_rows?: number;
  } | string;
}

export interface ValidationInfo {
  required_fields: string[];
  optional_fields: string[];
  academic_year_status_choices: string[];
  student_status_choices: string[];
  file_requirements: {
    format: string;
    max_size: string;
    encoding: string;
    extensions?: string[];
  };
  validation_rules: {
    [key: string]: string;
  };
  field_lengths?: {
    [key: string]: number;
  };
  user_permissions: {
    current_user: string;
    user_type: string;
    full_name: string;
    can_upload: boolean;
    can_download_template: boolean;
    can_create_students: boolean;
    can_view_students: boolean;
    can_modify_students: boolean;
    can_delete_students: boolean;
  };
}

// Common Response Interfaces
export interface DeleteResponse {
  message: string;
  deleted_at: string;
}

export interface RestoreResponse {
  message: string;
  data: Student;
}

class StudentService {
  private readonly baseURL = '/api/students';

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

  // Helper method for FormData requests (file uploads)
  private getAuthHeadersForFormData() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please log in again.');
    }

    return {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
      // Don't set Content-Type for FormData, browser will set it automatically
    };
  }

  // ================================
  // STANDARD CRUD METHODS
  // ================================

  /**
   * Create a new student
   * POST /api/students/students/
   */
  async createStudent(studentData: CreateStudentRequest): Promise<Student> {
    try {
      const response = await apiClient.post(`${this.baseURL}/`, studentData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * List all students with optional filters and pagination
   * GET /api/students/students/
   */
  async listStudents(filters?: StudentFilters): Promise<StudentsListResponse> {
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

      // Handle the actual API response format
      if (Array.isArray(response.data)) {
        // API returns direct array, so we wrap it in expected format
        return {
          count: response.data.length,
          next: null,
          previous: null,
          results: response.data
        };
      } else if (response.data && response.data.results) {
        // API returns paginated format
        return response.data;
      } else {
        // Fallback - treat as direct array
        return {
          count: 1,
          next: null,
          previous: null,
          results: Array.isArray(response.data) ? response.data : [response.data]
        };
      }
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get detailed information about a specific student
   * GET /api/students/students/{student_uuid}/
   */
  async getStudent(studentUuid: string): Promise<Student> {
    try {
      const response = await apiClient.get(`${this.baseURL}/${studentUuid}/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get student by registration number
   */
  async getStudentByRegistrationNumber(registrationNumber: string): Promise<Student> {
    try {
      const response = await this.listStudents({ 
        search: registrationNumber,
        page_size: 1 
      });

      if (response.results.length === 0) {
        throw new Error(`No student found with registration number: ${registrationNumber}`);
      }

      const student = response.results.find(s => s.registration_number === registrationNumber);
      if (!student) {
        throw new Error(`No student found with registration number: ${registrationNumber}`);
      }

      return student;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Update student information (partial update)
   * PATCH /api/students/students/{student_uuid}/
   * Note: Only administrators can modify students
   */
  async updateStudent(studentUuid: string, updateData: Partial<CreateStudentRequest>): Promise<Student> {
    try {
      const response = await apiClient.patch(`${this.baseURL}/${studentUuid}/`, updateData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Full update of student information
   * PUT /api/students/students/{student_uuid}/
   * Note: Only administrators can modify students
   */
  async replaceStudent(studentUuid: string, studentData: CreateStudentRequest): Promise<Student> {
    try {
      const response = await apiClient.put(`${this.baseURL}/${studentUuid}/`, studentData, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Soft delete a student
   * DELETE /api/students/students/{student_uuid}/
   * Note: Only administrators can delete students
   */
  async deleteStudent(studentUuid: string): Promise<DeleteResponse> {
    try {
      const response = await apiClient.delete(`${this.baseURL}/${studentUuid}/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Restore a previously soft-deleted student
   * Note: This endpoint may not exist in the API, check documentation
   */
  async restoreStudent(studentUuid: string): Promise<RestoreResponse> {
    try {
      const response = await apiClient.post(`${this.baseURL}/${studentUuid}/restore/`, {}, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ================================
  // CSV UPLOAD METHODS
  // ================================

  /**
   * Upload CSV file containing student data for bulk creation
   * POST /api/students/students/upload-csv/
   */
  async uploadStudentCSV(file: File): Promise<CSVUploadResponse> {
    try {
      // Validate file before uploading
      if (!file.name.toLowerCase().endsWith('.csv')) {
        throw new Error('Please select a CSV file (.csv extension)');
      }

      // Validate file size (5MB limit as per documentation)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      const formData = new FormData();
      formData.append('csv_file', file);

      const response = await apiClient.post(`${this.baseURL}/upload-csv/`, formData, {
        headers: this.getAuthHeadersForFormData()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Download CSV template for student upload
   * GET /api/students/students/csv-template/
   */
  async downloadCSVTemplate(): Promise<Blob> {
    try {
      const response = await apiClient.get(`${this.baseURL}/csv-template/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Accept': 'text/csv, application/octet-stream'
        },
        responseType: 'blob'
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get validation information for CSV upload
   * GET /api/students/students/validation-info/
   */
  async getValidationInfo(): Promise<ValidationInfo> {
    try {
      const response = await apiClient.get(`${this.baseURL}/validation-info/`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Helper method to download CSV template as file
   */
  async downloadCSVTemplateAsFile(filename: string = 'student_upload_template.csv'): Promise<void> {
    try {
      const blob = await this.downloadCSVTemplate();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ================================
  // CONVENIENCE METHODS
  // ================================

  /**
   * Get all students (unpaginated for dropdowns)
   */
  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await this.listStudents({ page_size: 1000 });
      return response.results;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get active students only
   */
  async getActiveStudents(filters?: Omit<StudentFilters, 'is_active'>): Promise<StudentsListResponse> {
    return this.listStudents({
      ...filters,
      is_active: true
    });
  }

  /**
   * Get enrolled students only
   */
  async getEnrolledStudents(filters?: Omit<StudentFilters, 'student_status'>): Promise<StudentsListResponse> {
    return this.listStudents({
      ...filters,
      student_status: 'Enrolled'
    });
  }

  /**
   * Search students by name or registration number
   */
  async searchStudents(searchTerm: string, filters?: Omit<StudentFilters, 'search'>): Promise<StudentsListResponse> {
    return this.listStudents({
      ...filters,
      search: searchTerm,
      page_size: 50
    });
  }

  /**
   * Get students by department
   */
  async getStudentsByDepartment(department: string, filters?: Omit<StudentFilters, 'department'>): Promise<StudentsListResponse> {
    return this.listStudents({
      ...filters,
      department
    });
  }

  /**
   * Get dashboard statistics for students
   */
  async getStudentStats(): Promise<{
    total_students: number;
    enrolled_students: number;
    withdrawn_students: number;
    suspended_students: number;
    active_students: number;
    by_academic_status: {
      continuing: number;
      retake: number;
      deferred: number;
      probation: number;
      completed: number;
    };
    by_department: { [department: string]: number };
  }> {
    try {
      const response = await this.listStudents({ page_size: 1000 });
      const students = response.results;

      const stats = {
        total_students: students.length,
        enrolled_students: students.filter(s => s.student_status === 'Enrolled').length,
        withdrawn_students: students.filter(s => s.student_status === 'Withdrawn').length,
        suspended_students: students.filter(s => s.student_status === 'Suspended').length,
        active_students: students.filter(s => s.is_active).length,
        by_academic_status: {
          continuing: students.filter(s => s.academic_year_status === 'Continuing').length,
          retake: students.filter(s => s.academic_year_status === 'Retake').length,
          deferred: students.filter(s => s.academic_year_status === 'Deferred').length,
          probation: students.filter(s => s.academic_year_status === 'Probation').length,
          completed: students.filter(s => s.academic_year_status === 'Completed').length,
        },
        by_department: {} as { [department: string]: number }
      };

      // Calculate department statistics
      students.forEach(student => {
        if (!stats.by_department[student.department]) {
          stats.by_department[student.department] = 0;
        }
        stats.by_department[student.department]++;
      });

      return stats;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get unique departments
   */
  async getDepartments(): Promise<string[]> {
    try {
      const response = await this.listStudents({ page_size: 1000 });
      const departments = Array.from(new Set(response.results.map(student => student.department)));
      return departments.sort();
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get students by academic year status
   */
  async getStudentsByAcademicStatus(
    status: 'Continuing' | 'Retake' | 'Deferred' | 'Probation' | 'Completed',
    filters?: Omit<StudentFilters, 'academic_year_status'>
  ): Promise<StudentsListResponse> {
    return this.listStudents({
      ...filters,
      academic_year_status: status
    });
  }

  /**
   * Bulk update student status
   * Note: Only administrators can modify students
   */
  async bulkUpdateStudentStatus(
    studentUuids: string[],
    status: 'Enrolled' | 'Withdrawn' | 'Suspended'
  ): Promise<{ updated: number; errors: any[] }> {
    const results = { updated: 0, errors: [] as any[] };

    for (const studentUuid of studentUuids) {
      try {
        await this.updateStudent(studentUuid, { student_status: status });
        results.updated++;
      } catch (error: any) {
        results.errors.push({
          student_uuid: studentUuid,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Bulk update academic year status
   * Note: Only administrators can modify students
   */
  async bulkUpdateAcademicStatus(
    studentUuids: string[],
    status: 'Continuing' | 'Retake' | 'Deferred' | 'Probation' | 'Completed'
  ): Promise<{ updated: number; errors: any[] }> {
    const results = { updated: 0, errors: [] as any[] };

    for (const studentUuid of studentUuids) {
      try {
        await this.updateStudent(studentUuid, { academic_year_status: status });
        results.updated++;
      } catch (error: any) {
        results.errors.push({
          student_uuid: studentUuid,
          error: error.message
        });
      }
    }

    return results;
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
        return new Error(data.detail || 'Student not found.');
      } else if (status === 400) {
        // Handle validation errors for CSV upload
        if (data.success === false) {
          if (data.errors && typeof data.errors === 'object') {
            if (data.errors.csv_file) {
              return new Error(Array.isArray(data.errors.csv_file) ? data.errors.csv_file[0] : data.errors.csv_file);
            } else if (data.errors.csv_errors) {
              return new Error(`CSV validation failed:\n${data.errors.csv_errors.join('\n')}`);
            } else if (typeof data.errors === 'string') {
              return new Error(data.errors);
            }
          }
          return new Error(data.message || 'CSV upload failed');
        }

        // Handle standard validation errors - removed email and program field checks
        if (data.detail) {
          return new Error(data.detail);
        } else if (data.registration_number) {
          return new Error(Array.isArray(data.registration_number) ? data.registration_number[0] : data.registration_number);
        } else if (data.surname) {
          return new Error(Array.isArray(data.surname) ? data.surname[0] : data.surname);
        } else if (data.first_name) {
          return new Error(Array.isArray(data.first_name) ? data.first_name[0] : data.first_name);
        } else if (data.department) {
          return new Error(Array.isArray(data.department) ? data.department[0] : data.department);
        } else if (data.mobile_phone) {
          return new Error(Array.isArray(data.mobile_phone) ? data.mobile_phone[0] : data.mobile_phone);
        } else if (data.non_field_errors) {
          return new Error(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors);
        }
        return new Error('Validation error occurred.');
      } else if (status === 413) {
        return new Error('File size too large. Maximum size is 5MB.');
      } else if (status === 415) {
        return new Error('Invalid file format. Please upload a CSV file.');
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

export default new StudentService();