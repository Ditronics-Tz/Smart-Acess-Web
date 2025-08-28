import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack,
  PersonAdd,
  Save,
  Cancel,
  Menu as MenuIcon,
  Person,
  Settings,
  ExitToApp,
  Notifications,
  Badge,
  Work,
  Phone,
  CalendarToday,
  Security,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import AdminSidebar from '../shared/AdminSidebar';
import AuthService from '../../../service/AuthService';
import SecurityPersonelService, { CreateSecurityPersonnelRequest } from '../../../service/SecurityPersonelService';

const AddSecurity: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState({ employeeId: false, badgeNumber: false });
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'warning' 
  });

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Form state
  const [formData, setFormData] = useState<CreateSecurityPersonnelRequest>({
    employee_id: '',
    badge_number: '',
    full_name: '',
    phone_number: '',
    hire_date: new Date().toISOString().split('T')[0], // Default to today
  });

  // Form validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [validation, setValidation] = useState({
    employeeIdValid: true,
    badgeNumberValid: true,
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

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (field: keyof CreateSecurityPersonnelRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Real-time validation for employee ID and badge number
    if (field === 'employee_id' && value.length >= 3) {
      validateEmployeeId(value);
    } else if (field === 'badge_number' && value.length >= 3) {
      validateBadgeNumber(value);
    }
  };

  const validateEmployeeId = async (employeeId: string) => {
    if (!employeeId.trim()) return;
    
    setValidating(prev => ({ ...prev, employeeId: true }));
    try {
      const isValid = await SecurityPersonelService.validateEmployeeId(employeeId);
      setValidation(prev => ({ ...prev, employeeIdValid: isValid }));
      
      if (!isValid) {
        setErrors(prev => ({ ...prev, employee_id: 'Employee ID already exists' }));
      }
    } catch (error) {
      console.error('Error validating employee ID:', error);
    } finally {
      setValidating(prev => ({ ...prev, employeeId: false }));
    }
  };

  const validateBadgeNumber = async (badgeNumber: string) => {
    if (!badgeNumber.trim()) return;
    
    setValidating(prev => ({ ...prev, badgeNumber: true }));
    try {
      const isValid = await SecurityPersonelService.validateBadgeNumber(badgeNumber);
      setValidation(prev => ({ ...prev, badgeNumberValid: isValid }));
      
      if (!isValid) {
        setErrors(prev => ({ ...prev, badge_number: 'Badge number already exists' }));
      }
    } catch (error) {
      console.error('Error validating badge number:', error);
    } finally {
      setValidating(prev => ({ ...prev, badgeNumber: false }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Required field validation
    if (!formData.employee_id.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    }
    if (!formData.badge_number.trim()) {
      newErrors.badge_number = 'Badge number is required';
    }
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    if (!formData.hire_date) {
      newErrors.hire_date = 'Hire date is required';
    }

    // Format validation
    if (formData.phone_number && !/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    // Check for validation errors
    if (!validation.employeeIdValid) {
      newErrors.employee_id = 'Employee ID already exists';
    }
    if (!validation.badgeNumberValid) {
      newErrors.badge_number = 'Badge number already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      showSnackbar('Please fix the errors before submitting', 'error');
      return;
    }

    setLoading(true);
    try {
      const newPersonnel = await SecurityPersonelService.createSecurityPersonnel(formData);
      showSnackbar('Security personnel added successfully!', 'success');
      
      // Navigate back to security list after a short delay
      setTimeout(() => {
        navigate('/admin-dashboard/security');
      }, 1500);
    } catch (error: any) {
      console.error('Error creating security personnel:', error);
      showSnackbar(error.message || 'Failed to add security personnel', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin-dashboard/security');
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return fullName.charAt(0);
  };

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
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                sx={{
                  color: colors.secondary.main,
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                <MenuIcon />
              </IconButton>

              {/* Back Button */}
              <IconButton
                onClick={handleCancel}
                sx={{
                  color: colors.secondary.main,
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                <ArrowBack />
              </IconButton>

              <Box
                sx={{
                  p: 1.5,
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <PersonAdd sx={{ color: colors.neutral.white, fontSize: 28 }} />
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
                  Add Security Personnel
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Register New Security Staff Member
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Notifications */}
              <IconButton
                sx={{
                  color: colors.secondary.main,
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                <Notifications />
              </IconButton>

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
                  {getInitials(username || '')}
                </Avatar>
                <Box sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1 }}>
                    {username}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1 }}>
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
                  Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Settings sx={{ mr: 2, color: colors.secondary.main }} />
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 2, color: "error.main" }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Form Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {/* Main Form */}
              <Box sx={{ flex: '1 1 600px', minWidth: '600px' }}>
                <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: colors.secondary.main }}>
                    Personnel Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Employee ID and Badge Number Row */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: '1 1 250px' }}>
                        <FormControl fullWidth>
                          <InputLabel htmlFor="employee-id">Employee ID *</InputLabel>
                          <OutlinedInput
                            id="employee-id"
                            value={formData.employee_id}
                            onChange={handleInputChange('employee_id')}
                            error={!!errors.employee_id}
                            startAdornment={
                              <InputAdornment position="start">
                                <Work sx={{ color: colors.primary.main }} />
                              </InputAdornment>
                            }
                            endAdornment={
                              validating.employeeId ? (
                                <InputAdornment position="end">
                                  <CircularProgress size={20} />
                                </InputAdornment>
                              ) : null
                            }
                            label="Employee ID *"
                          />
                          {errors.employee_id && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                              {errors.employee_id}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>

                      <Box sx={{ flex: '1 1 250px' }}>
                        <FormControl fullWidth>
                          <InputLabel htmlFor="badge-number">Badge Number *</InputLabel>
                          <OutlinedInput
                            id="badge-number"
                            value={formData.badge_number}
                            onChange={handleInputChange('badge_number')}
                            error={!!errors.badge_number}
                            startAdornment={
                              <InputAdornment position="start">
                                <Badge sx={{ color: colors.primary.main }} />
                              </InputAdornment>
                            }
                            endAdornment={
                              validating.badgeNumber ? (
                                <InputAdornment position="end">
                                  <CircularProgress size={20} />
                                </InputAdornment>
                              ) : null
                            }
                            label="Badge Number *"
                          />
                          {errors.badge_number && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                              {errors.badge_number}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>
                    </Box>

                    {/* Full Name */}
                    <Box>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="full-name">Full Name *</InputLabel>
                        <OutlinedInput
                          id="full-name"
                          value={formData.full_name}
                          onChange={handleInputChange('full_name')}
                          error={!!errors.full_name}
                          startAdornment={
                            <InputAdornment position="start">
                              <Person sx={{ color: colors.primary.main }} />
                            </InputAdornment>
                          }
                          label="Full Name *"
                        />
                        {errors.full_name && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                            {errors.full_name}
                          </Typography>
                        )}
                      </FormControl>
                    </Box>

                    {/* Phone Number and Hire Date Row */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: '1 1 250px' }}>
                        <FormControl fullWidth>
                          <InputLabel htmlFor="phone-number">Phone Number</InputLabel>
                          <OutlinedInput
                            id="phone-number"
                            value={formData.phone_number}
                            onChange={handleInputChange('phone_number')}
                            error={!!errors.phone_number}
                            startAdornment={
                              <InputAdornment position="start">
                                <Phone sx={{ color: colors.primary.main }} />
                              </InputAdornment>
                            }
                            label="Phone Number"
                            placeholder="+255 123 456 789"
                          />
                          {errors.phone_number && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                              {errors.phone_number}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>

                      <Box sx={{ flex: '1 1 250px' }}>
                        <FormControl fullWidth>
                          <InputLabel htmlFor="hire-date">Hire Date *</InputLabel>
                          <OutlinedInput
                            id="hire-date"
                            type="date"
                            value={formData.hire_date}
                            onChange={handleInputChange('hire_date')}
                            error={!!errors.hire_date}
                            startAdornment={
                              <InputAdornment position="start">
                                <CalendarToday sx={{ color: colors.primary.main }} />
                              </InputAdornment>
                            }
                            label="Hire Date *"
                          />
                          {errors.hire_date && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                              {errors.hire_date}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                      disabled={loading}
                      sx={{
                        backgroundColor: colors.primary.main,
                        "&:hover": { backgroundColor: colors.primary.hover },
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      {loading ? 'Adding...' : 'Add Personnel'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={loading}
                      sx={{
                        borderColor: colors.secondary.main,
                        color: colors.secondary.main,
                        "&:hover": { 
                          borderColor: colors.secondary.main,
                          backgroundColor: "rgba(0,0,0,0.04)"
                        },
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Paper>
              </Box>

              {/* Summary Card */}
              <Box sx={{ flex: '0 1 350px', minWidth: '300px' }}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, position: 'sticky', top: 20 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: colors.secondary.main }}>
                      Summary
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Security sx={{ color: colors.primary.main }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Personnel Type
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            Security Personnel
                          </Typography>
                        </Box>
                      </Box>

                      <Divider />

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Required Fields
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ 
                            color: formData.employee_id ? 'success.main' : 'text.secondary' 
                          }}>
                            ✓ Employee ID
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: formData.badge_number ? 'success.main' : 'text.secondary' 
                          }}>
                            ✓ Badge Number
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: formData.full_name ? 'success.main' : 'text.secondary' 
                          }}>
                            ✓ Full Name
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: formData.hire_date ? 'success.main' : 'text.secondary' 
                          }}>
                            ✓ Hire Date
                          </Typography>
                        </Box>
                      </Box>

                      <Divider />

                      <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                        Personnel will be automatically activated upon creation.
                      </Alert>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </form>
        </Container>
      </Box>

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

export default AddSecurity;