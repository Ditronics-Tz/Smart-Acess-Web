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
  Security,
  People,
  Person,
  Email,
  Phone,
  CalendarToday,
  Badge as BadgeIcon,
  Work,
  Menu as MenuIcon,
  Notifications,
  Settings,
  ExitToApp,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import SecurityPersonelService, { SecurityPersonnel, SecurityPersonnelListParams } from '../../../service/SecurityPersonelService';
import AdminSidebar from '../shared/AdminSidebar';
import AuthService from '../../../service/AuthService';

const ViewSecurity: React.FC = () => {
  const navigate = useNavigate();
  const [securityPersonnel, setSecurityPersonnel] = useState<SecurityPersonnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    recentlyAdded: 0
  });

  const username = AuthService.getUsername();

  const fetchSecurityPersonnel = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: SecurityPersonnelListParams = {
        page: page + 1,
        page_size: rowsPerPage,
        search: searchTerm || undefined,
        is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
        ordering: '-created_at'
      };

      const response = await SecurityPersonelService.listSecurityPersonnel(params);
      setSecurityPersonnel(response.results);
      setTotalCount(response.count);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await SecurityPersonelService.getSecurityPersonnelStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchSecurityPersonnel();
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
    fetchSecurityPersonnel();
    fetchStats();
  };

  const handleAddPersonnel = () => {
    navigate('/admin-dashboard/security/add');
  };

  const handleManagePersonnel = (securityId: string) => {
    navigate(`/admin-dashboard/security/manage/${securityId}`);
  };

  const handleViewPersonnel = (securityId: string) => {
    navigate(`/admin-dashboard/security/view/${securityId}`);
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

  const getStatusColor = (isActive: boolean, isTerminated: boolean) => {
    if (isTerminated) return 'error';
    return isActive ? 'success' : 'warning';
  };

  const getStatusLabel = (isActive: boolean, isTerminated: boolean) => {
    if (isTerminated) return 'Terminated';
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
      case "security":
        navigate('/admin-dashboard/security');
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
      title: "Total Personnel",
      value: stats.total.toString(),
      change: `${stats.total} registered`,
      icon: <Security sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "Active Personnel",
      value: stats.active.toString(),
      change: `${Math.round((stats.active / stats.total) * 100) || 0}% of total`,
      icon: <Person sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "Inactive Personnel",
      value: stats.inactive.toString(),
      change: stats.inactive > 0 ? "Requires attention" : "All active",
      icon: <Lock sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: stats.inactive > 0 ? "warning.main" : "success.main",
    },
    {
      title: "Recently Added",
      value: stats.recentlyAdded.toString(),
      change: "Last 30 days",
      icon: <LockOpen sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "info.main",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        currentView="security"
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
                <Security sx={{ color: colors.neutral.white, fontSize: 28 }} />
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
                  Security Personnel
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Security Staff Management
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Search */}
              <TextField
                size="small"
                placeholder="Search personnel..."
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

              {/* Add Personnel Button */}
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={handleAddPersonnel}
                sx={{
                  backgroundColor: colors.primary.main,
                  "&:hover": { backgroundColor: colors.primary.hover },
                  px: 3,
                  py: 1,
                }}
              >
                Add Personnel
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
                    Security Personnel
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                    Manage and monitor all security personnel in the Smart Access Control System
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
                  <Security sx={{ fontSize: "3rem" }} />
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

            {/* Security Personnel Table */}
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
                            Personnel Details
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Employment Info
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
                        {securityPersonnel.map((personnel, index) => (
                          <TableRow
                            key={personnel.security_id}
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
                                  {personnel.full_name?.charAt(0) || 'S'}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="600" color={colors.secondary.main}>
                                    {personnel.full_name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    ID: {personnel.employee_id}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <BadgeIcon sx={{ fontSize: 16, color: colors.primary.main }} />
                                  <Typography variant="body2" fontWeight="500">
                                    Badge: {personnel.badge_number}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Work sx={{ fontSize: 16, color: colors.secondary.main }} />
                                  <Typography variant="body2">
                                    Hired: {formatDate(personnel.hire_date)}
                                  </Typography>
                                </Box>
                                {personnel.termination_date && (
                                  <Typography variant="caption" color="error.main" fontWeight="500">
                                    Terminated: {formatDate(personnel.termination_date)}
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Stack spacing={1}>
                                {personnel.phone_number && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Phone sx={{ fontSize: 16, color: colors.primary.main }} />
                                    <Typography variant="body2">{personnel.phone_number}</Typography>
                                  </Box>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                  Security ID: {personnel.security_id.slice(0, 8)}...
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={getStatusLabel(personnel.is_active, !!personnel.termination_date)}
                                color={getStatusColor(personnel.is_active, !!personnel.termination_date)}
                                size="small"
                                variant={personnel.is_active && !personnel.termination_date ? 'filled' : 'outlined'}
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>

                            <TableCell>
                              <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2">
                                    {formatDate(personnel.created_at)}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="info.main" fontWeight="500">
                                  Updated: {formatDate(personnel.updated_at)}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewPersonnel(personnel.security_id)}
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
                                <Tooltip title="Manage Personnel">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleManagePersonnel(personnel.security_id)}
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

export default ViewSecurity;