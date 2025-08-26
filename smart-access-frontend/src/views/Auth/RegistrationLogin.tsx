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
import AuthService from '../../service/AuthService';

interface RegistrationLoginProps {
  onBackToHome?: () => void;
  onBackToSelection?: () => void;
  onLoginSuccess?: (userType: string) => void;
}

const RegistrationLogin: React.FC<RegistrationLoginProps> = ({ 
  onBackToHome, 
  onBackToSelection,
  onLoginSuccess
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Updated: Login now returns JWT tokens directly
      const response = await AuthService.login({
        username: formData.username,
        password: formData.password,
        user_type: 'registration_officer'
      });

      // Show success message briefly before redirecting
      console.log('Login successful:', response.message);
      
      // Redirect to dashboard immediately since OTP is disabled
      if (onLoginSuccess) {
        onLoginSuccess(response.user_type);
      }

    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      py: 4 
    }}>
      <Paper elevation={24} sx={{ 
        width: '100%',
        p: 4,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${colors.background.paper} 0%, rgba(76, 175, 80, 0.02) 100%)`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        border: `1px solid ${colors.secondary.light}20`
      }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <PersonAdd sx={{ 
            fontSize: 64, 
            color: colors.secondary.main,
            mb: 2,
            filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))'
          }} />
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            color: colors.text.primary,
            mb: 1
          }}>
            Registration Officer
          </Typography>
          <Typography variant="body1" sx={{ 
            color: colors.text.secondary,
            fontSize: '1.1rem'
          }}>
            Access registration dashboard
          </Typography>
        </Box>

        <Divider sx={{ mb: 4, borderColor: colors.secondary.light + '30' }} />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={formData.username}
            onChange={handleChange('username')}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: colors.secondary.main }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.secondary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.secondary.main,
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={formData.password}
            onChange={handleChange('password')}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: colors.secondary.main }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.secondary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.secondary.main,
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? null : <Login />}
            sx={{
              py: 2,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.dark} 100%)`,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: `0 8px 24px ${colors.secondary.main}40`,
              '&:hover': {
                background: `linear-gradient(135deg, ${colors.secondary.dark} 0%, ${colors.secondary.main} 100%)`,
                boxShadow: `0 12px 32px ${colors.secondary.main}60`,
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: colors.action.disabled,
                color: colors.action.disabled,
              },
              mb: 3
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>

        <Divider sx={{ mb: 3, borderColor: colors.secondary.light + '30' }} />

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onBackToSelection}
            disabled={loading}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: 2,
              borderColor: colors.secondary.light,
              color: colors.secondary.main,
              textTransform: 'none',
              '&:hover': {
                borderColor: colors.secondary.main,
                background: colors.secondary.light + '10',
              },
            }}
          >
            Back to Selection
          </Button>
          <Button
            variant="text"
            startIcon={<Home />}
            onClick={onBackToHome}
            disabled={loading}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: 2,
              color: colors.text.secondary,
              textTransform: 'none',
              '&:hover': {
                background: colors.action.hover,
                color: colors.text.primary,
              },
            }}
          >
            Back to Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default RegistrationLogin;