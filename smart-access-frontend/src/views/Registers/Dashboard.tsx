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
      case 'programs':
        navigate('/register-dashboard/programs');
        break;
      case 'reports':
        navigate('/register-dashboard/reports');
        break;
      case 'settings':
        navigate('/register-dashboard/settings');
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

  const recentActivities = [
    { action: "New student registered", name: "John Doe", time: "2 hours ago", type: "success" },
    { action: "Student record updated", name: "Jane Smith", time: "4 hours ago", type: "info" },
    { action: "Bulk upload completed", name: "50 students", time: "1 day ago", type: "success" },
    { action: "Student status changed", name: "Mike Johnson", time: "2 days ago", type: "warning" },
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

          {/* Recent Activities and Quick Actions */}
          <Box sx={{ 
            display: "flex", 
            gap: 3,
            flexWrap: "wrap"
          }}>
            {/* Recent Activities */}
            <Box sx={{ flex: "2 1 600px", minWidth: "500px" }}>
              <Paper sx={{ p: 3, border: `1px solid #e0e0e0`, height: "100%" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.secondary.main, mb: 3 }}>
                  Recent Activities
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {recentActivities.map((activity, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        border: `1px solid #e0e0e0`,
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: activity.type === "success" ? "rgba(46, 125, 50, 0.1)" :
                                   activity.type === "warning" ? "rgba(237, 108, 2, 0.1)" :
                                   "rgba(2, 136, 209, 0.1)",
                          mr: 2,
                        }}
                      >
                        <PersonAdd sx={{ fontSize: 16, color: colors.primary.main }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.action}: {activity.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>

            {/* Quick Actions */}
            <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
              <Paper sx={{ p: 3, border: `1px solid #e0e0e0`, height: "100%" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.secondary.main, mb: 3 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Card 
                    sx={{ 
                      cursor: "pointer", 
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      border: `1px solid #e0e0e0`
                    }}
                    onClick={() => handleSidebarNavigation('add-student')}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PersonAdd sx={{ color: colors.primary.main, mr: 2 }} />
                        <Typography variant="body2">Add New Student</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                  <Card 
                    sx={{ 
                      cursor: "pointer", 
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      border: `1px solid #e0e0e0`
                    }}
                    onClick={() => handleSidebarNavigation('bulk-upload')}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FileUpload sx={{ color: colors.secondary.main, mr: 2 }} />
                        <Typography variant="body2">Bulk Upload</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;