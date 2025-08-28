import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Container,
  Paper,
  Card,
  CardContent,
  TextField,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Switch,
  FormControlLabel,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person,
  Settings,
  ExitToApp,
  Security,
  ArrowBack,
  Edit,
  Delete,
  Save,
  Cancel,
  Visibility,
  Phone,
  Badge as BadgeIcon,
  CalendarToday,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import AdminSidebar from '../shared/AdminSidebar';
import AuthService from '../../../service/AuthService';
import SecurityPersonelService, { SecurityPersonnel } from '../../../service/SecurityPersonelService';

const ManageSecurity: React.FC = () => {
  const navigate = useNavigate();
  const { securityId } = useParams<{ securityId: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personnel, setPersonnel] = useState<SecurityPersonnel | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form data state - updated to match actual API fields
  const [formData, setFormData] = useState({
    employee_id: '',
    badge_number: '',
    full_name: '',
    phone_number: '',
    hire_date: '',
    termination_date: '',
    is_active: true,
  });

  const username = AuthService.getUsername();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/');
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSidebarNavigation = (view: string) => {
    switch (view) {
      case "dashboard":
        navigate('/admin-dashboard');
        break;
      case "users":
        navigate('/admin-dashboard/users');
        break;
      case "security":
        navigate('/admin-dashboard/security');
        break;
      case "access-control":
        navigate('/admin-dashboard/access-control');
        break;
      case "reports":
        navigate('/admin-dashboard/reports');
        break;
      case "locations":
        navigate('/admin-dashboard/locations');
        break;
      case "settings":
        navigate('/admin-dashboard/settings');
        break;
      default:
        navigate('/admin-dashboard');
    }
  };

  const fetchPersonnelData = async () => {
    if (!securityId) {
      setError('Security personnel ID not provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await SecurityPersonelService.getSecurityPersonnelById(securityId);
      setPersonnel(data);
      
      // Populate form data with actual API fields
      setFormData({
        employee_id: data.employee_id || '',
        badge_number: data.badge_number || '',
        full_name: data.full_name || '',
        phone_number: data.phone_number || '',
        hire_date: data.hire_date || '',
        termination_date: data.termination_date || '',
        is_active: data.is_active,
      });
    } catch (err: any) {
      setError(err.message);
      showSnackbar('Failed to fetch personnel data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnelData();
  }, [securityId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!securityId || !personnel) return;

    try {
      setSaving(true);
      await SecurityPersonelService.updateSecurityPersonnel(securityId, formData);
      
      // Refresh personnel data
      await fetchPersonnelData();
      setEditMode(false);
      showSnackbar('Personnel information updated successfully', 'success');
    } catch (err: any) {
      showSnackbar(`Failed to update personnel: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!securityId) return;

    try {
      setSaving(true);
      await SecurityPersonelService.deleteSecurityPersonnel(securityId);
      showSnackbar('Personnel deleted successfully', 'success');
      setDeleteDialogOpen(false);
      navigate('/admin-dashboard/security');
    } catch (err: any) {
      showSnackbar(`Failed to delete personnel: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!securityId || !personnel) return;

    try {
      setSaving(true);
      const newStatus = !personnel.is_active;
      await SecurityPersonelService.updateSecurityPersonnel(securityId, { is_active: newStatus });
      
      // Refresh personnel data
      await fetchPersonnelData();
      showSnackbar(`Personnel ${newStatus ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (err: any) {
      showSnackbar(`Failed to update status: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get initials from full name
  const getInitials = (fullName: string) => {
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length >= 2) {
      return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
    }
    return fullName.charAt(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          currentView="security"
          onNavigate={handleSidebarNavigation}
        />
        <Box sx={{ 
          flex: 1, 
          ml: sidebarCollapsed ? "64px" : "280px",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: "100vh",
          backgroundColor: "#f5f5f5"
        }}>
          <CircularProgress sx={{ color: colors.primary.main }} size={60} />
        </Box>
      </Box>
    );
  }

  if (error || !personnel) {
    return (
      <Box sx={{ display: "flex" }}>
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          currentView="security"
          onNavigate={handleSidebarNavigation}
        />
        <Box sx={{ 
          flex: 1, 
          ml: sidebarCollapsed ? "64px" : "280px",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          p: 4
        }}>
          <Alert severity="error">
            {error || 'Personnel not found'}
          </Alert>
          <Button 
            onClick={() => navigate('/admin-dashboard/security')}
            sx={{ mt: 2 }}
            startIcon={<ArrowBack />}
          >
            Back to Security Personnel
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        currentView="security"
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
                onClick={toggleSidebar}
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
                <Security sx={{ color: colors.neutral.white, fontSize: 28 }} />
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
                  Manage Security Personnel
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {personnel.full_name} - {personnel.employee_id}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* User menu */}
              <Button
                onClick={handleMenu}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  textTransform: "none",
                  color: colors.secondary.main,
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                    border: `2px solid ${colors.primary.main}`,
                  }}
                >
                  {username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}>
                  <Typography variant="body2" fontWeight="600" sx={{ lineHeight: 1.2 }}>
                    {username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Administrator
                  </Typography>
                </Box>
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 3,
                  sx: { mt: 1.5, minWidth: 180 },
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Person sx={{ mr: 2, color: colors.secondary.main }} />
                  <Typography color={colors.secondary.main}>Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Settings sx={{ mr: 2, color: colors.secondary.main }} />
                  <Typography color={colors.secondary.main}>Settings</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 2, color: "error.main" }} />
                  <Typography color="error.main">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Back Button and Actions */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              onClick={() => navigate('/admin-dashboard/security')}
              startIcon={<ArrowBack />}
              sx={{ 
                color: colors.secondary.main,
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
              }}
            >
              Back to Security Personnel
            </Button>

            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => navigate(`/admin-dashboard/security/view/${securityId}`)}
                startIcon={<Visibility />}
                variant="outlined"
                sx={{
                  borderColor: colors.primary.main,
                  color: colors.primary.main,
                  '&:hover': { borderColor: colors.primary.hover }
                }}
              >
                View Details
              </Button>
              
              {!editMode ? (
                <Button
                  onClick={() => setEditMode(true)}
                  startIcon={<Edit />}
                  variant="contained"
                  sx={{
                    backgroundColor: colors.primary.main,
                    '&:hover': { backgroundColor: colors.primary.hover }
                  }}
                >
                  Edit Personnel
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setEditMode(false)}
                    startIcon={<Cancel />}
                    variant="outlined"
                    sx={{
                      borderColor: colors.secondary.main,
                      color: colors.secondary.main,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    startIcon={<Save />}
                    variant="contained"
                    disabled={saving}
                    sx={{
                      backgroundColor: colors.primary.main,
                      '&:hover': { backgroundColor: colors.primary.hover }
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </Stack>
          </Box>

          {/* Personnel Overview Card */}
          <Paper
            sx={{
              background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
              color: colors.neutral.white,
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  border: `3px solid rgba(255,255,255,0.3)`,
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {getInitials(personnel.full_name)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {personnel.full_name}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Security Personnel - Badge: {personnel.badge_number}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Chip
                    label={personnel.is_active ? 'Active' : 'Inactive'}
                    color={personnel.is_active ? 'success' : 'warning'}
                    sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: colors.neutral.white }}
                  />
                  <Chip
                    label={`ID: ${personnel.employee_id}`}
                    sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: colors.neutral.white }}
                  />
                  <Chip
                    label={`Badge: ${personnel.badge_number}`}
                    sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: colors.neutral.white }}
                  />
                </Box>
              </Box>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={personnel.is_active}
                      onChange={handleToggleStatus}
                      disabled={saving}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: colors.neutral.white,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'rgba(255,255,255,0.5)',
                        },
                      }}
                    />
                  }
                  label={personnel.is_active ? 'Active' : 'Inactive'}
                  sx={{ color: colors.neutral.white }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Management Form - Using Flexbox */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Row 1: Personal and Employment Information */}
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              flexDirection: { xs: 'column', md: 'row' } 
            }}>
              {/* Personal Information */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                      Personal Information
                    </Typography>
                    <Stack spacing={3}>
                      <TextField
                        label="Full Name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: colors.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <TextField
                        label="Phone Number"
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone sx={{ color: colors.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Box>

              {/* Employment Information */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                      Employment Information
                    </Typography>
                    <Stack spacing={3}>
                      <TextField
                        label="Employee ID"
                        value={formData.employee_id}
                        onChange={(e) => handleInputChange('employee_id', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon sx={{ color: colors.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <TextField
                        label="Badge Number"
                        value={formData.badge_number}
                        onChange={(e) => handleInputChange('badge_number', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon sx={{ color: colors.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <TextField
                        label="Hire Date"
                        type="date"
                        value={formData.hire_date}
                        onChange={(e) => handleInputChange('hire_date', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday sx={{ color: colors.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <TextField
                        label="Termination Date"
                        type="date"
                        value={formData.termination_date || ''}
                        onChange={(e) => handleInputChange('termination_date', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        helperText="Leave empty if currently employed"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday sx={{ color: colors.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Row 2: System Information */}
            <Box>
              <Card sx={{ boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                    System Information
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 3, 
                    flexDirection: { xs: 'column', md: 'row' } 
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Created At
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {formatDate(personnel.created_at)}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {formatDate(personnel.updated_at)}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Typography variant="h6" fontWeight="medium" color={personnel.is_active ? 'success.main' : 'warning.main'}>
                        {personnel.is_active ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Row 3: Danger Zone */}
            <Box>
              <Card sx={{ boxShadow: 2, border: '1px solid #ffebee' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'error.main', mb: 2 }}>
                    Danger Zone
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    These actions cannot be undone. Please proceed with caution.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{ mr: 2 }}
                  >
                    Delete Personnel
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          Delete Security Personnel
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{personnel.full_name}</strong>? 
            This action cannot be undone and will permanently remove all associated data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={saving}
          >
            {saving ? 'Deleting...' : 'Delete'}
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

export default ManageSecurity;