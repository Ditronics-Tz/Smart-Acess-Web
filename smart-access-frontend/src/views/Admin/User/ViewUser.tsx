import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Avatar,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  PersonAdd,
  Edit,
  Delete,
  Lock,
  LockOpen,
  Refresh,
  Visibility,
  People,
  Person,
  Email,
  Phone,
  CalendarToday,
  AdminPanelSettings,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import UserManagementService, { RegistrationOfficer, UserManagementFilters } from '../../../service/UserManagementService';

const ViewUser: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<RegistrationOfficer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Statistics state
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    locked_accounts: 0
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: UserManagementFilters = {
        page: page + 1,
        page_size: rowsPerPage,
        search: searchTerm || undefined,
        is_active: statusFilter === 'all' ? undefined : statusFilter === 'active'
      };

      const response = await UserManagementService.listRegistrationOfficers(filters);
      setUsers(response.registration_officers);
      setTotalCount(response.pagination.total_count);
      setTotalPages(response.pagination.total_pages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await UserManagementService.getUserStatistics();
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    fetchUsers();
    fetchStats();
  };

  const handleManageUser = (userId: string) => {
    navigate(`/admin-dashboard/users/manage/${userId}`);
  };

  const handleViewUser = (userId: string) => {
    navigate(`/admin-dashboard/users/view/${userId}`);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (isActive: boolean, isLocked: boolean) => {
    if (isLocked) return 'error';
    return isActive ? 'success' : 'warning';
  };

  const getStatusLabel = (isActive: boolean, isLocked: boolean) => {
    if (isLocked) return 'Locked';
    return isActive ? 'Active' : 'Inactive';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
        py: 4,
      }}
    >
      {/* Header */}
      <Container maxWidth="xl" sx={{ mb: 4 }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box
                sx={{
                  p: 2,
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, rgba(248, 112, 96, 0.1) 100%)`,
                  borderRadius: 3,
                  boxShadow: 2,
                }}
              >
                <People sx={{ color: colors.primary.main, fontSize: 32 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.secondary.main, mb: 1 }}
                >
                  Registration Officers Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  View and manage all registration officers in the system
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/admin-dashboard/create-user')}
              sx={{
                backgroundColor: colors.primary.main,
                '&:hover': { backgroundColor: colors.primary.hover },
                px: 3,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Add Officer
            </Button>
          </Box>

          {/* Statistics Cards */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: colors.primary.main }}>
                    <People />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color={colors.secondary.main}>
                      {stats.total_users}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Officers
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {stats.active_users}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Officers
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <Lock />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {stats.inactive_users}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Inactive Officers
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'error.main' }}>
                    <LockOpen />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="error.main">
                      {stats.locked_accounts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Locked Accounts
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filters and Search */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search by name, username, or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ minWidth: 300, flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
                <MenuItem value="inactive">Inactive Only</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{ borderColor: colors.primary.main, color: colors.primary.main }}
            >
              Refresh
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Users Table */}
      <Container maxWidth="xl">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            backgroundColor: colors.neutral.white,
            border: `1px solid ${colors.primary.light}`,
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: colors.primary.main }} />
            </Box>
          ) : error ? (
            <Box sx={{ p: 4 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: colors.secondary.main }}>
                      <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold' }}>
                        Officer Details
                      </TableCell>
                      <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold' }}>
                        Contact Info
                      </TableCell>
                      <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold' }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold' }}>
                        Activity
                      </TableCell>
                      <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold' }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.user_id}
                        sx={{
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                          '&:nth-of-type(even)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: colors.primary.main }}>
                              {user.full_name?.charAt(0).toUpperCase() || '?'}
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold" color={colors.secondary.main}>
                                {user.full_name || 'Unknown'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                @{user.username || 'unknown'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">{user.email}</Typography>
                            </Box>
                            {user.phone_number && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2">{user.phone_number}</Typography>
                              </Box>
                            )}
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={getStatusLabel(user.is_active, user.account_locked)}
                            color={getStatusColor(user.is_active, user.account_locked)}
                            size="small"
                            variant={user.is_active && !user.account_locked ? 'filled' : 'outlined'}
                          />
                        </TableCell>

                        <TableCell>
                          <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                Created: {user.created_at ? formatDate(user.created_at) : 'N/A'}
                              </Typography>
                            </Box>
                            {user.last_login && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AdminPanelSettings sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  Last Login: {formatDate(user.last_login)}
                                </Typography>
                              </Box>
                            )}
                            {(user.failed_login_attempts ?? 0) > 0 && (
                              <Typography variant="body2" color="error.main">
                                Failed Attempts: {user.failed_login_attempts ?? 0}
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewUser(user.user_id)}
                                sx={{ color: colors.primary.main }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Manage User">
                              <IconButton
                                size="small"
                                onClick={() => handleManageUser(user.user_id)}
                                sx={{ color: colors.secondary.main }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                  borderTop: `1px solid ${colors.primary.light}`,
                  '.MuiTablePagination-toolbar': {
                    py: 2,
                  }
                }}
              />
            </>
          )}
        </Paper>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewUser;