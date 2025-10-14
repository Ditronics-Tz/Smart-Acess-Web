import { apiClient } from '../api/config';

// Types based on API documentation
export interface DashboardOverview {
  overview: {
    total_users: number;
    total_students: number;
    total_staff: number;
    total_security: number;
    total_cards: number;
    active_cards: number;
  };
  recent_activity: {
    today_verifications: number;
    today_print_jobs: number;
    this_week_new_cards: number;
  };
  photo_completion: {
    students: {
      with_photos: number;
      total: number;
      completion_rate: number;
    };
    staff: {
      with_photos: number;
      total: number;
      completion_rate: number;
    };
  };
}

export interface CardAnalytics {
  issuance_trends: Array<{
    date: string;
    student_cards: number;
    staff_cards: number;
    security_cards: number;
  }>;
  distribution: {
    by_type: Array<{
      card_type: string;
      count: number;
    }>;
    by_status: Array<{
      is_active: boolean;
      count: number;
    }>;
  };
  print_statistics: {
    total_print_jobs: number;
    successful_prints: number;
    failed_prints: number;
    success_rate: number;
  };
}

export interface VerificationAnalytics {
  summary: {
    total_verifications: number;
    successful_verifications: number;
    failed_verifications: number;
    success_rate: number;
  };
  daily_trends: Array<{
    date: string;
    total_verifications: number;
    successful: number;
    failed: number;
  }>;
  by_location: Array<{
    location: string;
    total_verifications: number;
    success_rate: number;
  }>;
  peak_hours: Array<{
    hour: number;
    count: number;
  }>;
}

export interface UserDemographics {
  students: {
    total: number;
    by_status: Array<{
      academic_year_status: string;
      count: number;
    }>;
    by_department: Array<{
      department: string;
      count: number;
    }>;
    registration_trends: Array<{
      date: string;
      count: number;
    }>;
    phone_completion_rate: number;
  };
  staff: {
    total: number;
    by_status: Array<{
      employment_status: string;
      count: number;
    }>;
    by_department: Array<{
      department: string;
      count: number;
    }>;
    phone_completion_rate: number;
  };
  security_personnel: {
    total: number;
    active: number;
  };
}

export interface SystemHealth {
  infrastructure: {
    gates: {
      total: number;
      status_summary: Array<{
        status: string;
        count: number;
      }>;
      by_location: Array<{
        location__location_name: string;
        location__location_type: string;
        gate_count: number;
      }>;
    };
    locations: {
      total: number;
      restricted: number;
      by_type: Array<{
        location_type: string;
        count: number;
      }>;
    };
  };
  data_integrity: {
    students_without_cards: number;
    staff_without_cards: number;
    cards_without_photos: number;
  };
}

export interface SystemAlert {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description?: string;
  metric_value?: number;
  threshold_value?: number;
  created_at: string;
  acknowledged_at?: string | null;
  acknowledged_by?: string | null;
  resolved_at?: string | null;
}

export interface SystemAlerts {
  active_alerts: SystemAlert[];
  resolved_alerts: SystemAlert[];
  summary: {
    total_active: number;
    by_severity: Array<{
      severity: string;
      count: number;
    }>;
  };
}

export interface ComprehensiveReport {
  report_type: string;
  data: {
    executive_summary: {
      total_system_users: number;
      total_active_cards: number;
      card_utilization_rate: number;
      system_health_score: number;
      data_completeness_score: number;
    };
    dashboard_overview: DashboardOverview;
    card_analytics: CardAnalytics;
    verification_analytics: VerificationAnalytics;
    user_demographics: UserDemographics;
    system_health: SystemHealth;
  };
  generated_at: string;
  report_version: string;
}

export interface HistoricalSnapshot {
  date: string;
  total_users: number;
  total_students: number;
  total_staff: number;
  total_cards: number;
  daily_verifications: number;
  student_photo_completion: number;
  staff_photo_completion: number;
}

export interface HistoricalAnalytics {
  snapshots: HistoricalSnapshot[];
  trends: {
    user_growth: number;
    card_growth: number;
    verification_change: number;
  };
  parameters: {
    report_type: string;
    days: number;
    total_snapshots: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  generated_at?: string;
}

class AnalyticsService {
  private baseUrl = 'api/stats/';

