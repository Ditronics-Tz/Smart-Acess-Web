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
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Enhanced Background Pattern */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 15% 85%, ${colors.primary.light} 0%, transparent 60%),
            radial-gradient(circle at 85% 15%, ${colors.primary.light} 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(248, 112, 96, 0.05) 0%, transparent 50%)
          `,
          opacity: 0.4,
          animation: 'backgroundFloat 25s ease-in-out infinite',
          zIndex: 0,
          '@keyframes backgroundFloat': {
            '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
            '50%': { transform: 'scale(1.05) rotate(1deg)' }
          }
        }}
      />

      {/* Floating Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: '8%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.primary.light} 0%, transparent 70%)`,
          opacity: 0.1,
          animation: 'float1 20s ease-in-out infinite'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: 80,
          height: 80,
          borderRadius: 4,
          background: `linear-gradient(45deg, ${colors.primary.light}, transparent)`,
          opacity: 0.1,
          animation: 'float2 18s ease-in-out infinite reverse'
        }}
      />

      {/* Top Navigation Bar Placeholder */}
      <Box
        sx={{
          height: 8,
          background: `linear-gradient(90deg, ${colors.primary.main}, ${colors.secondary.main})`,
          opacity: 0.8,
          position: 'relative',
          zIndex: 3
        }}
      />

      {/* Enhanced AppBar */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: colors.secondary.main,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid rgba(248, 112, 96, 0.2)`,
          zIndex: 2
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1,
              borderRadius: 2,
              backgroundColor: `rgba(248, 112, 96, 0.1)`,
              mr: 3
            }}
          >
            <DashboardIcon sx={{ color: colors.primary.main, fontSize: 28 }} />
          </Box>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 800,
              color: colors.secondary.main,
              background: `linear-gradient(135deg, ${colors.secondary.main}, ${colors.primary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Admin Control Center
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Paper
              sx={{
                px: 3,
                py: 1,
                borderRadius: 20,
                backgroundColor: `rgba(248, 112, 96, 0.1)`,
                border: `1px solid rgba(248, 112, 96, 0.2)`
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: colors.secondary.main,
                  fontWeight: 600
                }}
              >
                Welcome, {username}
              </Typography>
            </Paper>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{
                color: colors.secondary.main,
                backgroundColor: `rgba(248, 112, 96, 0.1)`,
                border: `1px solid rgba(248, 112, 96, 0.2)`,
                '&:hover': {
                  backgroundColor: colors.primary.light,
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <AccountCircle sx={{ fontSize: 28 }} />
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
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid rgba(248, 112, 96, 0.2)`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  '& .MuiMenuItem-root': {
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    '&:hover': {
                      backgroundColor: colors.primary.light
                    }
                  }
                }
              }}
            >
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 2, color: colors.primary.main }} />
                <Typography fontWeight={600}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Layout Container */}
      <Box sx={{ display: 'flex', flex: 1, position: 'relative', zIndex: 1 }}>
        {/* Sidebar Placeholder */}
        <Box
          sx={{
            width: { xs: 0, md: 280 },
            flexShrink: 0,
            position: 'relative'
          }}
        >
          <Paper
            sx={{
              position: 'fixed',
              left: 0,
              top: 88, // Height of AppBar + top nav
              bottom: 60, // Height of footer
              width: { xs: 0, md: 280 },
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRight: `1px solid rgba(248, 112, 96, 0.2)`,
              borderRadius: '0 20px 0 0',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              p: 3,
              zIndex: 1
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: colors.secondary.main,
                fontWeight: 700,
                mb: 3,
                textAlign: 'center'
              }}
            >
              Navigation Menu
            </Typography>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `rgba(248, 112, 96, 0.05)`,
                borderRadius: 3,
                border: `2px dashed rgba(248, 112, 96, 0.3)`
              }}
            >
              <Typography
                sx={{
                  color: colors.primary.main,
                  fontWeight: 600,
                  textAlign: 'center'
                }}
              >
                Sidebar Components
                <br />
                Will be added here
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}
        >
          {/* Stats Section Placeholder */}
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `1px solid rgba(248, 112, 96, 0.1)`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${colors.primary.main}, ${colors.secondary.main})`,
                  borderRadius: '4px 4px 0 0'
                }}
              />
              
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    backgroundColor: `linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main})`,
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    mx: 'auto',
                    mb: 3,
                    border: `4px solid rgba(248, 112, 96, 0.2)`,
                    boxShadow: '0 8px 32px rgba(248, 112, 96, 0.3)'
                  }}
                >
                  {username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{ 
                    fontWeight: 800, 
                    color: colors.secondary.main,
                    mb: 1,
                    background: `linear-gradient(135deg, ${colors.secondary.main}, ${colors.primary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  System Overview
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: '1.3rem',
                    maxWidth: 600,
                    mx: 'auto',
                    lineHeight: 1.6
                  }}
                >
                  Manage your Smart Access Control System with comprehensive administrative tools
                </Typography>
              </Box>

              {/* Stats Placeholder */}
              <Box
                sx={{
                  height: 120,
                  backgroundColor: `rgba(248, 112, 96, 0.05)`,
                  borderRadius: 3,
                  border: `2px dashed rgba(248, 112, 96, 0.3)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  sx={{
                    color: colors.primary.main,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    textAlign: 'center'
                  }}
                >
                  📊 Statistics & Analytics Cards
                  <br />
                  Will be displayed here
                </Typography>
              </Box>
            </Paper>

            <Divider 
              sx={{ 
                mb: 4, 
                backgroundColor: colors.primary.light,
                height: 2,
                borderRadius: 1,
                opacity: 0.3
              }} 
            />

            {/* Enhanced Action Cards */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: colors.secondary.main,
                mb: 4,
                textAlign: 'center'
              }}
            >
              Quick Actions
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 4, 
              justifyContent: 'center',
              mb: 4
            }}>
              {dashboardCards.map((card, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', lg: '1 1 calc(50% - 16px)' },
                    maxWidth: { xs: '100%', lg: '480px' },
                    minWidth: { xs: '280px' }
                  }}
                >
                  <Card
                    sx={{
                      height: 180,
                      cursor: 'pointer',
                      border: `2px solid transparent`,
                      borderRadius: 4,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      background: `linear-gradient(135deg, ${card.color} 0%, rgba(255, 255, 255, 0.95) 100%)`,
                      backdropFilter: 'blur(20px)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, transparent 0%, rgba(248, 112, 96, 0.05) 100%)`,
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      },
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        borderColor: colors.primary.main,
                        boxShadow: `0 20px 40px rgba(248, 112, 96, 0.4)`,
                        '&::before': {
                          opacity: 1
                        }
                      }
                    }}
                    onClick={card.action}
                  >
                    {/* Decorative Elements */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -30,
                        right: -30,
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${colors.primary.light} 0%, transparent 70%)`,
                        opacity: 0.3
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -20,
                        left: -20,
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        background: `linear-gradient(45deg, ${colors.secondary.light}, transparent)`,
                        opacity: 0.2
                      }}
                    />
                    
                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 3
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: colors.neutral.white,
                            mr: 3,
                            boxShadow: `0 8px 25px rgba(248, 112, 96, 0.2)`,
                            border: `3px solid rgba(248, 112, 96, 0.1)`,
                            transition: 'transform 0.3s ease'
                          }}
                        >
                          {card.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: colors.secondary.main,
                            flex: 1,
                            lineHeight: 1.3
                          }}
                        >
                          {card.title}
                        </Typography>
                      </Box>
                      
                      <Typography
                        variant="body1"
                        sx={{
                          color: colors.neutral.text,
                          lineHeight: 1.6,
                          fontSize: '1.05rem',
                          flex: 1
                        }}
                      >
                        {card.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>

            {/* Additional Components Placeholder */}
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `2px dashed rgba(248, 112, 96, 0.3)`,
                textAlign: 'center'
              }}
            >
              <Typography
                sx={{
                  color: colors.primary.main,
                  fontWeight: 600,
                  fontSize: '1.2rem'
                }}
              >
                🔧 Additional Dashboard Components
                <br />
                Space reserved for future features
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Footer Placeholder */}
      <Paper
        component="footer"
        sx={{
          height: 60,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid rgba(248, 112, 96, 0.2)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        <Typography
          sx={{
            color: colors.secondary.main,
            fontWeight: 600
          }}
        >
          Footer Content Area - © 2025 Smart Access Control System
        </Typography>
      </Paper>

     
    </Box>
  );
};

export default Dashboard;