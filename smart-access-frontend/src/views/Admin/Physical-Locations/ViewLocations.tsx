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
  Add,
  Edit,
  Delete,
  Refresh,
  Visibility,
  LocationOn,
  Business,
  Security,
  CalendarToday,
  Domain,
  Room,
  Info,
  Menu as MenuIcon,
  RestoreFromTrash,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';
import AdminService, { PhysicalLocation, PhysicalLocationFilters } from '../../../service/AdminService';
import AdminSidebar from '../shared/AdminSidebar';
import AuthService from '../../../service/AuthService';

const ViewLocations: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<PhysicalLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'campus' | 'building' | 'floor' | 'room' | 'gate' | 'area'>('all');
  const [restrictionFilter, setRestrictionFilter] = useState<'all' | 'restricted' | 'unrestricted'>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Statistics state
  const [stats, setStats] = useState({
    total_locations: 0,
    restricted_locations: 0,
    campus_count: 0,
    building_count: 0,
    room_count: 0,
    gate_count: 0
  });

  const username = AuthService.getUsername();

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: PhysicalLocationFilters = {
        page: page + 1,
        page_size: rowsPerPage,
        search: searchTerm || undefined,
        location_type: typeFilter === 'all' ? undefined : typeFilter,
        is_restricted: restrictionFilter === 'all' ? undefined : restrictionFilter === 'restricted'
      };

      const response = await AdminService.listPhysicalLocations(filters);
      setLocations(response.results);
      setTotalCount(response.count);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const allLocations = await AdminService.getAllPhysicalLocations();
      const statsData = {
        total_locations: allLocations.length,
        restricted_locations: allLocations.filter(loc => loc.is_restricted).length,
        campus_count: allLocations.filter(loc => loc.location_type === 'campus').length,
        building_count: allLocations.filter(loc => loc.location_type === 'building').length,
        room_count: allLocations.filter(loc => loc.location_type === 'room').length,
        gate_count: allLocations.filter(loc => loc.location_type === 'gate').length,
      };
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchStats();
  }, [page, rowsPerPage, searchTerm, typeFilter, restrictionFilter]);

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

  const handleRestrictionFilterChange = (event: any) => {
    setRestrictionFilter(event.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    fetchLocations();
    fetchStats();
  };

  const handleEditLocation = (locationId: string) => {
    navigate(`/admin-dashboard/locations/edit/${locationId}`);
  };

  const handleViewLocation = (locationId: string) => {
    navigate(`/admin-dashboard/locations/view/${locationId}`);
  };

  const handleDeleteLocation = async (locationId: string, locationName: string) => {
    if (window.confirm(`Are you sure you want to delete "${locationName}"? This action can be undone.`)) {
      try {
        await AdminService.deletePhysicalLocation(locationId);
        showSnackbar(`Location "${locationName}" deleted successfully`, 'success');
        fetchLocations();
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

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'campus': return <Domain sx={{ fontSize: 16, color: colors.primary.main }} />;
      case 'building': return <Business sx={{ fontSize: 16, color: colors.secondary.main }} />;
      case 'floor': return <LocationOn sx={{ fontSize: 16, color: colors.primary.main }} />;
      case 'room': return <Room sx={{ fontSize: 16, color: colors.secondary.main }} />;
      case 'gate': return <Security sx={{ fontSize: 16, color: colors.primary.main }} />;
      case 'area': return <LocationOn sx={{ fontSize: 16, color: colors.secondary.main }} />;
      default: return <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />;
    }
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case 'campus': return 'primary';
      case 'building': return 'secondary';
      case 'floor': return 'info';
      case 'room': return 'success';
      case 'gate': return 'warning';
      case 'area': return 'default';
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
      case "locations":
        navigate('/admin-dashboard/locations');
        break;
      case "access-control":
        navigate('/admin-dashboard/access-control');
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
      title: "Total Locations",
      value: stats.total_locations.toString(),
      change: `${stats.total_locations} registered`,
      icon: <LocationOn sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "Restricted Areas",
      value: stats.restricted_locations.toString(),
      change: `${Math.round((stats.restricted_locations / stats.total_locations) * 100) || 0}% of total`,
      icon: <Security sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: stats.restricted_locations > 0 ? "warning.main" : "success.main",
    },
    {
      title: "Campus & Buildings",
      value: (stats.campus_count + stats.building_count).toString(),
      change: `${stats.campus_count} campuses, ${stats.building_count} buildings`,
      icon: <Business sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "Rooms & Gates",
      value: (stats.room_count + stats.gate_count).toString(),
      change: `${stats.room_count} rooms, ${stats.gate_count} gates`,
      icon: <Room sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "success.main",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        currentView="locations"
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
                <LocationOn sx={{ color: colors.neutral.white, fontSize: 28 }} />
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
                  Physical Locations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage Campus Infrastructure
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Search */}
              <TextField
                size="small"
                placeholder="Search locations..."
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

              {/* Add Location Button */}
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/admin-dashboard/locations/create')}
                sx={{
                  backgroundColor: colors.primary.main,
                  "&:hover": { backgroundColor: colors.primary.hover },
                  px: 3,
                  py: 1,
                }}
              >
                Add Location
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
                    Physical Locations
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                    Manage and organize all physical locations in your Smart Access Control System
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
                  <LocationOn sx={{ fontSize: "3rem" }} />
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
                  <InputLabel>Location Type</InputLabel>
                  <Select
                    value={typeFilter}
                    label="Location Type"
                    onChange={handleTypeFilterChange}
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary.main,
                      },
                    }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="campus">Campus</MenuItem>
                    <MenuItem value="building">Building</MenuItem>
                    <MenuItem value="floor">Floor</MenuItem>
                    <MenuItem value="room">Room</MenuItem>
                    <MenuItem value="gate">Gate</MenuItem>
                    <MenuItem value="area">Area</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Access Level</InputLabel>
                  <Select
                    value={restrictionFilter}
                    label="Access Level"
                    onChange={handleRestrictionFilterChange}
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary.main,
                      },
                    }}
                  >
                    <MenuItem value="all">All Levels</MenuItem>
                    <MenuItem value="restricted">Restricted</MenuItem>
                    <MenuItem value="unrestricted">Unrestricted</MenuItem>
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

            {/* Locations Table */}
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
                            Location Details
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Type & Access
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Description
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Created
                          </TableCell>
                          <TableCell sx={{ color: colors.neutral.white, fontWeight: 'bold', fontSize: '0.95rem' }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {locations.map((location, index) => (
                          <TableRow
                            key={location.location_id}
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
                                  {getLocationTypeIcon(location.location_type)}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="600" color={colors.secondary.main}>
                                    {location.location_name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    ID: {location.location_id.slice(-8).toUpperCase()}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {getLocationTypeIcon(location.location_type)}
                                  <Chip
                                    label={location.location_type.toUpperCase()}
                                    color={getLocationTypeColor(location.location_type) as any}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 500 }}
                                  />
                                </Box>
                                <Chip
                                  label={location.is_restricted ? 'RESTRICTED' : 'UNRESTRICTED'}
                                  color={location.is_restricted ? 'error' : 'success'}
                                  size="small"
                                  variant={location.is_restricted ? 'filled' : 'outlined'}
                                  sx={{ fontWeight: 500 }}
                                />
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Typography variant="body2" color="text.primary">
                                {location.description || 'No description provided'}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  {formatDate(location.created_at)}
                                </Typography>
                              </Box>
                              {location.updated_at !== location.created_at && (
                                <Typography variant="caption" color="info.main" fontWeight="500">
                                  Updated: {formatDate(location.updated_at)}
                                </Typography>
                              )}
                            </TableCell>

                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewLocation(location.location_id)}
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
                                <Tooltip title="Edit Location">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditLocation(location.location_id)}
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
                                <Tooltip title="Delete Location">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteLocation(location.location_id, location.location_name)}
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

export default ViewLocations;