  /**
   * Get dashboard overview data
   */
  async getDashboardOverview(): Promise<ApiResponse<DashboardOverview>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}dashboard/`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch dashboard overview:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch dashboard overview');
    }
  }

  /**
   * Get card analytics data
   */
  async getCardAnalytics(): Promise<ApiResponse<CardAnalytics>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}analytics/cards/`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch card analytics:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch card analytics');
    }
  }

  /**
   * Get verification analytics data
   * @param days - Number of days to analyze (default: 30)
   * @param location - Filter by specific location
   */
  async getVerificationAnalytics(days: number = 30, location?: string): Promise<ApiResponse<VerificationAnalytics>> {
    try {
      const params = new URLSearchParams();
      params.append('days', days.toString());
      if (location) {
        params.append('location', location);
      }

      const response = await apiClient.get(`${this.baseUrl}analytics/verifications/?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch verification analytics:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch verification analytics');
    }
  }

  /**
   * Get user demographics data
   */
  async getUserDemographics(): Promise<ApiResponse<UserDemographics>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}analytics/demographics/`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch user demographics:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch user demographics');
    }
  }

  /**
   * Get system health report
   */
  async getSystemHealth(): Promise<ApiResponse<SystemHealth>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}system/health/`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch system health:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch system health');
    }
  }

  /**
   * Get comprehensive report with all analytics
   */
  async getComprehensiveReport(): Promise<ApiResponse<ComprehensiveReport>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}reports/comprehensive/`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch comprehensive report:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch comprehensive report');
    }
  }

  /**
   * Get system alerts
   */
  async getSystemAlerts(): Promise<ApiResponse<SystemAlerts>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}alerts/`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch system alerts:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch system alerts');
    }
  }

  /**
   * Acknowledge a specific alert
   * @param alertId - The ID of the alert to acknowledge
   */
  async acknowledgeAlert(alertId: string): Promise<ApiResponse<{ message: string; alert_id: string }>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}alerts/${alertId}/acknowledge/`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to acknowledge alert:', error);
      throw new Error(error.response?.data?.error || 'Failed to acknowledge alert');
    }
  }

  /**
   * Resolve a specific alert
   * @param alertId - The ID of the alert to resolve
   */
  async resolveAlert(alertId: string): Promise<ApiResponse<{ message: string; alert_id: string }>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}alerts/${alertId}/resolve/`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to resolve alert:', error);
      throw new Error(error.response?.data?.error || 'Failed to resolve alert');
    }
  }

  /**
   * Get historical analytics snapshots
   * @param type - Snapshot type (daily, weekly, monthly)
   * @param days - Number of days to retrieve
   */
  async getHistoricalAnalytics(
    type: 'daily' | 'weekly' | 'monthly' = 'daily',
    days: number = 30
  ): Promise<ApiResponse<HistoricalAnalytics>> {
    try {
      const params = new URLSearchParams();
      params.append('type', type);
      params.append('days', days.toString());

      const response = await apiClient.get(`${this.baseUrl}analytics/historical/?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch historical analytics:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch historical analytics');
    }
  }

  /**
   * Generate a manual analytics snapshot
   */
  async generateSnapshot(): Promise<ApiResponse<{ message: string; snapshot_id: string; created_at: string }>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}snapshots/generate/`, {
        type: 'manual'
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to generate snapshot:', error);
      throw new Error(error.response?.data?.error || 'Failed to generate snapshot');
    }
  }

  /**
   * Get all analytics data for a complete dashboard view
   * This method combines multiple API calls for efficiency
   */
  async getAllAnalytics(): Promise<{
    dashboard: DashboardOverview | null;
    cards: CardAnalytics | null;
    verifications: VerificationAnalytics | null;
    demographics: UserDemographics | null;
    health: SystemHealth | null;
    alerts: SystemAlerts | null;
    errors: string[];
  }> {
    const results = {
      dashboard: null as DashboardOverview | null,
      cards: null as CardAnalytics | null,
      verifications: null as VerificationAnalytics | null,
      demographics: null as UserDemographics | null,
      health: null as SystemHealth | null,
      alerts: null as SystemAlerts | null,
      errors: [] as string[]
    };

    // Execute all requests in parallel
    const promises = [
      this.getDashboardOverview().catch(err => ({ error: `Dashboard: ${err.message}` })),
      this.getCardAnalytics().catch(err => ({ error: `Cards: ${err.message}` })),
      this.getVerificationAnalytics().catch(err => ({ error: `Verifications: ${err.message}` })),
      this.getUserDemographics().catch(err => ({ error: `Demographics: ${err.message}` })),
      this.getSystemHealth().catch(err => ({ error: `Health: ${err.message}` })),
      this.getSystemAlerts().catch(err => ({ error: `Alerts: ${err.message}` }))
    ];

    const responses = await Promise.all(promises);

    // Process responses
    responses.forEach((response, index) => {
      if ('error' in response) {
        results.errors.push(response.error || 'Unknown error occurred');
      } else if (response.success && response.data) {
        switch (index) {
          case 0:
            results.dashboard = response.data as DashboardOverview;
            break;
          case 1:
            results.cards = response.data as CardAnalytics;
            break;
          case 2:
            results.verifications = response.data as VerificationAnalytics;
            break;
          case 3:
            results.demographics = response.data as UserDemographics;
            break;
          case 4:
            results.health = response.data as SystemHealth;
            break;
          case 5:
            results.alerts = response.data as SystemAlerts;
            break;
        }
      }
    });

    return results;
  }

  /**
   * Export analytics data to CSV format
   * @param data - The data to export
   * @param filename - The filename for the export
   */
  exportToCSV(data: any[], filename: string): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Format numbers for display in UI
   */
  formatNumber(num: number, decimals: number = 0): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  }

  /**
   * Format percentage for display
   */
  formatPercentage(value: number, decimals: number = 1): string {
    return `${this.formatNumber(value, decimals)}%`;
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  /**
   * Get color based on alert severity
   */
  getAlertSeverityColor(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#d32f2f';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
      default:
        return '#2196f3';
    }
  }

  /**
   * Calculate trend direction and percentage
   */
  calculateTrend(current: number, previous: number): { direction: 'up' | 'down' | 'stable'; percentage: number } {
    if (previous === 0) {
      return { direction: 'stable', percentage: 0 };
    }

    const percentage = ((current - previous) / previous) * 100;
    
    if (Math.abs(percentage) < 0.1) {
      return { direction: 'stable', percentage: 0 };
    }

    return {
      direction: percentage > 0 ? 'up' : 'down',
      percentage: Math.abs(percentage)
    };
  }
}

export default new AnalyticsService();