import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Cancel,
  DoorFront,
  Menu as MenuIcon,
  LocationOn,
  Computer,
  NetworkCheck,
  PowerSettingsNew,
  Emergency,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import AdminService, { CreateAccessGateRequest, PhysicalLocation } from '../../../service/AdminService';
import AdminSidebar from '../shared/AdminSidebar';

const AddGates: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [locations, setLocations] = useState<PhysicalLocation[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState<CreateAccessGateRequest>({
    gate_code: '',
    gate_name: '',
    location: '',
    gate_type: 'bidirectional',
    hardware_id: '',
    ip_address: '',
    mac_address: '',
    status: 'active',
    emergency_override_enabled: false,
    backup_power_available: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const locationsData = await AdminService.getAllPhysicalLocations();
      setLocations(locationsData);
    } catch (err: any) {
      showSnackbar('Failed to load locations', 'error');
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.gate_code.trim()) {
      newErrors.gate_code = 'Gate code is required';
    }

    if (!formData.gate_name.trim()) {
      newErrors.gate_name = 'Gate name is required';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    if (!formData.hardware_id.trim()) {
      newErrors.hardware_id = 'Hardware ID is required';
    }

    // Validate IP address format if provided
    if (formData.ip_address && formData.ip_address.trim()) {
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(formData.ip_address.trim())) {
        newErrors.ip_address = 'Please enter a valid IP address';
      }
    }

    // Validate MAC address format if provided
    if (formData.mac_address && formData.mac_address.trim()) {
      const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
      if (!macRegex.test(formData.mac_address.trim())) {
        newErrors.mac_address = 'Please enter a valid MAC address (XX:XX:XX:XX:XX:XX)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateAccessGateRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
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
  };

  const handleSwitchChange = (field: keyof CreateAccessGateRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Clean up empty optional fields
      const submitData: CreateAccessGateRequest = {
        ...formData,
        ip_address: formData.ip_address?.trim() || undefined,
        mac_address: formData.mac_address?.trim() || undefined
      };

      const newGate = await AdminService.createAccessGate(submitData);
      showSnackbar('Gate created successfully', 'success');
      
      // Navigate to the new gate's details view
      setTimeout(() => {
        navigate(`/admin-dashboard/gates/view/${newGate.gate_id}`);
      }, 1500);
    } catch (err: any) {
      showSnackbar(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin-dashboard/gates');
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
      case "locations":
        navigate('/admin-dashboard/locations');
        break;
      case "access-gates":
        navigate('/admin-dashboard/gates');
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

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        currentView="access-gates"
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
                onClick={() => navigate('/admin-dashboard/gates')}
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
                <DoorFront sx={{ color: colors.neutral.white, fontSize: 28 }} />
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
                  Add New Gate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create new access gate
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
              {/* Main Form */}
              <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 65%" } }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      Create New Access Gate
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      Configure a new gate for your access control system
                    </Typography>
                  </Paper>

                  {/* Basic Information */}
                  <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DoorFront /> Basic Information
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}>
                        <TextField
                          fullWidth
                          label="Gate Code"
                          value={formData.gate_code}
                          onChange={handleInputChange('gate_code')}
                          error={!!errors.gate_code}
                          helperText={errors.gate_code || 'Unique identifier for the gate'}
                          required
                          placeholder="GATE001"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: colors.primary.main,
                              },
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}>
                        <TextField
                          fullWidth
                          label="Gate Name"
                          value={formData.gate_name}
                          onChange={handleInputChange('gate_name')}
                          error={!!errors.gate_name}
                          helperText={errors.gate_name || 'Descriptive name for the gate'}
                          required
                          placeholder="Main Entrance Gate"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: colors.primary.main,
                              },
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}>
                        <FormControl fullWidth error={!!errors.location}>
                          <InputLabel>Location *</InputLabel>
                          <Select
                            value={formData.location}
                            label="Location *"
                            onChange={handleInputChange('location')}
                            sx={{
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: colors.primary.main,
                              },
                            }}
                          >
                            {locations.map((location) => (
                              <MenuItem key={location.location_id} value={location.location_id}>
                                {location.location_name} ({location.location_type})
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.location && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                              {errors.location}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>
                      <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}>
                        <FormControl fullWidth>
                          <InputLabel>Gate Type</InputLabel>
                          <Select
                            value={formData.gate_type}
                            label="Gate Type"
                            onChange={handleInputChange('gate_type')}
                            sx={{
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: colors.primary.main,
                              },
                            }}
                          >
                            <MenuItem value="entry">Entry Only</MenuItem>
                            <MenuItem value="exit">Exit Only</MenuItem>
                            <MenuItem value="bidirectional">Bidirectional</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Hardware Configuration */}
                  <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Computer /> Hardware Configuration
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      <Box sx={{ flex: "1 1 100%", minWidth: "250px" }}>
                        <TextField
                          fullWidth
                          label="Hardware ID"
                          value={formData.hardware_id}
                          onChange={handleInputChange('hardware_id')}
                          error={!!errors.hardware_id}
                          helperText={errors.hardware_id || 'Unique hardware identifier'}
                          required
                          placeholder="HW001"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: colors.primary.main,
                              },
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}>
                        <FormControl fullWidth>
                          <InputLabel>Initial Status</InputLabel>
                          <Select
                            value={formData.status}
                            label="Initial Status"
                            onChange={handleInputChange('status')}
                            sx={{
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: colors.primary.main,
                              },
                            }}
                          >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                            <MenuItem value="maintenance">Maintenance</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Network Configuration */}
                  <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NetworkCheck /> Network Configuration (Optional)
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}>
                        <TextField
                          fullWidth
                          label="IP Address"
                          value={formData.ip_address}
                          onChange={handleInputChange('ip_address')}
                          error={!!errors.ip_address}
                          helperText={errors.ip_address || 'Optional - Format: 192.168.1.100'}
                          placeholder="192.168.1.100"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: colors.primary.main,
                              },
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}>
                        <TextField
                          fullWidth
                          label="MAC Address"
                          value={formData.mac_address}
                          onChange={handleInputChange('mac_address')}
                          error={!!errors.mac_address}
                          helperText={errors.mac_address || 'Optional - Format: XX:XX:XX:XX:XX:XX'}
                          placeholder="00:11:22:33:44:55"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: colors.primary.main,
                              },
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Paper>

                  {/* Features */}
                  <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                      Features & Capabilities
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.emergency_override_enabled}
                            onChange={handleSwitchChange('emergency_override_enabled')}
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Emergency sx={{ color: colors.primary.main }} />
                            <Box>
                              <Typography>Emergency Override Enabled</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Allow emergency override of access control
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.backup_power_available}
                            onChange={handleSwitchChange('backup_power_available')}
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PowerSettingsNew sx={{ color: colors.primary.main }} />
                            <Box>
                              <Typography>Backup Power Available</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Gate has backup power supply
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Box>
                  </Paper>
                </Box>
              </Box>

              {/* Sidebar */}
              <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 35%" } }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Action Buttons */}
                  <Card sx={{ boxShadow: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                        Actions
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                          sx={{
                            backgroundColor: colors.primary.main,
                            "&:hover": { backgroundColor: colors.primary.hover },
                            "&:disabled": { backgroundColor: 'grey.300' },
                          }}
                        >
                          {loading ? 'Creating...' : 'Create Gate'}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={handleCancel}
                          startIcon={<Cancel />}
                          sx={{
                            borderColor: 'grey.400',
                            color: 'grey.600',
                            "&:hover": {
                              borderColor: 'grey.600',
                              backgroundColor: 'grey.50',
                            },
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Help */}
                  <Card sx={{ boxShadow: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                        Gate Types
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="body2" fontWeight="500" color={colors.primary.main}>
                            Entry Only
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Allows access only in the entry direction
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight="500" color={colors.primary.main}>
                            Exit Only
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Allows access only in the exit direction
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight="500" color={colors.primary.main}>
                            Bidirectional
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Allows access in both entry and exit directions
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Requirements */}
                  <Card sx={{ boxShadow: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                        Requirements
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          • Gate Code must be unique
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Hardware ID must be unique
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Location must be selected
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Network settings are optional
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          </form>
        </Container>
      </Box>

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

export default AddGates;