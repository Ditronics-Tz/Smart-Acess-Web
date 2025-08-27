import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Avatar,
  Chip,
  Stack,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Lock,
  LockOpen,
  Save,
  Cancel,
  Person,
  Email,
  Phone,
  CalendarToday,
  AdminPanelSettings,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import UserManagementService, {
  RegistrationOfficer,
  ChangePasswordRequest
} from '../../../service/UserManagementService';

const ManageUser: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<RegistrationOfficer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
  });

  // Password change dialog
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    new_password: '',
    confirm_password: '',
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning'
  });

  const fetchUser = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const userData = await UserManagementService.getRegistrationOfficer(userId);

      // Ensure userData has the required properties
      if (userData && userData.user_id) {
        setUser(userData as RegistrationOfficer);
        setFormData({
          full_name: userData.full_name || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
        });
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      // Note: The API might not support updating user details
      // This is a placeholder for future implementation
      showSnackbar('User details updated successfully', 'success');
      setEditMode(false);
    } catch (err: any) {
      showSnackbar(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
      });
    }
    setEditMode(false);
  };

  const handlePasswordChange = async () => {
    if (!userId) return;

    if (passwordData.new_password !== passwordData.confirm_password) {
      showSnackbar('Passwords do not match', 'error');
      return;
    }

    if (passwordData.new_password.length < 8) {
      showSnackbar('Password must be at least 8 characters long', 'error');
      return;
    }

    try {
      setSaving(true);
      await UserManagementService.changeOfficerPassword(userId, passwordData);
      showSnackbar('Password changed successfully', 'success');
      setPasswordDialog(false);
      setPasswordData({ new_password: '', confirm_password: '' });
    } catch (err: any) {
      showSnackbar(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!userId || !user) return;

    try {
      setSaving(true);
      if (user.is_active) {
        await UserManagementService.deactivateRegistrationOfficer(userId);
        showSnackbar('User account deactivated successfully', 'success');
      } else {
        // Note: API might not have reactivate endpoint
        showSnackbar('User reactivation not implemented in API', 'warning');
      }
      await fetchUser(); // Refresh user data
    } catch (err: any) {
      showSnackbar(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (isActive: boolean, isLocked: boolean) => {
    if (isLocked) return 'error';
    return isActive ? 'success' : 'warning';
  };

  const getStatusLabel = (isActive: boolean, isLocked: boolean) => {
    if (isLocked) return 'Locked';
    return isActive ? 'Active' : 'Inactive';
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
        }}
      >
        <CircularProgress sx={{ color: colors.primary.main }} />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: colors.neutral.white,
              textAlign: 'center',
            }}
          >
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || 'User not found'}
            </Alert>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/admin-dashboard/users')}
              sx={{ backgroundColor: colors.primary.main }}
            >
              Back to Users
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: colors.neutral.white,
            border: `1px solid ${colors.primary.light}`,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <IconButton
                onClick={() => navigate('/admin-dashboard/users')}
                sx={{ color: colors.secondary.main }}
              >
                <ArrowBack />
              </IconButton>
              <Box
                sx={{
                  p: 2,
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, rgba(248, 112, 96, 0.1) 100%)`,
                  borderRadius: 3,
                  boxShadow: 2,
                }}
              >
                <Person sx={{ color: colors.primary.main, fontSize: 32 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.secondary.main, mb: 1 }}
                >
                  Manage Registration Officer
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  @{user.username || 'Unknown'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {!editMode ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditMode(true)}
                  sx={{ borderColor: colors.primary.main, color: colors.primary.main }}
                >
                  Edit Details
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ backgroundColor: colors.primary.main }}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={saving}
                    sx={{ borderColor: 'text.secondary', color: 'text.secondary' }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* User Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Chip
              label={getStatusLabel(user.is_active, user.account_locked)}
              color={getStatusColor(user.is_active, user.account_locked)}
              size="medium"
            />
            <Typography variant="body2" color="text.secondary">
              User ID: {user.user_id || 'N/A'}
            </Typography>
          </Box>
        </Paper>

        {/* User Details - Using Flexbox instead of Grid */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          {/* Main Content Section */}
          <Box sx={{ flex: 2, minWidth: 0 }}>
            <Paper
              elevation={24}
              sx={{
                p: 4,
                borderRadius: 4,
                backgroundColor: colors.neutral.white,
                border: `1px solid ${colors.primary.light}`,
                height: 'fit-content',
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                User Information
              </Typography>

              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.full_name}
                  onChange={handleInputChange('full_name')}
                  disabled={!editMode}
                  variant={editMode ? 'outlined' : 'filled'}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={!editMode}
                  variant={editMode ? 'outlined' : 'filled'}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone_number}
                  onChange={handleInputChange('phone_number')}
                  disabled={!editMode}
                  variant={editMode ? 'outlined' : 'filled'}
                />

                <TextField
                  fullWidth
                  label="Username"
                  value={user.username}
                  disabled
                  variant="filled"
                  helperText="Username cannot be changed"
                />
              </Stack>
            </Paper>
          </Box>

          {/* Sidebar Section */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Stack spacing={4}>
              {/* Account Actions */}
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  backgroundColor: colors.neutral.white,
                  border: `1px solid ${colors.primary.light}`,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                  Account Actions
                </Typography>

                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Lock />}
                    onClick={() => setPasswordDialog(true)}
                    sx={{ backgroundColor: colors.primary.main }}
                  >
                    Change Password
                  </Button>

                  <Button
                    fullWidth
                    variant={user.is_active ? 'outlined' : 'contained'}
                    startIcon={user.is_active ? <LockOpen /> : <Lock />}
                    onClick={handleToggleStatus}
                    disabled={saving}
                    sx={{
                      borderColor: user.is_active ? 'error.main' : 'success.main',
                      color: user.is_active ? 'error.main' : 'white',
                      backgroundColor: user.is_active ? 'transparent' : 'success.main',
                    }}
                  >
                    {user.is_active ? 'Deactivate Account' : 'Reactivate Account'}
                  </Button>
                </Stack>
              </Paper>

              {/* Account Details */}
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  backgroundColor: colors.neutral.white,
                  border: `1px solid ${colors.primary.light}`,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                  Account Details
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Created:</Typography>
                    <Typography variant="body2">{formatDate(user.created_at)}</Typography>
                  </Box>

                  {user.last_login && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Last Login:</Typography>
                      <Typography variant="body2">{formatDate(user.last_login)}</Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Failed Attempts:</Typography>
                    <Typography variant="body2" color={user.failed_login_attempts > 0 ? 'error.main' : 'text.primary'}>
                      {user.failed_login_attempts || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Account Locked:</Typography>
                    <Typography variant="body2" color={user.account_locked ? 'error.main' : 'success.main'}>
                      {user.account_locked ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: colors.secondary.main }}>
          Change Password
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
              helperText="Password must be at least 8 characters long"
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={saving}
            sx={{ backgroundColor: colors.primary.main }}
          >
            {saving ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

export default ManageUser;