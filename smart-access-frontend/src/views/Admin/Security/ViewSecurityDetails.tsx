import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Card,
  CardContent,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Menu as MenuIcon,
  Person,
  Settings,
  ExitToApp,
  Notifications,
  Security,
  Edit,
  Badge,
  Work,
  Phone,
  CalendarToday,
  Schedule,
  CheckCircle,
  Cancel,
  Info,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import AdminSidebar from '../shared/AdminSidebar';
import AuthService from '../../../service/AuthService';
import SecurityPersonelService, { SecurityPersonnel } from '../../../service/SecurityPersonelService';

const ViewSecurityDetails: React.FC = () => {
  const navigate = useNavigate();
  const { securityId } = useParams<{ securityId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personnel, setPersonnel] = useState<SecurityPersonnel | null>(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleManagePersonnel = () => {
    navigate(`/admin-dashboard/security/manage/${securityId}`);
  };

  const handleBackToSecurity = () => {
    navigate('/admin-dashboard/security');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return fullName.charAt(0);
  };

  const getStatusColor = (isActive: boolean, isTerminated: boolean) => {
    if (isTerminated) return 'error';
    return isActive ? 'success' : 'warning';
  };

  const getStatusLabel = (isActive: boolean, isTerminated: boolean) => {
    if (isTerminated) return 'Terminated';
    return isActive ? 'Active' : 'Inactive';
  };

const isTerminated = Boolean(personnel?.termination_date && personnel.termination_date !== null);
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
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Personnel not found'}
          </Alert>
          <Button 
            onClick={handleBackToSecurity}
            startIcon={<ArrowBack />}
            variant="contained"
            sx={{
              backgroundColor: colors.primary.main,
              '&:hover': { backgroundColor: colors.primary.hover }
            }}
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
                onClick={handleBackToSecurity}
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
                  Security Personnel Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {personnel.full_name} - {personnel.employee_id}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Manage Button */}
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleManagePersonnel}
                sx={{
                  backgroundColor: colors.primary.main,
                  "&:hover": { backgroundColor: colors.primary.hover },
                  px: 3,
                  py: 1,
                }}
              >
                Manage
              </Button>

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

        {/* Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Personnel Overview Card */}
          <Paper
            sx={{
              background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
              color: colors.neutral.white,
              p: 4,
              borderRadius: 3,
              boxShadow: 3,
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  border: `4px solid rgba(255,255,255,0.3)`,
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                }}
              >
                {getInitials(personnel.full_name)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {personnel.full_name}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Security Personnel - Badge: {personnel.badge_number}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={getStatusColor(personnel.is_active, isTerminated) === 'success' ? <CheckCircle /> : <Cancel />}
                    label={getStatusLabel(personnel.is_active, isTerminated)}
                    color={getStatusColor(personnel.is_active, isTerminated)}
                    sx={{ 
                      backgroundColor: "rgba(255,255,255,0.2)", 
                      color: colors.neutral.white,
                      '& .MuiChip-icon': { color: colors.neutral.white }
                    }}
                  />
                  <Chip
                    icon={<Work />}
                    label={`ID: ${personnel.employee_id}`}
                    sx={{ 
                      backgroundColor: "rgba(255,255,255,0.2)", 
                      color: colors.neutral.white,
                      '& .MuiChip-icon': { color: colors.neutral.white }
                    }}
                  />
                  <Chip
                    icon={<Badge />}
                    label={`Badge: ${personnel.badge_number}`}
                    sx={{ 
                      backgroundColor: "rgba(255,255,255,0.2)", 
                      color: colors.neutral.white,
                      '& .MuiChip-icon': { color: colors.neutral.white }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Details Cards using Flexbox */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Row 1: Personal and Employment Information */}
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              flexDirection: { xs: 'column', md: 'row' } 
            }}>
              {/* Personal Information */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ height: '100%', boxShadow: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                      Personal Information
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Person sx={{ color: colors.primary.main }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Full Name
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {personnel.full_name}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Phone sx={{ color: colors.primary.main }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Phone Number
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {personnel.phone_number || 'Not provided'}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Work sx={{ color: colors.primary.main }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Employee ID
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {personnel.employee_id}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Badge sx={{ color: colors.primary.main }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Badge Number
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {personnel.badge_number}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Employment Information */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ height: '100%', boxShadow: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                      Employment Information
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CalendarToday sx={{ color: colors.primary.main }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Hire Date
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {formatDate(personnel.hire_date)}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Schedule sx={{ color: colors.primary.main }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Status
                          </Typography>
                          <Chip
                            label={getStatusLabel(personnel.is_active, isTerminated)}
                            color={getStatusColor(personnel.is_active, isTerminated)}
                            size="small"
                          />
                        </Box>
                      </Box>

                      {isTerminated && (
                        <>
                          <Divider />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Cancel sx={{ color: 'error.main' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Termination Date
                              </Typography>
                              <Typography variant="body1" fontWeight="600" color="error.main">
                                {formatDate(personnel.termination_date!)}
                              </Typography>
                            </Box>
                          </Box>
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Row 2: System Information */}
            <Box>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                    System Information
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 4, 
                    flexDirection: { xs: 'column', sm: 'row' },
                    flexWrap: 'wrap' 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Info sx={{ color: colors.primary.main }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Security ID
                        </Typography>
                        <Typography variant="body1" fontWeight="600" sx={{ fontFamily: 'monospace' }}>
                          {personnel.security_id}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CalendarToday sx={{ color: colors.primary.main }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Created At
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {formatDateTime(personnel.created_at)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Schedule sx={{ color: colors.primary.main }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Last Updated
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {formatDateTime(personnel.updated_at)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
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

export default ViewSecurityDetails;