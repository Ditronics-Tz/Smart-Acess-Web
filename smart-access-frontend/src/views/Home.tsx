import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent,
  Stack,
  Chip
} from '@mui/material';
import { 
  School, 
  SecuritySharp, 
  Dashboard, 
  AccessTime,
  AdminPanelSettings,
  LocalLibrary,
  Groups,
  Notifications,
  Login
} from '@mui/icons-material';
import { colors } from '../styles/themes/colors';

interface HomeProps {
  onLoginClick?: () => void;
}

const Home: React.FC<HomeProps> = ({ onLoginClick }) => {
  const features = [
    {
      icon: <School sx={{ fontSize: 48, color: colors.primary.main }} />,
      title: 'Student ID Integration',
      description: 'Seamlessly integrate with existing student ID cards and campus databases for unified access management.'
    },
    {
      icon: <SecuritySharp sx={{ fontSize: 48, color: colors.primary.main }} />,
      title: 'Advanced Security',
      description: 'Multi-layer security protocols including biometric verification and encrypted access logs.'
    },
    {
      icon: <Dashboard sx={{ fontSize: 48, color: colors.primary.main }} />,
      title: 'Real-time Monitoring',
      description: 'Live dashboard for security personnel to monitor all campus access points and activities.'
    },
    {
      icon: <AccessTime sx={{ fontSize: 48, color: colors.primary.main }} />,
      title: 'Schedule-based Access',
      description: 'Automated access control based on class schedules, events, and facility operating hours.'
    },
    {
      icon: <AdminPanelSettings sx={{ fontSize: 48, color: colors.primary.main }} />,
      title: 'Role Management',
      description: 'Granular permission system for students, faculty, staff, and visitors with customizable access levels.'
    },
    {
      icon: <Notifications sx={{ fontSize: 48, color: colors.primary.main }} />,
      title: 'Instant Alerts',
      description: 'Real-time notifications for security breaches, unauthorized access attempts, and system status.'
    }
  ];

  const handleAccessSystem = () => {
    if (onLoginClick) {
      onLoginClick();
    }
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
    <Box sx={{ backgroundColor: colors.neutral.white }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 50%, ${colors.secondary.main} 100%)`,
          color: colors.neutral.white,
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
            backgroundImage: `radial-gradient(circle at 20% 80%, ${colors.primary.light} 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, ${colors.primary.light} 0%, transparent 50%)`,
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
                  backgroundColor: colors.primary.light,
                  color: colors.primary.main,
                  fontWeight: 'bold',
                  mb: 3,
                  border: `1px solid ${colors.primary.light}`
                }}
              />
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  background: `linear-gradient(45deg, ${colors.neutral.white} 30%, ${colors.primary.main} 90%)`,
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
                    backgroundColor: colors.primary.main,
                    color: colors.neutral.white,
                    fontWeight: 'bold',
                    py: 1.5,
                    px: 4,
                    '&:hover': { backgroundColor: colors.primary.hover }
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
                    borderColor: colors.primary.main, 
                    color: colors.primary.main,
                    fontWeight: 'bold',
                    py: 1.5,
                    px: 4,
                    '&:hover': { 
                      borderColor: colors.primary.main, 
                      backgroundColor: colors.primary.light
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
                  background: `linear-gradient(135deg, ${colors.primary.light} 0%, rgba(255, 255, 255, 0.05) 100%)`,
                  borderRadius: 4,
                  border: `1px solid ${colors.primary.light}`,
                  position: 'relative'
                }}
              >
                <LocalLibrary sx={{ fontSize: { xs: 80, md: 120 }, color: colors.primary.main, opacity: 0.8 }} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    backgroundColor: colors.primary.light,
                    borderRadius: 2,
                    p: 2,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Groups sx={{ color: colors.primary.main, fontSize: 32 }} />
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
              color: colors.secondary.main,
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
                    boxShadow: `0 20px 40px ${colors.primary.light}`,
                    borderColor: colors.primary.main
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
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
      <Box sx={{ backgroundColor: colors.secondary.main, py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: colors.neutral.white,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Ready to Access the System?
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.8, color: colors.neutral.white, lineHeight: 1.6 }}>
            Access your Smart Access Control dashboard to manage campus security, 
            monitor access points, and control user permissions.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button 
              variant="contained" 
              size="large" 
              onClick={handleAccessSystem}
              sx={{
                backgroundColor: colors.primary.main,
                color: colors.neutral.white,
                fontWeight: 'bold',
                py: 2,
                px: 5,
                '&:hover': { backgroundColor: colors.primary.hover }
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
                borderColor: colors.primary.main,
                color: colors.primary.main,
                fontWeight: 'bold',
                py: 2,
                px: 5,
                '&:hover': { 
                  borderColor: colors.primary.main, 
                  backgroundColor: colors.primary.light
                }
              }}
            >
              Contact Support
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;