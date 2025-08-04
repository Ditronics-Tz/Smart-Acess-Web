import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent,
  AppBar,
  Toolbar,
  Stack,
  Chip
} from '@mui/material';
import { 
  School, 
  SecuritySharp, 
  Dashboard, 
  AccessTime,
  AdminPanelSettings,
  Badge,
  LocalLibrary,
  Groups,
  Notifications,
  Login
} from '@mui/icons-material';

const Home: React.FC = () => {
  const features = [
    {
      icon: <School sx={{ fontSize: 48, color: '#F87060' }} />,
      title: 'Student ID Integration',
      description: 'Seamlessly integrate with existing student ID cards and campus databases for unified access management.'
    },
    {
      icon: <SecuritySharp sx={{ fontSize: 48, color: '#F87060' }} />,
      title: 'Advanced Security',
      description: 'Multi-layer security protocols including biometric verification and encrypted access logs.'
    },
    {
      icon: <Dashboard sx={{ fontSize: 48, color: '#F87060' }} />,
      title: 'Real-time Monitoring',
      description: 'Live dashboard for security personnel to monitor all campus access points and activities.'
    },
    {
      icon: <AccessTime sx={{ fontSize: 48, color: '#F87060' }} />,
      title: 'Schedule-based Access',
      description: 'Automated access control based on class schedules, events, and facility operating hours.'
    },
    {
      icon: <AdminPanelSettings sx={{ fontSize: 48, color: '#F87060' }} />,
      title: 'Role Management',
      description: 'Granular permission system for students, faculty, staff, and visitors with customizable access levels.'
    },
    {
      icon: <Notifications sx={{ fontSize: 48, color: '#F87060' }} />,
      title: 'Instant Alerts',
      description: 'Real-time notifications for security breaches, unauthorized access attempts, and system status.'
    }
  ];

  const handleLogin = () => {
    // Add navigation logic here
    console.log('Login clicked');
  };

  const handleAccessSystem = () => {
    // Add navigation logic here
    console.log('Access System clicked');
  };

  const handleLearnMore = () => {
    // Add navigation logic here
    console.log('Learn More clicked');
  };

  const handleContactSupport = () => {
    // Add navigation logic here
    console.log('Contact Support clicked');
  };

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          backgroundColor: '#102542',
          borderBottom: '3px solid #F87060'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Badge sx={{ fontSize: 32, color: '#F87060', mr: 2 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
              Smart Access
            </Typography>
          </Box>
          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button sx={{ color: 'white', fontWeight: 500 }}>Features</Button>
            <Button sx={{ color: 'white', fontWeight: 500 }}>Solutions</Button>
            <Button sx={{ color: 'white', fontWeight: 500 }}>Support</Button>
          </Stack>
          <Button 
            variant="contained" 
            onClick={handleLogin}
            sx={{ 
              backgroundColor: '#F87060',
              fontWeight: 'bold',
              px: 3,
              ml: { xs: 0, md: 3 },
              '&:hover': { backgroundColor: '#e55a4a' }
            }}
            startIcon={<Login />}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #102542 0%, #1a3a5c 50%, #102542 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(248, 112, 96, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(248, 112, 96, 0.1) 0%, transparent 50%)`,
            zIndex: 1
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: 'center', 
            gap: { xs: 4, md: 6 } 
          }}>
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Chip 
                label="Smart Access Control System" 
                sx={{ 
                  backgroundColor: 'rgba(248, 112, 96, 0.2)',
                  color: '#F87060',
                  fontWeight: 'bold',
                  mb: 3,
                  border: '1px solid rgba(248, 112, 96, 0.3)'
                }}
              />
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #ffffff 30%, #F87060 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3.75rem' }
                }}
              >
                Secure Your Campus with Smart Access Control
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
                Comprehensive access management solution designed specifically for colleges and universities. 
                Protect students, faculty, and assets with intelligent, automated security systems.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
              >
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleAccessSystem}
                  sx={{ 
                    backgroundColor: '#F87060',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1.5,
                    px: 4,
                    '&:hover': { backgroundColor: '#e55a4a' }
                  }}
                  startIcon={<Login />}
                >
                  Access System
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  onClick={handleLearnMore}
                  sx={{ 
                    borderColor: '#F87060', 
                    color: '#F87060',
                    fontWeight: 'bold',
                    py: 1.5,
                    px: 4,
                    '&:hover': { 
                      borderColor: '#F87060', 
                      backgroundColor: 'rgba(248, 112, 96, 0.1)' 
                    }
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 300, md: 400 },
                  background: 'linear-gradient(135deg, rgba(248, 112, 96, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  borderRadius: 4,
                  border: '1px solid rgba(248, 112, 96, 0.2)',
                  position: 'relative'
                }}
              >
                <LocalLibrary sx={{ fontSize: { xs: 80, md: 120 }, color: '#F87060', opacity: 0.8 }} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    backgroundColor: 'rgba(248, 112, 96, 0.2)',
                    borderRadius: 2,
                    p: 2,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Groups sx={{ color: '#F87060', fontSize: 32 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: '#102542',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Comprehensive Access Management
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Our comprehensive suite of features ensures your campus remains secure while providing 
            seamless access for authorized personnel.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
          {features.map((feature, index) => (
            <Box 
              key={index}
              sx={{ 
                flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)', lg: '1 1 calc(33.333% - 21px)' },
                maxWidth: { xs: '100%', lg: '400px' },
                minWidth: { xs: '280px' }
              }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  backgroundColor: 'white',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(248, 112, 96, 0.15)',
                    borderColor: '#F87060'
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#102542' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: '#102542', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: 'white',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Ready to Access the System?
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.8, color: 'white', lineHeight: 1.6 }}>
            Access your Smart Access Control dashboard to manage campus security, 
            monitor access points, and control user permissions.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button 
              variant="contained" 
              size="large" 
              onClick={handleLogin}
              sx={{
                backgroundColor: '#F87060',
                color: 'white',
                fontWeight: 'bold',
                py: 2,
                px: 5,
                '&:hover': { backgroundColor: '#e55a4a' }
              }}
              startIcon={<Login />}
            >
              Login to System
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={handleContactSupport}
              sx={{
                borderColor: '#F87060',
                color: '#F87060',
                fontWeight: 'bold',
                py: 2,
                px: 5,
                '&:hover': { 
                  borderColor: '#F87060', 
                  backgroundColor: 'rgba(248, 112, 96, 0.1)' 
                }
              }}
            >
              Contact Support
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#0a1829', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Badge sx={{ fontSize: 32, color: '#F87060', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Smart Access
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                Leading access control solutions designed specifically for educational institutions 
                and modern campus security needs.
              </Typography>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#F87060' }}>
                System Features
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Student Access Management</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Faculty & Staff Control</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Visitor Management</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Security Monitoring</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#F87060' }}>
                Support
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Email: support@smartaccess.com
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Phone: +1 (555) 123-ACCESS
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  24/7 Technical Support
                </Typography>
              </Stack>
            </Box>
          </Box>
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(248, 112, 96, 0.2)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © 2025 Smart Access Control System. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;