import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Avatar,
  Divider,
  Stack,
  AppBar,
  Toolbar,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
  Edit,
  Delete,
  Menu as MenuIcon,
  Domain,
  Business,
  Room,
  Security,
  CalendarToday,
  Description,
  Lock,
  LockOpen,
  Router,
  Info,
  Visibility,
  Settings,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import AdminService, { PhysicalLocation, AccessGate } from '../../../service/AdminService';
import AdminSidebar from '../shared/AdminSidebar';

const ViewLocationDetails: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<PhysicalLocation | null>(null);
  const [gates, setGates] = useState<AccessGate[]>([]);
  const [loading, setLoading] = useState(true);
  const [gatesLoading, setGatesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (locationId) {
      fetchLocationDetails();
      fetchLocationGates();
    }
  }, [locationId]);

  const fetchLocationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const locationData = await AdminService.getPhysicalLocation(locationId!);
      setLocation(locationData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationGates = async () => {
    try {
      setGatesLoading(true);
      const gatesResponse = await AdminService.getAccessGatesByLocation(locationId!);
      setGates(gatesResponse.results);
    } catch (err: any) {
      console.error('Failed to fetch gates:', err);
    } finally {
      setGatesLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin-dashboard/locations/manage/${locationId}`);
  };

  const handleDelete = async () => {
    if (!location) return;
    
    if (window.confirm(`Are you sure you want to delete "${location.location_name}"? This action can be undone.`)) {
      try {
        await AdminService.deletePhysicalLocation(locationId!);
        showSnackbar(`Location "${location.location_name}" deleted successfully`, 'success');
        
        setTimeout(() => {
          navigate('/admin-dashboard/locations');
        }, 1500);
      } catch (err: any) {
        showSnackbar(err.message, 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'campus': return <Domain sx={{ fontSize: 24, color: colors.primary.main }} />;
      case 'building': return <Business sx={{ fontSize: 24, color: colors.secondary.main }} />;
      case 'floor': return <LocationOn sx={{ fontSize: 24, color: colors.primary.main }} />;
      case 'room': return <Room sx={{ fontSize: 24, color: colors.secondary.main }} />;
      case 'gate': return <Security sx={{ fontSize: 24, color: colors.primary.main }} />;
      case 'area': return <LocationOn sx={{ fontSize: 24, color: colors.secondary.main }} />;
      default: return <LocationOn sx={{ fontSize: 24, color: 'text.secondary' }} />;
    }
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case 'campus': return 'primary';
      case 'building': return 'secondary';
      case 'floor': return 'info';
      case 'room': return 'success';
      case 'gate': return 'warning';
      case 'area': return 'default';
      default: return 'default';
    }
  };

  const getGateStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'maintenance': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (error || !location) {
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
                onClick={() => navigate('/admin-dashboard/locations')}
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
                {getLocationTypeIcon(location.location_type)}
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
                  {location.location_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location Details
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleEdit}
                sx={{
                  borderColor: colors.primary.main,
                  color: colors.primary.main,
                  "&:hover": {
                    borderColor: colors.primary.hover,
                    backgroundColor: "rgba(248, 112, 96, 0.04)",
                  },
                }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                startIcon={<Delete />}
                onClick={handleDelete}
                sx={{
                  borderColor: 'error.main',
                  color: 'error.main',
                  "&:hover": {
                    borderColor: 'error.dark',
                    backgroundColor: "rgba(244, 67, 54, 0.04)",
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
            {/* Location Information */}
            <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 65%" } }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        border: `3px solid rgba(255,255,255,0.3)`,
                      }}
                    >
                      {getLocationTypeIcon(location.location_type)}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {location.location_name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={location.location_type.toUpperCase()}
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: colors.neutral.white,
                            fontWeight: 'bold',
                          }}
                        />
                        <Chip
                          icon={location.is_restricted ? <Lock /> : <LockOpen />}
                          label={location.is_restricted ? 'RESTRICTED' : 'UNRESTRICTED'}
                          sx={{
                            backgroundColor: location.is_restricted ? 'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                            color: colors.neutral.white,
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Details Section */}
                <Box sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    {/* Basic Information */}
                    <Card sx={{ borderRadius: 2, border: `1px solid #e0e0e0` }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                          Basic Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                          <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "200px" }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Info sx={{ fontSize: 18, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                Location ID
                              </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="500">
                              {location.location_id}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "200px" }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              {getLocationTypeIcon(location.location_type)}
                              <Typography variant="body2" color="text.secondary">
                                Type
                              </Typography>
                            </Box>
                            <Chip
                              label={location.location_type.toUpperCase()}
                              color={getLocationTypeColor(location.location_type) as any}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Description */}
                    <Card sx={{ borderRadius: 2, border: `1px solid #e0e0e0` }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                          Description
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <Description sx={{ fontSize: 18, color: 'text.secondary', mt: 0.5 }} />
                          <Typography variant="body1">
                            {location.description || 'No description provided'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Access Control */}
                    <Card sx={{ borderRadius: 2, border: `1px solid #e0e0e0` }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                          Access Control
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {location.is_restricted ? <Lock sx={{ color: 'error.main' }} /> : <LockOpen sx={{ color: 'success.main' }} />}
                          <Box>
                            <Typography variant="body1" fontWeight="500">
                              {location.is_restricted ? 'Restricted Access' : 'Unrestricted Access'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {location.is_restricted 
                                ? 'Special permissions required to access this location'
                                : 'This location is publicly accessible'
                              }
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Stack>
                </Box>
              </Paper>
            </Box>

            {/* Sidebar Information */}
            <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 35%" } }}>
              <Stack spacing={3}>
                {/* Timestamps */}
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                      Timestamps
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Stack spacing={2}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Created
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {formatDate(location.created_at)}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Last Updated
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {formatDate(location.updated_at)}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Associated Gates */}
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" color={colors.secondary.main}>
                        Access Gates ({gates.length})
                      </Typography>
                      <Router sx={{ color: colors.primary.main }} />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    {gatesLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : gates.length > 0 ? (
                      <Stack spacing={1}>
                        {gates.slice(0, 3).map((gate) => (
                          <Box
                            key={gate.gate_id}
                            sx={{
                              p: 2,
                              borderRadius: 1,
                              border: '1px solid #e0e0e0',
                              backgroundColor: '#f8f9fa',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box>
                                <Typography variant="body2" fontWeight="500">
                                  {gate.gate_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {gate.gate_code}
                                </Typography>
                              </Box>
                              <Chip
                                label={gate.status.toUpperCase()}
                                color={getGateStatusColor(gate.status) as any}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        ))}
                        {gates.length > 3 && (
                          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', pt: 1 }}>
                            +{gates.length - 3} more gates
                          </Typography>
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                        No access gates configured
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Box>
          </Box>
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

export default ViewLocationDetails;
