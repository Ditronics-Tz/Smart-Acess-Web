import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  DoorFront,
  Menu as MenuIcon,
  Computer,
  LocationOn,
  Router,
  PowerSettingsNew,
  Emergency,
  CalendarToday,
  Update,
  Info,
  NetworkCheck,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import AdminService, { AccessGate } from '../../../service/AdminService';
import AdminSidebar from '../shared/AdminSidebar';

const ViewGatesDetails: React.FC = () => {
  const { gateId } = useParams<{ gateId: string }>();
  const navigate = useNavigate();
  const [gate, setGate] = useState<AccessGate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (gateId) {
      fetchGateDetails();
    }
  }, [gateId]);

  const fetchGateDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const gateData = await AdminService.getAccessGate(gateId!);
      setGate(gateData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin-dashboard/gates/edit/${gateId}`);
  };

  const handleDelete = async () => {
    if (!gate) return;
    
    if (window.confirm(`Are you sure you want to delete "${gate.gate_name}"? This action can be undone.`)) {
      try {
        await AdminService.deleteAccessGate(gate.gate_id);
        showSnackbar(`Gate "${gate.gate_name}" deleted successfully`, 'success');
        navigate('/admin-dashboard/gates');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGateTypeIcon = (type: string) => {
    switch (type) {
      case 'entry': return <DoorFront sx={{ fontSize: 24, color: colors.primary.main }} />;
      case 'exit': return <DoorFront sx={{ fontSize: 24, color: colors.secondary.main, transform: 'scaleX(-1)' }} />;
      case 'bidirectional': return <Router sx={{ fontSize: 24, color: colors.primary.main }} />;
      default: return <DoorFront sx={{ fontSize: 24, color: 'text.secondary' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'maintenance': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getGateTypeColor = (type: string) => {
    switch (type) {
      case 'entry': return 'success';
      case 'exit': return 'warning';
      case 'bidirectional': return 'primary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: colors.primary.main }} />
      </Box>
    );
  }

  if (error || !gate) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error || 'Gate not found'}</Alert>
      </Box>
    );
  }

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
                  {gate.gate_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gate Details & Configuration
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
                Edit Gate
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
            {/* Main Gate Information */}
            <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 65%" } }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Gate Overview */}
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
                        {gate.gate_name}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        {gate.gate_code} • {gate.location_name}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        border: `3px solid rgba(255,255,255,0.3)`,
                        backgroundColor: "rgba(255,255,255,0.2)",
                      }}
                    >
                      {getGateTypeIcon(gate.gate_type)}
                    </Avatar>
                  </Box>
                </Paper>

                {/* Basic Information */}
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Info /> Basic Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "200px" }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        Gate Code
                      </Typography>
                      <Typography variant="body1" fontWeight="600" color={colors.secondary.main}>
                        {gate.gate_code}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "200px" }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        Hardware ID
                      </Typography>
                      <Typography variant="body1" fontWeight="600" color={colors.secondary.main}>
                        {gate.hardware_id}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "200px" }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        Gate Type
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        {getGateTypeIcon(gate.gate_type)}
                        <Chip
                          label={gate.gate_type.toUpperCase()}
                          color={getGateTypeColor(gate.gate_type) as any}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "200px" }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        Location
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: colors.primary.main }} />
                        <Typography variant="body1" fontWeight="600" color={colors.secondary.main}>
                          {gate.location_name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                {/* Network Configuration */}
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NetworkCheck /> Network Configuration
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "200px" }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        IP Address
                      </Typography>
                      <Typography variant="body1" fontWeight="600" color={colors.secondary.main}>
                        {gate.ip_address || 'Not configured'}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "200px" }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        MAC Address
                      </Typography>
                      <Typography variant="body1" fontWeight="600" color={colors.secondary.main}>
                        {gate.mac_address || 'Not configured'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Box>

            {/* Sidebar Information */}
            <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 35%" } }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Status Card */}
                <Card sx={{ boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                      Current Status
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Chip
                        label={gate.status.toUpperCase()}
                        color={getStatusColor(gate.status) as any}
                        size="medium"
                        variant="filled"
                        sx={{ fontWeight: 600, alignSelf: 'flex-start' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Last updated: {formatDate(gate.updated_at)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Features Card */}
                <Card sx={{ boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                      Features & Capabilities
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Emergency sx={{ fontSize: 20, color: gate.emergency_override_enabled ? 'success.main' : 'text.disabled' }} />
                          <Typography variant="body2">Emergency Override</Typography>
                        </Box>
                        <Chip
                          label={gate.emergency_override_enabled ? 'Enabled' : 'Disabled'}
                          color={gate.emergency_override_enabled ? 'success' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PowerSettingsNew sx={{ fontSize: 20, color: gate.backup_power_available ? 'success.main' : 'text.disabled' }} />
                          <Typography variant="body2">Backup Power</Typography>
                        </Box>
                        <Chip
                          label={gate.backup_power_available ? 'Available' : 'Not Available'}
                          color={gate.backup_power_available ? 'success' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Timeline Card */}
                <Card sx={{ boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                      Timeline
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 16, color: 'success.main' }} />
                        <Box>
                          <Typography variant="body2" fontWeight="500">Created</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(gate.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                      {gate.updated_at !== gate.created_at && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Update sx={{ fontSize: 16, color: 'info.main' }} />
                          <Box>
                            <Typography variant="body2" fontWeight="500">Last Updated</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(gate.updated_at)}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
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

export default ViewGatesDetails;