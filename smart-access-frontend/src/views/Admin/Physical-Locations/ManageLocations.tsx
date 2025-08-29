import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  IconButton,
  AppBar,
  Toolbar,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
  Save,
  Cancel,
  Menu as MenuIcon,
  Domain,
  Business,
  Room,
  Security,
  Update,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import AdminService, { PhysicalLocation, CreatePhysicalLocationRequest } from '../../../service/AdminService';
import AdminSidebar from '../shared/AdminSidebar';

const ManageLocations: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [originalLocation, setOriginalLocation] = useState<PhysicalLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState<CreatePhysicalLocationRequest>({
    location_name: '',
    location_type: 'room',
    description: '',
    is_restricted: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (locationId) {
      fetchLocationData();
    }
  }, [locationId]);

  const fetchLocationData = async () => {
    try {
      setLoading(true);
      setError(null);
      const locationData = await AdminService.getPhysicalLocation(locationId!);
      setOriginalLocation(locationData);
      
      // Populate form with existing data
      setFormData({
        location_name: locationData.location_name,
        location_type: locationData.location_type,
        description: locationData.description || '',
        is_restricted: locationData.is_restricted
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.location_name.trim()) {
      newErrors.location_name = 'Location name is required';
    } else if (formData.location_name.trim().length < 2) {
      newErrors.location_name = 'Location name must be at least 2 characters';
    }

    if (!formData.location_type) {
      newErrors.location_type = 'Location type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreatePhysicalLocationRequest, value: any) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const updatedLocation = await AdminService.updatePhysicalLocation(locationId!, formData);
      showSnackbar(`Location "${updatedLocation.location_name}" updated successfully!`, 'success');
      
      // Wait a moment to show success message then navigate
      setTimeout(() => {
        navigate(`/admin-dashboard/locations/view/${locationId}`);
      }, 1500);
    } catch (error: any) {
      showSnackbar(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin-dashboard/locations/view/${locationId}`);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'campus': return <Domain sx={{ fontSize: 20, color: colors.primary.main }} />;
      case 'building': return <Business sx={{ fontSize: 20, color: colors.secondary.main }} />;
      case 'floor': return <LocationOn sx={{ fontSize: 20, color: colors.primary.main }} />;
      case 'room': return <Room sx={{ fontSize: 20, color: colors.secondary.main }} />;
      case 'gate': return <Security sx={{ fontSize: 20, color: colors.primary.main }} />;
      case 'area': return <LocationOn sx={{ fontSize: 20, color: colors.secondary.main }} />;
      default: return <LocationOn sx={{ fontSize: 20, color: 'text.secondary' }} />;
    }
  };

  const hasChanges = () => {
    if (!originalLocation) return false;
    
    return (
      formData.location_name !== originalLocation.location_name ||
      formData.location_type !== originalLocation.location_type ||
      formData.description !== (originalLocation.description || '') ||
      formData.is_restricted !== originalLocation.is_restricted
    );
  };

  // Sidebar navigation handler
  const handleSidebarNavigation = (view: string) => {
    switch (view) {
      case "dashboard":
        navigate('/admin-dashboard');
        break;
      case "users":
        navigate('/admin-dashboard/users');
        break;
      case "locations":
        navigate('/admin-dashboard/locations');
        break;
      case "access-control":
        navigate('/admin-dashboard/access-control');
        break;
      case "reports":
        navigate('/admin-dashboard/reports');
        break;
      case "settings":
        navigate('/admin-dashboard/settings');
        break;
      default:
        navigate('/admin-dashboard');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <AdminSidebar
          collapsed={sidebarCollapsed}
          currentView="locations"
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

  if (error || !originalLocation) {
    return (
      <Box sx={{ display: "flex" }}>
        <AdminSidebar
          collapsed={sidebarCollapsed}
          currentView="locations"
          onNavigate={handleSidebarNavigation}
        />
        <Box sx={{ 
          flex: 1, 
          ml: sidebarCollapsed ? "64px" : "280px",
          p: 4,
          minHeight: "100vh",
          backgroundColor: "#f5f5f5"
        }}>
          <Alert severity="error">{error || 'Location not found'}</Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        currentView="locations"
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
                onClick={() => navigate(`/admin-dashboard/locations/view/${locationId}`)}
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
                <Update sx={{ color: colors.neutral.white, fontSize: 28 }} />
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
                  Edit Location
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {originalLocation.location_name}
                </Typography>
              </Box>
            </Box>

            {/* Save Indicator */}
            {hasChanges() && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: colors.primary.main,
                  }}
                />
                <Typography variant="caption" color={colors.primary.main} fontWeight="500">
                  Unsaved Changes
                </Typography>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              overflow: 'hidden',
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                color: colors.neutral.white,
                p: 4,
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Edit Physical Location
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Update location information in your Smart Access Control System
              </Typography>
            </Box>

            {/* Form Section */}
            <Box sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  {/* Location Name */}
                  <TextField
                    fullWidth
                    label="Location Name"
                    placeholder="Enter location name (e.g., Main Campus, Building A, Room 101)"
                    value={formData.location_name}
                    onChange={(e) => handleInputChange('location_name', e.target.value)}
                    error={!!errors.location_name}
                    helperText={errors.location_name}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: colors.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary.main,
                        },
                      },
                    }}
                  />

                  {/* Location Type */}
                  <FormControl fullWidth error={!!errors.location_type}>
                    <InputLabel>Location Type</InputLabel>
                    <Select
                      value={formData.location_type}
                      label="Location Type"
                      onChange={(e) => handleInputChange('location_type', e.target.value)}
                      sx={{
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: colors.primary.main,
                        },
                      }}
                    >
                      <MenuItem value="campus">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Domain sx={{ fontSize: 18, color: colors.primary.main }} />
                          Campus
                        </Box>
                      </MenuItem>
                      <MenuItem value="building">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business sx={{ fontSize: 18, color: colors.secondary.main }} />
                          Building
                        </Box>
                      </MenuItem>
                      <MenuItem value="floor">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn sx={{ fontSize: 18, color: colors.primary.main }} />
                          Floor
                        </Box>
                      </MenuItem>
                      <MenuItem value="room">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Room sx={{ fontSize: 18, color: colors.secondary.main }} />
                          Room
                        </Box>
                      </MenuItem>
                      <MenuItem value="gate">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Security sx={{ fontSize: 18, color: colors.primary.main }} />
                          Gate
                        </Box>
                      </MenuItem>
                      <MenuItem value="area">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn sx={{ fontSize: 18, color: colors.secondary.main }} />
                          Area
                        </Box>
                      </MenuItem>
                    </Select>
                    {errors.location_type && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                        {errors.location_type}
                      </Typography>
                    )}
                  </FormControl>

                  {/* Description */}
                  <TextField
                    fullWidth
                    label="Description (Optional)"
                    placeholder="Enter location description"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: colors.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary.main,
                        },
                      },
                    }}
                  />

                  {/* Access Control */}
                  <Card sx={{ borderRadius: 2, border: `1px solid #e0e0e0` }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                        Access Control
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.is_restricted}
                            onChange={(e) => handleInputChange('is_restricted', e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: colors.primary.main,
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: colors.primary.main,
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1" fontWeight="500">
                              Restricted Access
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formData.is_restricted 
                                ? "This location requires special permissions to access"
                                : "This location is publicly accessible"
                              }
                            </Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>

                  {/* Changes Summary */}
                  {hasChanges() && (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight="500" gutterBottom>
                        Changes detected:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2 }}>
                        {formData.location_name !== originalLocation.location_name && (
                          <li>Name: "{originalLocation.location_name}" → "{formData.location_name}"</li>
                        )}
                        {formData.location_type !== originalLocation.location_type && (
                          <li>Type: {originalLocation.location_type} → {formData.location_type}</li>
                        )}
                        {formData.description !== (originalLocation.description || '') && (
                          <li>Description updated</li>
                        )}
                        {formData.is_restricted !== originalLocation.is_restricted && (
                          <li>Access: {originalLocation.is_restricted ? 'Restricted' : 'Unrestricted'} → {formData.is_restricted ? 'Restricted' : 'Unrestricted'}</li>
                        )}
                      </Box>
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={saving}
                      startIcon={<Cancel />}
                      sx={{
                        borderColor: colors.secondary.main,
                        color: colors.secondary.main,
                        '&:hover': {
                          borderColor: colors.secondary.main,
                          backgroundColor: 'rgba(16, 37, 66, 0.04)',
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving || !hasChanges()}
                      startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                      sx={{
                        backgroundColor: colors.primary.main,
                        '&:hover': { backgroundColor: colors.primary.hover },
                        px: 4,
                      }}
                    >
                      {saving ? 'Updating...' : 'Update Location'}
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Box>
          </Paper>
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

export default ManageLocations;
