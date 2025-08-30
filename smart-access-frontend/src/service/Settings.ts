import { apiClient } from '../api/config';

// Interfaces for API responses
export interface BackupResponse {
  status: 'success' | 'error';
  backup_file?: string;
  message?: string;
}

export interface RestoreResponse {
  status: 'success' | 'error';
  message: string;
}

export interface ListBackupsResponse {
  backups: string[];
}

class SettingsService {
  private baseUrl = '/api/administrator';

  /**
   * Create a database backup
   * POST /api/administrator/backup/
   */
  async createDatabaseBackup(): Promise<BackupResponse> {
    try {
      const response = await apiClient.post<BackupResponse>(`${this.baseUrl}/backup/`);
      return response.data;
    } catch (error: any) {
      console.error('Error creating database backup:', error);
      throw new Error(error.response?.data?.message || 'Failed to create database backup');
    }
  }

  /**
   * Restore database from a backup file
   * POST /api/administrator/restore/<backup_filename>/
   */
  async restoreDatabase(backupFilename: string): Promise<RestoreResponse> {
    try {
      const response = await apiClient.post<RestoreResponse>(`${this.baseUrl}/restore/${backupFilename}/`);
      return response.data;
    } catch (error: any) {
      console.error('Error restoring database:', error);
      throw new Error(error.response?.data?.message || 'Failed to restore database');
    }
  }

  /**
   * List all available backup files
   * GET /api/administrator/backups/
   */
  async listAvailableBackups(): Promise<ListBackupsResponse> {
    try {
      const response = await apiClient.get<ListBackupsResponse>(`${this.baseUrl}/backups/`);
      return response.data;
    } catch (error: any) {
      console.error('Error listing backups:', error);
      throw new Error(error.response?.data?.message || 'Failed to list available backups');
    }
  }

  /**
   * Get backup file details (filename parsing utility)
   */
  getBackupDetails(filename: string): {
    date: Date;
    timestamp: string;
    formattedDate: string;
  } {
    // Assuming filename format: backup_YYYYMMDD_HHMMSS.sql
    const match = filename.match(/backup_(\d{8})_(\d{6})\.sql/);
    if (!match) {
      throw new Error('Invalid backup filename format');
    }

    const dateStr = match[1]; // YYYYMMDD
    const timeStr = match[2]; // HHMMSS

    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months are 0-based
    const day = parseInt(dateStr.substring(6, 8));
    const hour = parseInt(timeStr.substring(0, 2));
    const minute = parseInt(timeStr.substring(2, 4));
    const second = parseInt(timeStr.substring(4, 6));

    const date = new Date(year, month, day, hour, minute, second);
    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return {
      date,
      timestamp: `${dateStr}_${timeStr}`,
      formattedDate
    };
  }
}

export default new SettingsService();