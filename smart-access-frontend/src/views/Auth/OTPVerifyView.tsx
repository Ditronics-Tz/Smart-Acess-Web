import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  Divider,
  Stack,
  Chip
} from '@mui/material';
import {
  LockClock,
  Email,
  Refresh,
  ArrowBack,
  Home,
  VerifiedUser
} from '@mui/icons-material';
import { colors } from '../../styles/themes/colors';
import AuthService from '../../service/AuthService';
import AuthService from '../../service/AuthService';
import type { OTPVerifyResponse as AdminOTPResponse } from '../../service/AuthService';
import type { OTPVerifyResponse as RegistrationOTPResponse } from '../../service/AuthService';

interface OTPVerifyViewProps {
  sessionId: string;
  userType: 'administrator' | 'registration_officer';
  userEmail: string;
  onBackToLogin?: () => void;
  onBackToHome?: () => void;
  onOTPVerified?: (userType: string) => void;
}

const OTPVerifyView: React.FC<OTPVerifyViewProps> = ({
  sessionId,
  userType,
  userEmail,
  onBackToLogin,
  onBackToHome,
  onOTPVerified
}) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    if (value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      setLoading(false);
      return;
    }

    try {
      let response: AdminOTPResponse | RegistrationOTPResponse;
      
      if (userType === 'administrator') {
        response = await AuthService.verifyOTP({
          session_id: sessionId,
          otp_code: otp,
          user_type: 'administrator'
        });
      } else {
        response = await AuthService.verifyOTP({
          session_id: sessionId,
          otp_code: otp,
          user_type: 'registration_officer'
        });
      }

      setSuccessMessage('OTP verified successfully! Redirecting to dashboard...');
      
      // Wait a moment to show success message
      setTimeout(() => {
        if (onOTPVerified) {
          onOTPVerified(response.user_type);
        }
      }, 1500);

    } catch (error: any) {
      setError(error.message || 'An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      if (userType === 'administrator') {
        await AuthService.resendOTP({
          session_id: sessionId,
          user_type: 'administrator'
        });
      } else {
        await AuthService.resendOTP({
          session_id: sessionId,
          user_type: 'registration_officer'
        });
      }

      setSuccessMessage('New OTP sent to your email');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error: any) {
      setError(error.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
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
                fontSize: '0.875rem',
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: colors.neutral.white
                }
              }}
            >
              Home
            </Button>
          )}
          {onBackToLogin && (
            <Button
              variant="outlined"
              onClick={onBackToLogin}
              startIcon={<ArrowBack />}
              size="small"
              sx={{
                color: colors.neutral.white,
                borderColor: colors.neutral.white,
                fontSize: '0.875rem',
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: colors.neutral.white
                }
              }}
            >
              Back to Login
            </Button>
          )}
        </Stack>
      </Box>

      <Container 
        maxWidth="xs" 
        sx={{ 
          position: 'relative', 
          zIndex: 5,
          px: 2
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: colors.neutral.white,
            border: `1px solid ${colors.primary.light}`,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            width: '100%',
            maxWidth: 420,
            mx: 'auto'
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
              <VerifiedUser sx={{ 
                fontSize: 42, 
                color: colors.primary.main 
              }} />
            </Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ 
                fontWeight: 'bold', 
                color: colors.secondary.main,
                fontSize: '1.8rem',
                mb: 1
              }}
            >
              Verify Your Identity
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontSize: '0.9rem',
                mb: 2
              }}
            >
              Enter the 6-digit verification code sent to your email
            </Typography>

            {/* Email Display */}
            <Chip
              icon={<Email sx={{ fontSize: 16 }} />}
              label={userEmail}
              variant="outlined"
              sx={{
                borderColor: colors.primary.light,
                color: colors.secondary.main,
                backgroundColor: colors.primary.light,
                fontSize: '0.85rem'
              }}
            />
          </Box>

          <Divider sx={{ mb: 3, backgroundColor: colors.primary.light }} />

          {/* OTP Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter 6-digit OTP"
              value={otp}
              onChange={handleChange}
              margin="dense"
              required
              size="small"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              inputProps={{ 
                pattern: "[0-9]*",
                maxLength: 6,
                style: { 
                  textAlign: 'center', 
                  fontSize: '1.5rem',
                  letterSpacing: '0.3em',
                  fontWeight: 'bold'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockClock sx={{ 
                      color: colors.primary.main,
                      fontSize: 20
                    }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary.main,
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: colors.primary.main,
                  },
                },
              }}
            />

            {/* Success Message */}
            {successMessage && (
              <Alert 
                severity="success" 
                sx={{ 
                  mt: 1, 
                  mb: 1, 
                  borderRadius: 2,
                  fontSize: '0.8rem'
                }}
              >
                {successMessage}
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 1, 
                  mb: 1, 
                  borderRadius: 2,
                  fontSize: '0.8rem'
                }}
              >
                {error}
              </Alert>
            )}

            {/* Verify Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="medium"
              disabled={loading || otp.length !== 6}
              startIcon={<VerifiedUser sx={{ fontSize: 18 }} />}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: colors.primary.main,
                fontSize: '0.95rem',
                '&:hover': {
                  backgroundColor: colors.primary.hover,
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  backgroundColor: colors.neutral.gray,
                },
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            {/* Resend Button */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Didn't receive the code?
              </Typography>
              <Button
                variant="text"
                onClick={handleResendOTP}
                disabled={resendLoading}
                startIcon={<Refresh />}
                sx={{
                  color: colors.primary.main,
                  fontSize: '0.9rem',
                  '&:disabled': {
                    color: colors.neutral.text,
                  }
                }}
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default OTPVerifyView;