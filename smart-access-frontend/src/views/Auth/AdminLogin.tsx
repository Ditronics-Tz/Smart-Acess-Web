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
  Divider
} from '@mui/material';
import {
  AdminPanelSettings,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login
} from '@mui/icons-material';
import { colors } from '../../styles/themes/colors';

const AdminLogin: React.FC = () => {
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
      if (formData.email === 'admin@smartaccess.com' && formData.password === 'admin123') {
        alert('Admin login successful! Redirecting to dashboard...');
        // Navigate to admin dashboard
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
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: colors.neutral.white,
            border: `1px solid ${colors.primary.light}`
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: '50%',
                backgroundColor: colors.primary.light,
                mb: 2
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 40, color: colors.primary.main }} />
            </Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 'bold', color: colors.secondary.main }}
            >
              Administrator Login
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access the admin dashboard to manage the system
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

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
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
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
                mt: 3,
                mb: 2,
                py: 1.5,
                backgroundColor: colors.primary.main,
                '&:hover': {
                  backgroundColor: colors.primary.hover,
                },
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In as Administrator'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: colors.neutral.gray,
              borderRadius: 2,
              border: `1px solid ${colors.primary.light}`
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Demo Credentials:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: admin@smartaccess.com<br />
              Password: admin123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;