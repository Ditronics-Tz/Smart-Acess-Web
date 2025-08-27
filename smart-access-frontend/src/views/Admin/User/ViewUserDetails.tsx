import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  Stack,
  Alert,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Email,
  Phone,
  CalendarToday,
  AdminPanelSettings,
  AccountCircle,
  AccessTime,
  Security,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import UserManagementService, { UserDetailsResponse } from '../../../service/UserManagementService';

const ViewUserDetails: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = async () => {
    if (!userId) {
      setError('No user ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userData = await UserManagementService.getRegistrationOfficer(userId);
      setUser(userData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'warning';
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const formatUserType = (userType: string) => {
    return userType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
        }}
      >
        <CircularProgress sx={{ color: colors.primary.main }} />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: colors.neutral.white,
              textAlign: 'center',
            }}
          >
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || 'User not found'}
            </Alert>
            <IconButton
              onClick={() => navigate('/admin-dashboard/users')}
              sx={{
                backgroundColor: colors.primary.main,
                color: colors.neutral.white,
                '&:hover': { backgroundColor: colors.primary.hover },
                px: 3,
                py: 1,
              }}
            >
              <ArrowBack sx={{ mr: 1 }} />
              Back to Users
            </IconButton>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: colors.neutral.white,
            border: `1px solid ${colors.primary.light}`,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <IconButton
                onClick={() => navigate('/admin-dashboard/users')}
                sx={{ color: colors.secondary.main }}
              >
                <ArrowBack />
              </IconButton>
              <Box
                sx={{
                  p: 2,
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, rgba(248, 112, 96, 0.1) 100%)`,
                  borderRadius: 3,
                  boxShadow: 2,
                }}
              >
                <Person sx={{ color: colors.primary.main, fontSize: 32 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.secondary.main, mb: 1 }}
                >
                  User Details
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  @{user.username}
                </Typography>
              </Box>
            </Box>

            <Chip
              label={getStatusLabel(user.is_active)}
              color={getStatusColor(user.is_active)}
              size="medium"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Paper>

        {/* User Information Cards */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          {/* Main User Info */}
          <Box sx={{ flex: 2 }}>
            <Paper
              elevation={24}
              sx={{
                p: 4,
                borderRadius: 4,
                backgroundColor: colors.neutral.white,
                border: `1px solid ${colors.primary.light}`,
                mb: 4,
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                Personal Information
              </Typography>

              <Stack spacing={3}>
                {/* Full Name */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: colors.primary.main }}>
                    <AccountCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {user.full_name}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                {/* Username */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Username
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {user.username}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <Email />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                {/* Phone Number */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <Phone />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {user.phone_number || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Account Details Sidebar */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Stack spacing={4}>
              {/* Account Status */}
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  backgroundColor: colors.neutral.white,
                  border: `1px solid ${colors.primary.light}`,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                  Account Status
                </Typography>

                <Stack spacing={3}>
                  {/* User Type */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AdminPanelSettings sx={{ color: colors.primary.main }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        User Type
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatUserType(user.user_type)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  {/* Account Status */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Security sx={{ color: user.is_active ? 'success.main' : 'warning.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Account Status
                      </Typography>
                      <Chip
                        label={getStatusLabel(user.is_active)}
                        color={getStatusColor(user.is_active)}
                        size="small"
                        variant="filled"
                      />
                    </Box>
                  </Box>

                  <Divider />

                  {/* User ID */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      User ID
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        backgroundColor: 'grey.100',
                        p: 1,
                        borderRadius: 1,
                        wordBreak: 'break-all'
                      }}
                    >
                      {user.user_id}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Quick Actions */}
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  backgroundColor: colors.neutral.white,
                  border: `1px solid ${colors.primary.light}`,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                  Quick Actions
                </Typography>

                <Stack spacing={2}>
                  <Box
                    onClick={() => navigate(`/admin-dashboard/users/manage/${user.user_id}`)}
                    sx={{
                      p: 2,
                      backgroundColor: colors.primary.light,
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: colors.primary.main,
                        color: colors.neutral.white,
                      },
                      transition: 'all 0.3s ease',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Manage User
                    </Typography>
                  </Box>

                  <Box
                    onClick={() => navigate('/admin-dashboard/users')}
                    sx={{
                      p: 2,
                      backgroundColor: 'grey.100',
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'grey.200',
                      },
                      transition: 'all 0.3s ease',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Back to Users List
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ViewUserDetails;