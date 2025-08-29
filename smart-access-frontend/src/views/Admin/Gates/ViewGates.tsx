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
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Refresh,
  Visibility,
  DoorFront,
  LocationOn,
  Computer,
  CalendarToday,
  PowerSettingsNew,
  Emergency,
  Menu as MenuIcon,
  Router,
  Settings,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import AdminService, { AccessGate, AccessGateFilters } from '../../../service/AdminService';
import AdminSidebar from '../shared/AdminSidebar';
import AuthService from '../../../service/AuthService';

const ViewGates: React.FC = () => {
  const navigate = useNavigate();
  const [gates, setGates] = useState<AccessGate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'entry' | 'exit' | 'bidirectional'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'maintenance' | 'error'>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Statistics state
  const [stats, setStats] = useState({
    total_gates: 0,
    active_gates: 0,
    inactive_gates: 0,
    maintenance_gates: 0,
    error_gates: 0,
    entry_gates: 0,
    exit_gates: 0,
    bidirectional_gates: 0
  });

  const username = AuthService.getUsername();

  const fetchGates = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: AccessGateFilters = {
        page: page + 1,
        page_size: rowsPerPage,
        search: searchTerm || undefined,
        gate_type: typeFilter === 'all' ? undefined : typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter
      };

      const response = await AdminService.listAccessGates(filters);
      setGates(response.results);
      setTotalCount(response.count);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const allGates = await AdminService.listAccessGates({ page_size: 1000 });
      const gatesList = allGates.results;
      
      const statsData = {
        total_gates: gatesList.length,
        active_gates: gatesList.filter(gate => gate.status === 'active').length,
        inactive_gates: gatesList.filter(gate => gate.status === 'inactive').length,
        maintenance_gates: gatesList.filter(gate => gate.status === 'maintenance').length,
        error_gates: gatesList.filter(gate => gate.status === 'error').length,
        entry_gates: gatesList.filter(gate => gate.gate_type === 'entry').length,
        exit_gates: gatesList.filter(gate => gate.gate_type === 'exit').length,
        bidirectional_gates: gatesList.filter(gate => gate.gate_type === 'bidirectional').length
      };
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchGates();
    fetchStats();
  }, [page, rowsPerPage, searchTerm, typeFilter, statusFilter]);

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

  const handleTypeFilterChange = (event: any) => {
    setTypeFilter(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    fetchGates();
    fetchStats();
  };

  const handleEditGate = (gateId: string) => {
    navigate(`/admin-dashboard/gates/edit/${gateId}`);
  };

  const handleViewGate = (gateId: string) => {
    navigate(`/admin-dashboard/gates/view/${gateId}`);
  };

  const handleDeleteGate = async (gateId: string, gateName: string) => {
    if (window.confirm(`Are you sure you want to delete "${gateName}"? This action can be undone.`)) {
      try {
        await AdminService.deleteAccessGate(gateId);
        showSnackbar(`Gate "${gateName}" deleted successfully`, 'success');
        fetchGates();
        fetchStats();
      } catch (err: any) {
        showSnackbar(err.message, 'error');
      }
    }
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

  const getGateTypeIcon = (type: string) => {
    switch (type) {
      case 'entry': return <DoorFront sx={{ fontSize: 16, color: colors.primary.main }} />;
      case 'exit': return <DoorFront sx={{ fontSize: 16, color: colors.secondary.main, transform: 'scaleX(-1)' }} />;
      case 'bidirectional': return <Router sx={{ fontSize: 16, color: colors.primary.main }} />;
      default: return <DoorFront sx={{ fontSize: 16, color: 'text.secondary' }} />;
    }
  };

  const getGateTypeColor = (type: string) => {
    switch (type) {
      case 'entry': return 'success';
      case 'exit': return 'warning';
      case 'bidirectional': return 'primary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'maintenance': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
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
      case "locations":
        navigate('/admin-dashboard/locations');
        break;
      case "access-gates":
        navigate('/admin-dashboard/gates');
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
      title: "Total Gates",
      value: stats.total_gates.toString(),
      change: `${stats.total_gates} registered`,
      icon: <DoorFront sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "Active Gates",
      value: stats.active_gates.toString(),
      change: `${Math.round((stats.active_gates / stats.total_gates) * 100) || 0}% operational`,
      icon: <PowerSettingsNew sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "Maintenance & Issues",
      value: (stats.maintenance_gates + stats.error_gates).toString(),
      change: `${stats.maintenance_gates} maintenance, ${stats.error_gates} errors`,
      icon: <Settings sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: (stats.maintenance_gates + stats.error_gates) > 0 ? "warning.main" : "success.main",
    },
    {
      title: "Gate Types",
      value: stats.bidirectional_gates.toString(),
      change: `${stats.entry_gates} entry, ${stats.exit_gates} exit, ${stats.bidirectional_gates} bi-dir`,
      icon: <Router sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "success.main",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        currentView="access-gates"
        onNavigate={handleSidebarNavigation}
      />

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        ml: sidebarCollapsed ? "64px" : "280px",
        transition: "margin-left 0.3s ease",
        minHeight: "100vh", 
        backgroundColor: "#f5f5f5"
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
                <DoorFront sx={{ color: colors.neutral.white, fontSize: 28 }} />
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
                  Access Gates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gate Hardware Management
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Search */}
              <TextField
                size="small"
                placeholder="Search gates..."
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

              {/* Add Gate Button */}
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/admin-dashboard/gates/create')}
                sx={{
                  backgroundColor: colors.primary.main,
                  "&:hover": { backgroundColor: colors.primary.hover },
                  px: 3,
                  py: 1,
                }}
              >
                Add Gate
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
                    Access Gates
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                    Monitor and manage all access gate hardware in your Smart Access Control System
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
                  <DoorFront sx={{ fontSize: "3rem" }} />
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
                  <InputLabel>Gate Type</InputLabel>
                  <Select
                    value={typeFilter}
                    label="Gate Type"
                    onChange={handleTypeFilterChange}
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary.main,
                      },
                    }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="entry">Entry</MenuItem>
                    <MenuItem value="exit">Exit</MenuItem>
                    <MenuItem value="bidirectional">Bidirectional</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusFilterChange}
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary.main,
                      },
                    }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
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

            {/* Gates Table */}
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
                            Gate Details
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Type & Status
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Hardware Info
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Location
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Features
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {gates.map((gate, index) => (
                          <TableRow
                            key={gate.gate_id}
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
                                  {getGateTypeIcon(gate.gate_type)}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="600" color={colors.secondary.main}>
                                    {gate.gate_name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Code: {gate.gate_code}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {getGateTypeIcon(gate.gate_type)}
                                  <Chip
                                    label={gate.gate_type.toUpperCase()}
                                    color={getGateTypeColor(gate.gate_type) as any}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 500 }}
                                  />
                                </Box>
                                <Chip
                                  label={gate.status.toUpperCase()}
                                  color={getStatusColor(gate.status) as any}
                                  size="small"
                                  variant={gate.status === 'active' ? 'filled' : 'outlined'}
                                  sx={{ fontWeight: 500 }}
                                />
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Computer sx={{ fontSize: 16, color: colors.primary.main }} />
                                  <Typography variant="body2">{gate.hardware_id}</Typography>
                                </Box>
                                {gate.ip_address && (
                                  <Typography variant="caption" color="text.secondary">
                                    IP: {gate.ip_address}
                                  </Typography>
                                )}
                                {gate.mac_address && (
                                  <Typography variant="caption" color="text.secondary">
                                    MAC: {gate.mac_address}
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn sx={{ fontSize: 16, color: colors.secondary.main }} />
                                <Box>
                                  <Typography variant="body2" fontWeight="500">
                                    {gate.location_name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {gate.location_type}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Stack spacing={0.5}>
                                {gate.emergency_override_enabled && (
                                  <Chip
                                    label="Emergency Override"
                                    icon={<Emergency />}
                                    size="small"
                                    color="warning"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                )}
                                {gate.backup_power_available && (
                                  <Chip
                                    label="Backup Power"
                                    icon={<PowerSettingsNew />}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                )}
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewGate(gate.gate_id)}
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
                                <Tooltip title="Edit Gate">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditGate(gate.gate_id)}
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
                                <Tooltip title="Delete Gate">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteGate(gate.gate_id, gate.gate_name)}
                                    sx={{ 
                                      color: 'error.main',
                                      "&:hover": { 
                                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <Delete />
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

export default ViewGates;