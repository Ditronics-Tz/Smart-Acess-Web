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
        py: 4,
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
          top: 20,
          left: 20,
          zIndex: 10
        }}
      >
        <Stack direction="row" spacing={2}>
          {onBackToHome && (
            <Button
              variant="outlined"
              onClick={onBackToHome}
              startIcon={<Home />}
              sx={{
                color: colors.neutral.white,
                borderColor: colors.neutral.white,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: colors.neutral.white
                }
              }}
            >
              Home
            </Button>
          )}
          {onBackToSelection && (
            <Button
              variant="outlined"
              onClick={onBackToSelection}
              startIcon={<ArrowBack />}
              sx={{
                color: colors.neutral.white,
                borderColor: colors.neutral.white,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: colors.neutral.white
                }
              }}
            >
              Back to Selection
            </Button>
          )}
        </Stack>
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 5 }}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: colors.neutral.white,
            border: `1px solid ${colors.primary.light}`,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 3,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.secondary.light} 0%, rgba(16, 37, 66, 0.1) 100%)`,
                mb: 3,
                border: `2px solid ${colors.primary.light}`
              }}
            >
              <PersonAdd sx={{ fontSize: 48, color: colors.primary.main }} />
            </Box>
            <Typography
              variant="h3"
              gutterBottom
              sx={{ 
                fontWeight: 'bold', 
                color: colors.secondary.main,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Registration Officer
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Access registration dashboard to manage student access
            </Typography>
          </Box>

          <Divider sx={{ mb: 4, backgroundColor: colors.primary.light }} />

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: colors.primary.main }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary.main,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: colors.primary.main,
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: colors.primary.main }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary.main,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: colors.primary.main,
                },
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={<Login />}
              sx={{
                mt: 4,
                mb: 2,
                py: 2,
                borderRadius: 2,
                backgroundColor: colors.primary.main,
                '&:hover': {
                  backgroundColor: colors.primary.hover,
                  transform: 'translateY(-2px)',
                },
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In as Officer'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <Box
            sx={{
              mt: 3,
              p: 3,
              backgroundColor: colors.neutral.gray,
              borderRadius: 3,
              border: `1px solid ${colors.primary.light}`
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: colors.secondary.main }}>
              Demo Credentials:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: officer@smartaccess.com<br />
              Password: officer123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationLogin;