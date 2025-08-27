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
  AppBar,
  Toolbar,
  Badge,
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
  Menu as MenuIcon,
  Notifications,
  Settings,
  ExitToApp,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import UserManagementService, { RegistrationOfficer, UserManagementFilters } from '../../../service/UserManagementService';
import AdminSidebar from '../shared/AdminSidebar';
import AuthService from '../../../service/AuthService';

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

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Statistics state
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    locked_accounts: 0
  });

  const username = AuthService.getUsername();

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

  // Sidebar navigation handler
  const handleSidebarNavigation = (view: string) => {
    switch (view) {
      case "dashboard":
        navigate('/admin-dashboard');
        break;
      case "users":
        navigate('/admin-dashboard/users');
        break;
      case "reports":
        navigate('/admin-dashboard/reports');
        break;
      case "settings":
        navigate('/admin-dashboard/settings');
        break;
      default:
        navigate('/admin-dashboard');
    }
  };

  // Stats cards with Dashboard color scheme
  const statsCards = [
    {
      title: "Total Officers",
      value: stats.total_users.toString(),
      change: `${stats.total_users} registered`,
      icon: <People sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "Active Officers",
      value: stats.active_users.toString(),
      change: `${Math.round((stats.active_users / stats.total_users) * 100) || 0}% of total`,
      icon: <Person sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "Inactive Officers",
      value: stats.inactive_users.toString(),
      change: stats.inactive_users > 0 ? "Requires attention" : "All active",
      icon: <Lock sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: stats.inactive_users > 0 ? "warning.main" : "success.main",
    },
    {
      title: "Locked Accounts",
      value: stats.locked_accounts.toString(),
      change: stats.locked_accounts > 0 ? "Security alerts" : "No issues",
      icon: <LockOpen sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: stats.locked_accounts > 0 ? "error.main" : "success.main",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        currentView="users"
        onNavigate={handleSidebarNavigation}
      />

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        ml: sidebarCollapsed ? "64px" : "280px",
        transition: "margin-left 0.3s ease",
        minHeight: "100vh", 
        backgroundColor: "#f5f5f5"  // Dashboard background color
      }}>
        {/* Header - Dashboard Style */}
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: colors.neutral.white,
            color: colors.secondary.main,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderBottom: `1px solid #e0e0e0`,
          }}
        >
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
              {/* Sidebar Toggle */}
              <IconButton
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                sx={{
                  color: colors.secondary.main,
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                <MenuIcon />
              </IconButton>

              <Box
                sx={{
                  p: 1.5,
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <People sx={{ color: colors.neutral.white, fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    color: colors.secondary.main,
                    lineHeight: 1.2,
                  }}
                >
                  User Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registration Officers Control
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Search */}
              <TextField
                size="small"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  display: { xs: "none", sm: "block" },
                  width: 250,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Add Officer Button */}
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => navigate('/admin-dashboard/create-user')}
                sx={{
                  backgroundColor: colors.primary.main,
                  "&:hover": { backgroundColor: colors.primary.hover },
                  px: 3,
                  py: 1,
                }}
              >
                Add Officer
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Welcome Section - Dashboard Style */}
            <Paper
              sx={{
                background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                color: colors.neutral.white,
                p: 4,
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Registration Officers
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                    Manage and monitor all registration officers in the Smart Access Control System
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    border: `4px solid rgba(255,255,255,0.3)`,
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    backgroundColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  <People sx={{ fontSize: "3rem" }} />
                </Avatar>
              </Box>
            </Paper>

            {/* Stats Overview - Dashboard Style */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {statsCards.map((stat, index) => (
                <Box key={index} sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
                  <Card
                    sx={{
                      height: "100%",
                      boxShadow: 2,
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" fontWeight="500">
                            {stat.title}
                          </Typography>
                          <Typography variant="h3" fontWeight="bold" color={colors.secondary.main}>
                            {stat.value}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 1.5,
                            backgroundColor: index % 2 === 0 ? "rgba(16, 37, 66, 0.1)" : "rgba(248, 112, 96, 0.1)",
                            borderRadius: 2,
                          }}
                        >
                          {stat.icon}
                        </Box>
                      </Box>
                      <Typography variant="caption" sx={{ color: stat.changeColor, fontWeight: 500 }}>
                        {stat.change}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>

            {/* Filters Section */}
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status Filter</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status Filter"
                    onChange={handleStatusFilterChange}
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary.main,
                      },
                    }}
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
                  sx={{ 
                    borderColor: colors.primary.main, 
                    color: colors.primary.main,
                    "&:hover": {
                      borderColor: colors.primary.hover,
                      backgroundColor: "rgba(248, 112, 96, 0.04)",
                    },
                  }}
                >
                  Refresh
                </Button>
              </Box>
            </Paper>

            {/* Users Table */}
            <Paper
              sx={{
                borderRadius: 3,
                boxShadow: 3,
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
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Officer Details
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Contact Info
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Status
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Activity
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user, index) => (
                          <TableRow
                            key={user.user_id}
                            sx={{
                              '&:hover': { 
                                backgroundColor: 'rgba(248, 112, 96, 0.04)',
                                transition: "all 0.3s ease",
                              },
                              '&:nth-of-type(even)': { 
                                backgroundColor: index % 2 === 0 ? "rgba(16, 37, 66, 0.02)" : "rgba(248, 112, 96, 0.02)"
                              }
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar 
                                  sx={{ 
                                    bgcolor: index % 2 === 0 ? colors.primary.main : colors.secondary.main,
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="600" color={colors.secondary.main}>
                                    {user.full_name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    @{user.username}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Email sx={{ fontSize: 16, color: colors.primary.main }} />
                                  <Typography variant="body2">{user.email}</Typography>
                                </Box>
                                {user.phone_number && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Phone sx={{ fontSize: 16, color: colors.secondary.main }} />
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
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>

                            <TableCell>
                              <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2">
                                    {formatDate(user.created_at)}
                                  </Typography>
                                </Box>
                                {user.last_login && (
                                  <Typography variant="caption" color="success.main" fontWeight="500">
                                    Last: {formatDate(user.last_login)}
                                  </Typography>
                                )}
                                {user.failed_login_attempts > 0 && (
                                  <Typography variant="caption" color="error.main" fontWeight="500">
                                    Failed attempts: {user.failed_login_attempts}
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
                                    sx={{ 
                                      color: 'info.main',
                                      "&:hover": { 
                                        backgroundColor: "rgba(33, 150, 243, 0.1)",
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Manage User">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleManageUser(user.user_id)}
                                    sx={{ 
                                      color: colors.primary.main,
                                      "&:hover": { 
                                        backgroundColor: "rgba(248, 112, 96, 0.1)",
                                        transform: "scale(1.1)",
                                      },
                                    }}
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
                      borderTop: `1px solid #e0e0e0`,
                      backgroundColor: "#f8f9fa",
                      '.MuiTablePagination-toolbar': {
                        py: 2,
                      }
                    }}
                  />
                </>
              )}
            </Paper>
          </Box>
        </Container>
      </Box>

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