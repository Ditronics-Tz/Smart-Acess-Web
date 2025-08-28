import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Badge,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Security,
  Schedule,
  Construction,
  ArrowBack,
  Lock,
  VpnKey,
  Shield,
  Menu as MenuIcon,
  Notifications,
  Person,
  Settings,
  ExitToApp,
  Search,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../../styles/themes/colors';
import AdminSidebar from '../shared/AdminSidebar';
import AuthService from '../../../service/AuthService';

const AccessControl: React.FC = () => {
  const navigate = useNavigate();
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

  const upcomingFeatures = [
    {
      icon: <Lock sx={{ fontSize: 40, color: colors.primary.main }} />,
      title: "Permission Management",
      description: "Granular control over user access permissions and roles",
      status: "In Development"
    },
    {
      icon: <VpnKey sx={{ fontSize: 40, color: colors.secondary.main }} />,
      title: "Access Key Generation",
      description: "Generate and manage digital access keys for different areas",
      status: "Coming Soon"
    },
    {
      icon: <Shield sx={{ fontSize: 40, color: colors.primary.main }} />,
      title: "Security Policies",
      description: "Configure automated security policies and restrictions",
      status: "Planned"
    },
    {
      icon: <Schedule sx={{ fontSize: 40, color: colors.secondary.main }} />,
      title: "Time-based Access",
      description: "Set up time-based access controls and schedules",
      status: "Planned"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Development':
        return 'warning';
      case 'Coming Soon':
        return 'info';
      case 'Planned':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        currentView="access-control"
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
                  Access Control System
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Permission Management & Security Policies
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Search */}
              <TextField
                size="small"
                placeholder="Search..."
                sx={{
                  display: { xs: "none", sm: "block" },
                  width: 250,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Notifications */}
              <IconButton
                sx={{
                  color: colors.secondary.main,
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
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
          {/* Reduced Banner Section */}
          <Paper
            sx={{
              background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
              color: colors.neutral.white,
              p: 2.5,
              borderRadius: 2,
              boxShadow: 2,
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  border: `2px solid rgba(255,255,255,0.3)`,
                }}
              >
                <Security sx={{ fontSize: 28, color: colors.neutral.white }} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 0.5 }}>
                  Access Control System
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Advanced access permission management and security control center
                </Typography>
                <Chip
                  icon={<Construction sx={{ fontSize: 16 }} />}
                  label="Under Development"
                  size="small"
                  sx={{
                    mt: 1,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: colors.neutral.white,
                    fontWeight: "bold",
                    height: 24,
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Coming Soon Message */}
          <Card sx={{ mb: 4, boxShadow: 2 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Construction 
                sx={{ 
                  fontSize: 80, 
                  color: colors.primary.main, 
                  mb: 2,
                  opacity: 0.8 
                }} 
              />
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: colors.secondary.main }}>
                Coming Soon!
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                We're working hard to bring you a comprehensive access control management system. 
                This feature will allow you to manage permissions, access keys, and security policies.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Expected release: <strong>Q2 2025</strong>
              </Typography>
            </CardContent>
          </Card>

          {/* Upcoming Features */}
          <Typography variant="h4" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
            Planned Features
          </Typography>
          
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {upcomingFeatures.map((feature, index) => (
              <Box 
                key={index} 
                sx={{ 
                  flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } 
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    boxShadow: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          backgroundColor: index % 2 === 0 ? "rgba(16, 37, 66, 0.1)" : "rgba(248, 112, 96, 0.1)",
                          borderRadius: 2,
                          flexShrink: 0,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main }}>
                            {feature.title}
                          </Typography>
                          <Chip
                            label={feature.status}
                            size="small"
                            color={getStatusColor(feature.status) as any}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          {/* Contact Section */}
          <Card sx={{ mt: 4, boxShadow: 2 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: colors.secondary.main }}>
                Want to be notified when this feature is ready?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Contact our development team for updates and early access opportunities.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: colors.primary.main,
                    '&:hover': { backgroundColor: colors.primary.hover }
                  }}
                >
                  Contact Development Team
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: colors.secondary.main,
                    color: colors.secondary.main,
                    '&:hover': { borderColor: colors.secondary.dark, backgroundColor: 'rgba(0,0,0,0.04)' }
                  }}
                >
                  View Roadmap
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default AccessControl;