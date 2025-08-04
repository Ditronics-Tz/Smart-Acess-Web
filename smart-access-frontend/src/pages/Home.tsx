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
  ArrowForward,
  AdminPanelSettings,
  Badge,
  LocalLibrary,
  Groups,
  Notifications
} from '@mui/icons-material';

const CollegeAccessControl: React.FC = () => {
  const features = [
    {
      icon: <School sx={{ fontSize: 48, color: '#14b8a6' }} />,
      title: 'Student ID Integration',
      description: 'Seamlessly integrate with existing student ID cards and campus databases for unified access management.'
    },
    {
      icon: <SecuritySharp sx={{ fontSize: 48, color: '#14b8a6' }} />,
      title: 'Advanced Security',
      description: 'Multi-layer security protocols including biometric verification and encrypted access logs.'
    },
    {
      icon: <Dashboard sx={{ fontSize: 48, color: '#14b8a6' }} />,
      title: 'Real-time Monitoring',
      description: 'Live dashboard for security personnel to monitor all campus access points and activities.'
    },
    {
      icon: <AccessTime sx={{ fontSize: 48, color: '#14b8a6' }} />,
      title: 'Schedule-based Access',
      description: 'Automated access control based on class schedules, events, and facility operating hours.'
    },
    {
      icon: <AdminPanelSettings sx={{ fontSize: 48, color: '#14b8a6' }} />,
      title: 'Role Management',
      description: 'Granular permission system for students, faculty, staff, and visitors with customizable access levels.'
    },
    {
      icon: <Notifications sx={{ fontSize: 48, color: '#14b8a6' }} />,
      title: 'Instant Alerts',
      description: 'Real-time notifications for security breaches, unauthorized access attempts, and system status.'
    }
  ];

  const stats = [
    { number: '50+', label: 'Universities Trust Us' },
    { number: '99.9%', label: 'System Uptime' },
    { number: '24/7', label: 'Security Monitoring' },
    { number: '1M+', label: 'Daily Access Logs' }
  ];

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          backgroundColor: '#1a1a1a',
          borderBottom: '3px solid #14b8a6'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Badge sx={{ fontSize: 32, color: '#14b8a6', mr: 2 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
              CampusGuard
            </Typography>
          </Box>
          <Stack direction="row" spacing={3}>
            <Button sx={{ color: 'white', fontWeight: 500 }}>Features</Button>
            <Button sx={{ color: 'white', fontWeight: 500 }}>Solutions</Button>
            <Button sx={{ color: 'white', fontWeight: 500 }}>Support</Button>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: '#14b8a6',
                fontWeight: 'bold',
                px: 3,
                '&:hover': { backgroundColor: '#0f9488' }
              }}
            >
              Get Demo
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          color: 'white',
          py: 12,
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
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)`,
            zIndex: 1
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 6 }}>
            <Box sx={{ flex: 1 }}>
              <Chip 
                label="Next-Gen Campus Security" 
                sx={{ 
                  backgroundColor: 'rgba(20, 184, 166, 0.2)',
                  color: '#14b8a6',
                  fontWeight: 'bold',
                  mb: 3,
                  border: '1px solid rgba(20, 184, 166, 0.3)'
                }}
              />
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #ffffff 30%, #14b8a6 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3
                }}
              >
                Secure Your Campus with Smart Access Control
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
                Comprehensive access management solution designed specifically for colleges and universities. 
                Protect students, faculty, and assets with intelligent, automated security systems.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ 
                    backgroundColor: '#14b8a6',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1.5,
                    px: 4,
                    '&:hover': { backgroundColor: '#0f9488' }
                  }}
                  endIcon={<ArrowForward />}
                >
                  Schedule Demo
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  sx={{ 
                    borderColor: '#14b8a6', 
                    color: '#14b8a6',
                    fontWeight: 'bold',
                    py: 1.5,
                    px: 4,
                    '&:hover': { 
                      borderColor: '#14b8a6', 
                      backgroundColor: 'rgba(20, 184, 166, 0.1)' 
                    }
                  }}
                >
                  View Features
                </Button>
              </Stack>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400,
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  borderRadius: 4,
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  position: 'relative'
                }}
              >
                <LocalLibrary sx={{ fontSize: 120, color: '#14b8a6', opacity: 0.8 }} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    backgroundColor: 'rgba(20, 184, 166, 0.2)',
                    borderRadius: 2,
                    p: 2,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Groups sx={{ color: '#14b8a6', fontSize: 32 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ backgroundColor: '#14b8a6', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {stats.map((stat, index) => (
              <Box 
                key={index}
                sx={{ 
                  flex: { xs: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 24px)' },
                  textAlign: 'center', 
                  color: 'white',
                  minWidth: '200px'
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stat.number}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
            Built for Modern Campuses
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
                maxWidth: { xs: '100%', lg: '400px' }
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
                    boxShadow: '0 20px 40px rgba(20, 184, 166, 0.15)',
                    borderColor: '#14b8a6'
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
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
      <Box sx={{ backgroundColor: '#1a1a1a', py: 10 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
            Ready to Secure Your Campus?
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.8, color: 'white', lineHeight: 1.6 }}>
            Join leading universities worldwide who trust CampusGuard to protect their students, 
            faculty, and facilities with cutting-edge access control technology.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button 
              variant="contained" 
              size="large" 
              sx={{
                backgroundColor: '#14b8a6',
                color: 'white',
                fontWeight: 'bold',
                py: 2,
                px: 5,
                '&:hover': { backgroundColor: '#0f9488' }
              }}
              endIcon={<ArrowForward />}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              sx={{
                borderColor: '#14b8a6',
                color: '#14b8a6',
                fontWeight: 'bold',
                py: 2,
                px: 5,
                '&:hover': { 
                  borderColor: '#14b8a6', 
                  backgroundColor: 'rgba(20, 184, 166, 0.1)' 
                }
              }}
            >
              Contact Sales
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#0d0d0d', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Badge sx={{ fontSize: 32, color: '#14b8a6', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  CampusGuard
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                Leading the future of campus security with intelligent access control solutions 
                designed specifically for educational institutions.
              </Typography>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#14b8a6' }}>
                Solutions
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Student Access Management</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Faculty & Staff Control</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Visitor Management</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Emergency Response</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#14b8a6' }}>
                Contact Us
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Email: info@campusguard.edu
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Phone: +1 (555) 123-GUARD
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  24/7 Support Available
                </Typography>
              </Stack>
            </Box>
          </Box>
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(20, 184, 166, 0.2)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © 2025 CampusGuard. All rights reserved. | Securing Education Since 2018
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default CollegeAccessControl;