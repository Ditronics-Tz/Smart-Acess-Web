import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  PersonAdd,
  Dashboard as DashboardIcon,
  People,
  Settings,
  Security
} from '@mui/icons-material';
import { colors } from '../../styles/themes/colors';
import AdminAuthService from '../../service/AdminAuthService';
import CreateUser from './CreateUser';

interface AdminDashboardProps {
  onLogout?: () => void;
}

const Dashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'create-user'>('dashboard');
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await AdminAuthService.logout();
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

  const username = AdminAuthService.getUsername();

  const dashboardCards = [
    {
      title: 'Create Registration Officer',
      description: 'Add new registration officers to manage student access',
      icon: <PersonAdd sx={{ fontSize: 40, color: colors.primary.main }} />,
      action: () => setCurrentView('create-user'),
      color: colors.primary.light
    },
    {
      title: 'Manage Users',
      description: 'View and manage all system users',
      icon: <People sx={{ fontSize: 40, color: colors.secondary.main }} />,
      action: () => console.log('Manage Users'),
      color: colors.secondary.light
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences and security',
      icon: <Settings sx={{ fontSize: 40, color: colors.primary.main }} />,
      action: () => console.log('System Settings'),
      color: colors.primary.light
    },
    {
      title: 'Access Control',
      description: 'Monitor and control access permissions',
      icon: <Security sx={{ fontSize: 40, color: colors.secondary.main }} />,
      action: () => console.log('Access Control'),
      color: colors.secondary.light
    }
  ];

  if (currentView === 'create-user') {
    return <CreateUser onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <Box 
      sx={{ 
        flexGrow: 1,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 80%, ${colors.primary.light} 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, ${colors.primary.light} 0%, transparent 50%)`,
          opacity: 0.1,
          zIndex: 0
        }}
      />

      {/* AppBar */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: colors.neutral.white,
          color: colors.secondary.main,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          borderBottom: `2px solid ${colors.primary.light}`
        }}
      >
        <Toolbar>
          <DashboardIcon sx={{ mr: 2, color: colors.primary.main }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'bold',
              color: colors.secondary.main
            }}
          >
            Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                mr: 2,
                color: colors.secondary.main,
                fontWeight: 'medium'
              }}
            >
              Welcome, {username}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{
                color: colors.secondary.main,
                '&:hover': {
                  backgroundColor: colors.primary.light
                }
              }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  border: `1px solid ${colors.primary.light}`,
                  '& .MuiMenuItem-root': {
                    '&:hover': {
                      backgroundColor: colors.primary.light
                    }
                  }
                }
              }}
            >
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1, color: colors.primary.main }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, position: 'relative', zIndex: 1 }}>
        {/* Welcome Section */}
        <Paper
          elevation={10}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            backgroundColor: colors.neutral.white,
            border: `1px solid ${colors.primary.light}`,
            textAlign: 'center'
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: colors.primary.main,
              fontSize: '2rem',
              fontWeight: 'bold',
              mx: 'auto',
              mb: 2
            }}
          >
            {username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ 
              fontWeight: 'bold', 
              color: colors.secondary.main,
              mb: 1
            }}
          >
            Welcome to Admin Control
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ fontSize: '1.2rem' }}
          >
            Manage your Smart Access Control System with powerful administrative tools
          </Typography>
        </Paper>

        <Divider sx={{ mb: 4, backgroundColor: colors.primary.light }} />

        {/* Dashboard Cards - Using Flexbox like Home component */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {dashboardCards.map((card, index) => (
            <Box 
              key={index}
              sx={{ 
                flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                maxWidth: { xs: '100%', md: '500px' },
                minWidth: { xs: '280px' }
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  border: `2px solid transparent`,
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, ${card.color} 0%, rgba(255, 255, 255, 0.9) 100%)`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: colors.primary.main,
                    boxShadow: `0 16px 32px rgba(248, 112, 96, 0.3)`,
                  }
                }}
                onClick={card.action}
              >
                {/* Decorative Background */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${colors.primary.light} 0%, transparent 70%)`,
                    opacity: 0.5
                  }}
                />
                
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        backgroundColor: colors.neutral.white,
                        mr: 2,
                        boxShadow: `0 4px 12px ${colors.primary.light}`,
                        border: `2px solid ${colors.primary.light}`
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        color: colors.secondary.main,
                        flex: 1
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Box>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.neutral.text,
                      lineHeight: 1.6
                    }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;