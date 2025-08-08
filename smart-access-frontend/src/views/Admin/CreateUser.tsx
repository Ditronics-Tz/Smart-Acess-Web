import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  Stack
} from '@mui/material';
import {
  PersonAdd,
  ArrowBack,
  AccountBox,
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { colors } from '../../styles/themes/colors';
import CreateRegistrationOfficerService from '../../service/CreateRegistrationOfficerService';

interface CreateOfficerRequest {
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

interface CreateUserProps {
  onBack?: () => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ onBack }) => {
  const [formData, setFormData] = useState<CreateOfficerRequest>({
    username: '',
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (field: keyof CreateOfficerRequest) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.username || formData.username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return false;
    }
    if (!formData.full_name) {
      setError('Full name is required.');
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await CreateRegistrationOfficerService.createRegistrationOfficer(formData);
      setSuccessMessage(`Registration Officer "${response.username}" created successfully!`);
      setSnackbarOpen(true);
      
      // Clear form after successful creation
      setFormData({
        username: '',
        full_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: ''
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
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

      {/* Back Button */}
      {onBack && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 10
          }}
        >
          <IconButton
            onClick={onBack}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: colors.secondary.main,
              '&:hover': {
                backgroundColor: colors.neutral.white,
                transform: 'translateY(-2px)',
              },
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            <ArrowBack />
          </IconButton>
        </Box>
      )}

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 5 }}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: colors.neutral.white,
            border: `1px solid ${colors.primary.light}`,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 3,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.primary.light} 0%, rgba(248, 112, 96, 0.1) 100%)`,
                mb: 2,
                border: `3px solid ${colors.primary.light}`
              }}
            >
              <PersonAdd sx={{ 
                fontSize: 48, 
                color: colors.primary.main 
              }} />
            </Box>
            <Typography
              variant="h3"
              gutterBottom
              sx={{ 
                fontWeight: 'bold', 
                color: colors.secondary.main,
                mb: 1
              }}
            >
              Create Registration Officer
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ fontSize: '1.1rem' }}
            >
              Add a new registration officer to manage student access control
            </Typography>
          </Box>

          <Divider sx={{ mb: 4, backgroundColor: colors.primary.light }} />

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Form Fields Container using Flexbox like your Home component */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
              {/* Username */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={handleChange('username')}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBox sx={{ color: colors.primary.main }} />
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
              </Box>

              {/* Full Name */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.full_name}
                  onChange={handleChange('full_name')}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: colors.primary.main }} />
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
              </Box>

              {/* Email */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
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
              </Box>

              {/* Phone Number */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Phone Number (Optional)"
                  value={formData.phone_number}
                  onChange={handleChange('phone_number')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: colors.primary.main }} />
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
              </Box>

              {/* Password */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange('password')}
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
              </Box>

              {/* Confirm Password */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={handleChange('confirm_password')}
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              </Box>
            </Box>

            {/* Error Message */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 3, 
                  borderRadius: 2 
                }}
              >
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<PersonAdd />}
                sx={{
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  backgroundColor: colors.primary.main,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: colors.primary.hover,
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    backgroundColor: colors.neutral.gray,
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Creating...' : 'Create Registration Officer'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: 2
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateUser;