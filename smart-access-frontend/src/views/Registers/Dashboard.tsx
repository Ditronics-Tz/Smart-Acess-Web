import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  MenuOpen,
  Menu as MenuIcon,
  PersonAdd,
  People,
  School,
  FileUpload,
  TrendingUp,
  Assessment,
  Work,
  GroupAdd,
  CloudUpload,
  CreditCard,
  Add as AddCardIcon,
  ViewList,
  Settings,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../service/AuthService';
import RegisterSidebar from './shared/Sidebar';
import { colors } from '../../styles/themes/colors';

interface RegistersDashboardProps {
  onLogout?: () => void;
}

const Dashboard: React.FC<RegistersDashboardProps> = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      if (onLogout) {
        onLogout();
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSidebarNavigation = (view: string) => {
    setCurrentView(view);
    // Navigate to different views based on the selected item
    switch (view) {
      case 'add-student':
        navigate('/register-dashboard/add-student');
        break;
      case 'manage-students':
        navigate('/register-dashboard/manage-students');
        break;
      case 'student-search':
        navigate('/register-dashboard/search');
        break;
      case 'bulk-upload':
        navigate('/register-dashboard/bulk-upload');
        break;
      case 'add-staff':
        navigate('/register-dashboard/add-staff');
        break;
      case 'manage-staff':
        navigate('/register-dashboard/manage-staff');
        break;
      case 'staff-csv-upload':
        navigate('/register-dashboard/staff-csv-upload');
        break;
      case 'reports':
        navigate('/register-dashboard/reports');
        break;
      case 'settings':
        navigate('/register-dashboard/settings');
        break;
      // Add these missing card navigation cases:
      case 'manage-cards':
        navigate('/register-dashboard/manage-cards');
        break;
      case 'add-card':
        navigate('/register-dashboard/add-card');
        break;
      case 'view-cards':
        navigate('/register-dashboard/view-cards');
        break;
      // Staff card navigation cases:
      case 'manage-staff-cards':
        navigate('/register-dashboard/manage-staff-cards');
        break;
      case 'add-staff-card':
        navigate('/register-dashboard/add-staff-card');
        break;
      case 'view-staff-cards':
        navigate('/register-dashboard/view-staff-cards');
        break;
      // Security card navigation cases:
      case 'manage-security-cards':
        navigate('/register-dashboard/manage-security-cards');
        break;
      case 'add-security-card':
        navigate('/register-dashboard/add-security-card');
        break;
      case 'view-security-cards':
        navigate('/register-dashboard/view-security-cards');
        break;
      default:
        navigate('/register-dashboard');
    }
  };

  const username = AuthService.getUsername();

  const dashboardCards = [
    {
      title: "Add New Student",
      description: "Register new students into the system",
      icon: <PersonAdd sx={{ fontSize: 32, color: colors.primary.main }} />,
      action: () => handleSidebarNavigation('add-student'),
      stats: "Quick Entry",
      bgColor: colors.neutral.white,
    },
    {
      title: "Manage Students",
      description: "View and update existing student records",
      icon: <People sx={{ fontSize: 32, color: colors.secondary.main }} />,
      action: () => handleSidebarNavigation('manage-students'),
      stats: "1,247 Students",
      bgColor: colors.neutral.white,
    },
    {
      title: "Bulk Upload",
      description: "Upload multiple student records via CSV",
      icon: <FileUpload sx={{ fontSize: 32, color: colors.primary.main }} />,
      action: () => handleSidebarNavigation('bulk-upload'),
      stats: "CSV Import",
      bgColor: colors.neutral.white,
    },
    {
      title: "Student Reports",
      description: "Generate and view student analytics",
      icon: <Assessment sx={{ fontSize: 32, color: colors.secondary.main }} />,
      action: () => handleSidebarNavigation('reports'),
      stats: "5 Reports",
      bgColor: colors.neutral.white,
    },
  ];

  const statsCards = [
    {
      title: "Total Students",
      value: "1,247",
      change: "+23 this week",
      icon: <People sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "Enrolled Students",
      value: "1,198",
      change: "96% enrolled",
      icon: <School sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "New Registrations",
      value: "23",
      change: "This week",
      icon: <PersonAdd sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: "info.main",
    },
    {
      title: "Pending Reviews",
      value: "8",
      change: "Requires attention",
      icon: <TrendingUp sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "warning.main",
    },
  ];



  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <RegisterSidebar 
        collapsed={sidebarCollapsed} 
        currentView={currentView}
        onNavigate={handleSidebarNavigation}
      />

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        ml: sidebarCollapsed ? "64px" : "280px",
        transition: "margin-left 0.3s ease",
        minHeight: "100vh", 
        backgroundColor: "#f8f9fa" 
      }}>
        {/* Top AppBar */}
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: colors.neutral.white,
            color: colors.primary.main,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderBottom: `1px solid #e0e0e0`,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={toggleSidebar}
              sx={{ mr: 2 }}
            >
              {sidebarCollapsed ? <MenuIcon /> : <MenuOpen />}
            </IconButton>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Registration Officer Dashboard
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2, color: colors.secondary.main }}>
                Welcome, {username}
              </Typography>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: "bold", 
                color: colors.secondary.main,
                mb: 1 
              }}
            >
              Welcome back, {username}!
            </Typography>
            <Typography variant="body1" sx={{ color: colors.text.secondary }}>
              Manage student registrations and access control efficiently
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ 
            display: "flex", 
            gap: 3, 
            mb: 4,
            flexWrap: "wrap"
          }}>
            {statsCards.map((card, index) => (
              <Card 
                key={index}
                sx={{ 
                  flex: "1 1 300px",
                  minWidth: "250px",
                  background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                  border: `1px solid #e0e0e0`,
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Avatar sx={{ bgcolor: colors.primary.light }}>
                      {card.icon}
                    </Avatar>
                    <Chip
                      label={card.change}
                      size="small"
                      sx={{
                        bgcolor: card.changeColor === "success.main" ? "rgba(46, 125, 50, 0.1)" : 
                                 card.changeColor === "warning.main" ? "rgba(237, 108, 2, 0.1)" : 
                                 "rgba(2, 136, 209, 0.1)",
                        color: card.changeColor === "success.main" ? "#2e7d32" :
                               card.changeColor === "warning.main" ? "#ed6c02" :
                               "#0288d1",
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: colors.secondary.main, mb: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    {card.title}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Action Cards */}
          <Box sx={{ 
            display: "flex", 
            gap: 3, 
            mb: 4,
            flexWrap: "wrap"
          }}>
            {dashboardCards.map((card, index) => (
              <Card 
                key={index}
                sx={{ 
                  flex: "1 1 300px",
                  minWidth: "250px",
                  cursor: "pointer",
                  background: card.bgColor,
                  border: `1px solid #e0e0e0`,
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
                onClick={card.action}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {card.icon}
                    <Chip
                      label={card.stats}
                      size="small"
                      sx={{
                        ml: "auto",
                        bgcolor: colors.primary.light,
                        color: colors.primary.main,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.secondary.main, mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Quick Actions Grid */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: colors.secondary.main, mb: 3 }}>
              Quick Actions
            </Typography>
            <Box sx={{ 
              display: "flex", 
              gap: 2,
              flexWrap: "wrap"
            }}>
              {/* Student Management */}
              <Card 
                sx={{ 
                  flex: "1 1 280px",
                  minWidth: "250px",
                  cursor: "pointer", 
                  "&:hover": { 
                    backgroundColor: "#f8f9fa",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  },
                  border: `1px solid #e0e0e0`,
                  transition: "all 0.2s ease"
                }}
                onClick={() => handleSidebarNavigation('add-student')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PersonAdd sx={{ color: colors.primary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Add Student</Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>Register new student</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card 
                sx={{ 
                  flex: "1 1 280px",
                  minWidth: "250px",
                  cursor: "pointer", 
                  "&:hover": { 
                    backgroundColor: "#f8f9fa",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  },
                  border: `1px solid #e0e0e0`,
                  transition: "all 0.2s ease"
                }}
                onClick={() => handleSidebarNavigation('manage-students')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <People sx={{ color: colors.secondary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Manage Students</Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>View & edit records</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card 
                sx={{ 
                  flex: "1 1 280px",
                  minWidth: "250px",
                  cursor: "pointer", 
                  "&:hover": { 
                    backgroundColor: "#f8f9fa",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  },
                  border: `1px solid #e0e0e0`,
                  transition: "all 0.2s ease"
                }}
                onClick={() => handleSidebarNavigation('bulk-upload')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FileUpload sx={{ color: colors.primary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Bulk Upload</Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>CSV import students</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Staff Management */}
              <Card 
                sx={{ 
                  flex: "1 1 280px",
                  minWidth: "250px",
                  cursor: "pointer", 
                  "&:hover": { 
                    backgroundColor: "#f8f9fa",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  },
                  border: `1px solid #e0e0e0`,
                  transition: "all 0.2s ease"
                }}
                onClick={() => handleSidebarNavigation('add-staff')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <GroupAdd sx={{ color: colors.secondary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Add Staff</Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>Register new staff</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card 
                sx={{ 
                  flex: "1 1 280px",
                  minWidth: "250px",
                  cursor: "pointer", 
                  "&:hover": { 
                    backgroundColor: "#f8f9fa",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  },
                  border: `1px solid #e0e0e0`,
                  transition: "all 0.2s ease"
                }}
                onClick={() => handleSidebarNavigation('manage-staff')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Work sx={{ color: colors.primary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Manage Staff</Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>View & edit staff</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card 
                sx={{ 
                  flex: "1 1 280px",
                  minWidth: "250px",
                  cursor: "pointer", 
                  "&:hover": { 
                    backgroundColor: "#f8f9fa",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  },
                  border: `1px solid #e0e0e0`,
                  transition: "all 0.2s ease"
                }}
                onClick={() => handleSidebarNavigation('staff-csv-upload')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CloudUpload sx={{ color: colors.secondary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Staff CSV Upload</Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>Bulk import staff</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Card Management */}
              <Card 
                sx={{ 
                  flex: "1 1 280px",
                  minWidth: "250px",
                  cursor: "pointer", 
                  "&:hover": { 
                    backgroundColor: "#f8f9fa",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  },
                  border: `1px solid #e0e0e0`,
                  transition: "all 0.2s ease"
                }}
                onClick={() => handleSidebarNavigation('manage-cards')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CreditCard sx={{ color: colors.primary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Manage Cards</Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>ID card management</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card 
                sx={{ 
                  flex: "1 1 280px",
                  minWidth: "250px",
                  cursor: "pointer", 
                  "&:hover": { 
                    backgroundColor: "#f8f9fa",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  },
                  border: `1px solid #e0e0e0`,
                  transition: "all 0.2s ease"
                }}
                onClick={() => handleSidebarNavigation('add-card')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <AddCardIcon sx={{ color: colors.secondary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Add Card</Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>Issue new ID card</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card 
                sx={{ 
                  flex: "1 1 280px",
                  minWidth: "250px",
                  cursor: "pointer", 
                  "&:hover": { 
                    backgroundColor: "#f8f9fa",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  },
                  border: `1px solid #e0e0e0`,
                  transition: "all 0.2s ease"
                }}
                onClick={() => handleSidebarNavigation('view-cards')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <ViewList sx={{ color: colors.primary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>View Cards</Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>Browse card records</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Other Management */}
              <Card 
                sx={{ 
                  flex: "1 1 280px",
                  minWidth: "250px",
                  cursor: "pointer", 
                  "&:hover": { 
                    backgroundColor: "#f8f9fa",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  },
                  border: `1px solid #e0e0e0`,
                  transition: "all 0.2s ease"
                }}
                onClick={() => handleSidebarNavigation('reports')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Assessment sx={{ color: colors.primary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Reports</Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>Analytics & reports</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card 
                sx={{ 
                  flex: "1 1 280px",
                  minWidth: "250px",
                  cursor: "pointer", 
                  "&:hover": { 
                    backgroundColor: "#f8f9fa",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  },
                  border: `1px solid #e0e0e0`,
                  transition: "all 0.2s ease"
                }}
                onClick={() => handleSidebarNavigation('settings')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Settings sx={{ color: colors.secondary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Settings</Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>System configuration</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;