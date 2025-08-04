import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import {
  PersonAdd,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login,
  ArrowBack,
  Home
} from '@mui/icons-material';
import { colors } from '../../styles/themes/colors';

interface RegistrationLoginProps {
  onBackToHome?: () => void;
  onBackToSelection?: () => void;
}

const RegistrationLogin: React.FC<RegistrationLoginProps> = ({ 
  onBackToHome, 
  onBackToSelection 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    // Simulate login API call
    setTimeout(() => {
      if (formData.email === 'officer@smartaccess.com' && formData.password === 'officer123') {
        alert('Registration Officer login successful! Redirecting to dashboard...');
        // Navigate to registration dashboard
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
        display: 'flex',
        alignItems: 'center',
        py: { xs: 1, md: 2 },
        position: 'relative'
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
          opacity: 0.3
        }}
      />

      {/* Navigation Buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 8, md: 16 },
          left: { xs: 8, md: 16 },
          zIndex: 10
        }}
      >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={1}
        >
          {onBackToHome && (
            <Button
              variant="outlined"
              onClick={onBackToHome}
              startIcon={<Home />}
              size="small"
              sx={{
                color: colors.neutral.white,
                borderColor: colors.neutral.white,
                fontSize: { xs: '0.7rem', md: '0.875rem' },
                px: { xs: 1, md: 2 },
                py: { xs: 0.5, md: 1 },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: colors.neutral.white
                }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Home</Box>
            </Button>
          )}
          {onBackToSelection && (
            <Button
              variant="outlined"
              onClick={onBackToSelection}
              startIcon={<ArrowBack />}
              size="small"
              sx={{
                color: colors.neutral.white,
                borderColor: colors.neutral.white,
                fontSize: { xs: '0.7rem', md: '0.875rem' },
                px: { xs: 1, md: 2 },
                py: { xs: 0.5, md: 1 },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: colors.neutral.white
                }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Back</Box>
            </Button>
          )}
        </Stack>
      </Box>

      <Container 
        maxWidth="xs" 
        sx={{ 
          position: 'relative', 
          zIndex: 5,
          px: { xs: 1.5, sm: 2 }
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: { xs: 2.5, sm: 3, md: 4 },
            borderRadius: { xs: 2, md: 3 },
            backgroundColor: colors.neutral.white,
            border: `1px solid ${colors.primary.light}`,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            width: '100%',
            maxWidth: { xs: '100%', sm: 380, md: 420 },
            mx: 'auto'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: { xs: 1.5, md: 2 },
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.secondary.light} 0%, rgba(16, 37, 66, 0.1) 100%)`,
                mb: { xs: 1.5, md: 2 },
                border: `2px solid ${colors.primary.light}`
              }}
            >
              <PersonAdd sx={{ 
                fontSize: { xs: 28, sm: 36, md: 42 }, 
                color: colors.primary.main 
              }} />
            </Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ 
                fontWeight: 'bold', 
                color: colors.secondary.main,
                fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' },
                mb: { xs: 0.5, md: 1 }
              }}
            >
              Registration Officer
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                px: { xs: 0.5, md: 0 }
              }}
            >
              Access registration dashboard to manage student access
            </Typography>
          </Box>

          <Divider sx={{ mb: { xs: 2, md: 3 }, backgroundColor: colors.primary.light }} />

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              margin="dense"
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ 
                      color: colors.primary.main,
                      fontSize: { xs: 18, md: 20 }
                    }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: { xs: 1, md: 1.5 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary.main,
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  '&.Mui-focused': {
                    color: colors.primary.main,
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              margin="dense"
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ 
                      color: colors.primary.main,
                      fontSize: { xs: 18, md: 20 }
                    }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? 
                        <VisibilityOff sx={{ fontSize: { xs: 18, md: 20 } }} /> : 
                        <Visibility sx={{ fontSize: { xs: 18, md: 20 } }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: { xs: 1, md: 1.5 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary.main,
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  '&.Mui-focused': {
                    color: colors.primary.main,
                  },
                },
              }}
            />

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 1, 
                  mb: 1, 
                  borderRadius: 2,
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  py: { xs: 0.5, md: 1 }
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="medium"
              disabled={loading}
              startIcon={<Login sx={{ fontSize: { xs: 16, md: 18 } }} />}
              sx={{
                mt: { xs: 2, md: 3 },
                py: { xs: 1.2, md: 1.5 },
                borderRadius: 2,
                backgroundColor: colors.primary.main,
                fontSize: { xs: '0.85rem', md: '0.95rem' },
                '&:hover': {
                  backgroundColor: colors.primary.hover,
                  transform: 'translateY(-1px)',
                },
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In as Officer'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationLogin;