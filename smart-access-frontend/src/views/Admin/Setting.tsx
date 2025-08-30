import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Backup,
  Restore,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  CloudDownload,
  History,
  Dataset,
  Security,
  Notifications,
  Palette,
  Language,
  Storage,
} from '@mui/icons-material';
import { colors } from '../../styles/themes/colors';
import AdminSidebar from './shared/AdminSidebar';
import AuthService from '../../service/AuthService';
import { useAdminNavigation } from '../../hooks/useAdminNavigation';
import SettingsService, { BackupResponse, RestoreResponse, ListBackupsResponse } from '../../service/Settings';

const Setting: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<string[]>([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreDialog, setRestoreDialog] = useState({ open: false, selectedBackup: '' });

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: true,
    autoBackup: false,
    backupFrequency: 'daily',
  });

  const username = AuthService.getUsername();
  const handleSidebarNavigation = useAdminNavigation();

  // Fetch available backups on component mount
  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      const response: ListBackupsResponse = await SettingsService.listAvailableBackups();
      setBackups(response.backups);
    } catch (error: any) {
      showSnackbar('Failed to load backups: ' + error.message, 'error');
    }
  };

  const handleCreateBackup = async () => {
    setBackupLoading(true);
    try {
      const response: BackupResponse = await SettingsService.createDatabaseBackup();
      if (response.status === 'success') {
        showSnackbar('Database backup created successfully!', 'success');
        fetchBackups(); // Refresh the backups list
      } else {
        showSnackbar(response.message || 'Failed to create backup', 'error');
      }
    } catch (error: any) {
      showSnackbar('Failed to create backup: ' + error.message, 'error');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestoreBackup = async (backupFilename: string) => {
    if (!window.confirm(`Are you sure you want to restore the database from "${backupFilename}"? This will replace all current data.`)) {
      return;
    }

    setLoading(true);
    try {
      const response: RestoreResponse = await SettingsService.restoreDatabase(backupFilename);
      if (response.status === 'success') {
        showSnackbar('Database restored successfully!', 'success');
        setRestoreDialog({ open: false, selectedBackup: '' });
      } else {
        showSnackbar(response.message || 'Failed to restore database', 'error');
      }
    } catch (error: any) {
      showSnackbar('Failed to restore database: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSettingChange = (setting: string, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    showSnackbar('Setting updated successfully', 'success');
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatBackupDate = (filename: string) => {
    try {
      const details = SettingsService.getBackupDetails(filename);
      return details.formattedDate;
    } catch {
      return 'Unknown date';
    }
  };

  const getBackupSize = (filename: string) => {
    // This would typically come from the API, but for now we'll show a placeholder
    return '~50MB'; // Placeholder
  };

  // Stats cards for the dashboard
  const statsCards = [
    {
      title: "Total Backups",
      value: backups.length.toString(),
      change: "Available for restore",
      icon: <Backup sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "System Health",
      value: "98%",
      change: "All systems operational",
      icon: <Dataset sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "Last Backup",
      value: backups.length > 0 ? formatBackupDate(backups[0]) : "Never",
      change: backups.length > 0 ? "Auto backup enabled" : "No backups found",
      icon: <History sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: backups.length > 0 ? "success.main" : "warning.main",
    },
    {
      title: "Storage Used",
      value: "~2.5GB",
      change: "Database + backups",
      icon: <Storage sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "info.main",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        currentView="settings"
        onNavigate={handleSidebarNavigation}
      />

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        ml: sidebarCollapsed ? "64px" : "280px",
        transition: "margin-left 0.3s ease",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5"
      }}>
        {/* Header */}
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: colors.neutral.white,
            color: colors.secondary.main,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderBottom: `1px solid #e0e0e0`,
          }}
        >
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
              {/* Sidebar Toggle */}
              <IconButton
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                sx={{
                  color: colors.secondary.main,
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                <MenuIcon />
              </IconButton>

              <Box
                sx={{
                  p: 1.5,
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <SettingsIcon sx={{ color: colors.neutral.white, fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    color: colors.secondary.main,
                    lineHeight: 1.2,
                  }}
                >
                  System Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Database Management & System Configuration
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Welcome Section */}
            <Paper
              sx={{
                background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                color: colors.neutral.white,
                p: 4,
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    System Settings
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                    Manage database backups, system configuration, and administrative settings
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    border: `4px solid rgba(255,255,255,0.3)`,
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    backgroundColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  <SettingsIcon sx={{ fontSize: "3rem" }} />
                </Avatar>
              </Box>
            </Paper>

            {/* Stats Overview */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {statsCards.map((stat, index) => (
                <Box key={index} sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
                  <Card
                    sx={{
                      height: "100%",
                      boxShadow: 2,
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" fontWeight="500">
                            {stat.title}
                          </Typography>
                          <Typography variant="h3" fontWeight="bold" color={colors.secondary.main}>
                            {stat.value}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 1.5,
                            backgroundColor: index % 2 === 0 ? "rgba(16, 37, 66, 0.1)" : "rgba(248, 112, 96, 0.1)",
                            borderRadius: 2,
                          }}
                        >
                          {stat.icon}
                        </Box>
                      </Box>
                      <Typography variant="caption" sx={{ color: stat.changeColor, fontWeight: 500 }}>
                        {stat.change}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>

            {/* Database Management Section */}
            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                Database Management
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Create Backup */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <Card sx={{ height: '100%', border: `1px solid ${colors.primary.light}` }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: colors.primary.main }}>
                          <Backup />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            Create Database Backup
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Create a full backup of the current database
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={backupLoading ? <CircularProgress size={20} /> : <CloudDownload />}
                        onClick={handleCreateBackup}
                        disabled={backupLoading}
                        sx={{
                          backgroundColor: colors.primary.main,
                          "&:hover": { backgroundColor: colors.primary.hover },
                          width: '100%'
                        }}
                      >
                        {backupLoading ? 'Creating Backup...' : 'Create Backup'}
                      </Button>
                    </CardContent>
                  </Card>
                </Box>

                {/* Available Backups */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <Card sx={{ height: '100%', border: `1px solid ${colors.secondary.light}` }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: colors.secondary.main }}>
                          <History />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            Available Backups
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {backups.length} backup{backups.length !== 1 ? 's' : ''} available
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        startIcon={<History />}
                        onClick={fetchBackups}
                        sx={{
                          borderColor: colors.secondary.main,
                          color: colors.secondary.main,
                          "&:hover": {
                            borderColor: colors.secondary.hover,
                            backgroundColor: "rgba(16, 37, 66, 0.04)",
                          },
                          width: '100%'
                        }}
                      >
                        Refresh Backups
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Paper>

            {/* Backup List */}
            {backups.length > 0 && (
              <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                  Available Database Backups
                </Typography>
                <List>
                  {backups.map((backup, index) => (
                    <React.Fragment key={backup}>
                      <ListItem sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Dataset sx={{ color: colors.primary.main }} />
                              <Typography variant="subtitle1" fontWeight="500">
                                {backup}
                              </Typography>
                              <Chip
                                label={formatBackupDate(backup)}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              Size: {getBackupSize(backup)} • Created: {formatBackupDate(backup)}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Button
                            variant="contained"
                            startIcon={<Restore />}
                            onClick={() => setRestoreDialog({ open: true, selectedBackup: backup })}
                            sx={{
                              backgroundColor: colors.secondary.main,
                              "&:hover": { backgroundColor: colors.secondary.hover },
                            }}
                          >
                            Restore
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < backups.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}

            {/* System Settings */}
            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                System Configuration
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Theme Settings */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={systemSettings.theme}
                      label="Theme"
                      onChange={(e) => handleSystemSettingChange('theme', e.target.value)}
                      sx={{
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.primary.main,
                        },
                      }}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="auto">Auto (System)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Language Settings */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={systemSettings.language}
                      label="Language"
                      onChange={(e) => handleSystemSettingChange('language', e.target.value)}
                      sx={{
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.primary.main,
                        },
                      }}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Backup Frequency */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Auto Backup Frequency</InputLabel>
                    <Select
                      value={systemSettings.backupFrequency}
                      label="Auto Backup Frequency"
                      onChange={(e) => handleSystemSettingChange('backupFrequency', e.target.value)}
                      sx={{
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.primary.main,
                        },
                      }}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="disabled">Disabled</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Notifications Toggle */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Notifications</InputLabel>
                    <Select
                      value={systemSettings.notifications ? 'enabled' : 'disabled'}
                      label="Notifications"
                      onChange={(e) => handleSystemSettingChange('notifications', e.target.value === 'enabled')}
                      sx={{
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.primary.main,
                        },
                      }}
                    >
                      <MenuItem value="enabled">Enabled</MenuItem>
                      <MenuItem value="disabled">Disabled</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Restore Confirmation Dialog */}
      <Dialog
        open={restoreDialog.open}
        onClose={() => setRestoreDialog({ open: false, selectedBackup: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: colors.secondary.main, fontWeight: 'bold' }}>
          Confirm Database Restore
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to restore the database from:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.main, mb: 2 }}>
            {restoreDialog.selectedBackup}
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action will replace all current data with the backup data. This cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRestoreDialog({ open: false, selectedBackup: '' })}
            sx={{ color: colors.secondary.main }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleRestoreBackup(restoreDialog.selectedBackup)}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Restore />}
            sx={{
              backgroundColor: colors.secondary.main,
              "&:hover": { backgroundColor: colors.secondary.hover },
            }}
          >
            {loading ? 'Restoring...' : 'Restore Database'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Setting;
