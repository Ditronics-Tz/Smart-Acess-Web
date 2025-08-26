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
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { colors } from '../../styles/themes/colors';
import CreateRegistrationOfficerService, { CreateOfficerRequest } from '../../service/CreateRegistrationOfficerService';

interface CreateUserProps {
  onBack?: () => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ onBack }) => {
  const [formData, setFormData] = useState<Omit<CreateOfficerRequest, 'user_type'>>({
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

  const handleChange = (field: keyof Omit<CreateOfficerRequest, 'user_type'>) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
    if (formData.username.length > 50) {
      setError('Username must be at most 50 characters long.');
      return false;
    }
    if (!formData.full_name) {
      setError('Full name is required.');
      return false;
    }
    if (formData.full_name.length > 255) {
      setError('Full name must be at most 255 characters long.');
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
      // Always create as registration officer
      const requestData: CreateOfficerRequest = {
        ...formData,
        user_type: 'registration_officer'
      };
      
      const response = await CreateRegistrationOfficerService.createUser(requestData);
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

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 5 }}>
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
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.primary.light} 0%, rgba(248, 112, 96, 0.1) 100%)`,
                mb: 2,
                border: `2px solid ${colors.primary.light}`
              }}
            >
              <PersonAdd sx={{ 
                fontSize: 36, 
                color: colors.primary.main 
              }} />
            </Box>
            <Typography
              variant="h4"
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
              variant="body2" 
              color="text.secondary" 
              sx={{ fontSize: '1rem' }}
            >
              Add a new registration officer to the Smart Access Control System
            </Typography>
          </Box>

          <Divider sx={{ mb: 3, backgroundColor: colors.primary.light }} />

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {/* Username */}
              <TextField
                fullWidth
                size="small"
                label="Username"
                value={formData.username}
                onChange={handleChange('username')}
                required
                inputProps={{
                  minLength: 3,
                  maxLength: 50
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBox sx={{ color: colors.primary.main, fontSize: 20 }} />
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

              {/* Full Name */}
              <TextField
                fullWidth
                size="small"
                label="Full Name"
                value={formData.full_name}
                onChange={handleChange('full_name')}
                required
                inputProps={{
                  maxLength: 255
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: colors.primary.main, fontSize: 20 }} />
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

              {/* Email */}
              <TextField
                fullWidth
                size="small"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: colors.primary.main, fontSize: 20 }} />
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

              {/* Password */}
              <TextField
                fullWidth
                size="small"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                required
                inputProps={{
                  minLength: 8
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: colors.primary.main, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
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

              {/* Confirm Password */}
              <TextField
                fullWidth
                size="small"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirm_password}
                onChange={handleChange('confirm_password')}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: colors.primary.main, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
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
            </Stack>

            {/* Error Message */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2, 
                  borderRadius: 2 
                }}
              >
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="medium"
                disabled={loading}
                startIcon={<PersonAdd />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  backgroundColor: colors.primary.main,
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: colors.primary.hover,
                    transform: 'translateY(-2px)',
                    color: '#ffffff',
                  },
                  '&:disabled': {
                    backgroundColor: colors.action.disabled,
                    color: '#ffffff',
                    opacity: 0.7,
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#ffffff',
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