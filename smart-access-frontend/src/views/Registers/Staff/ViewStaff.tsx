import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Edit,
  Delete,
  Refresh,
  PersonSearch,
  ArrowBack,
  PhotoCamera,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import staffService, { Staff, StaffListParams } from '../../../service/StaffService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

const ViewStaff: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]); // Initialize as empty array
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [userPermissions, setUserPermissions] = useState<any>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Filter state - updated to match API documentation
  const [filters, setFilters] = useState<StaffListParams>({
    search: '',
    department: '',
    employment_status: undefined,
    is_active: undefined,
    ordering: '-created_at'
  });

  // Dropdown data
  const [departments, setDepartments] = useState<string[]>([]);
  const [employmentStatuses, setEmploymentStatuses] = useState<string[]>([]);

  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    staff: Staff | null;
  }>({ open: false, staff: null });

  useEffect(() => {
    loadStaff();
    loadEmploymentStatuses();
  }, [page, filters]);

  const loadStaff = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key as keyof StaffListParams] = value;
        }
        return acc;
      }, {} as StaffListParams);

      const response = await staffService.getStaffList({
        ...cleanFilters,
        page,
        page_size: pageSize,
      });

      console.log('Raw API response:', response); // Debug logging

      // Handle response based on API documentation structure
      if (response && response.results && Array.isArray(response.results)) {
        // Paginated response with results array
        console.log('Received paginated response');
        setStaff(response.results);
        setTotalCount(response.count || 0);
        setUserPermissions(response.user_permissions);
      } else if (Array.isArray(response)) {
        // Direct array response (non-paginated)
        console.log('Received direct array response');
        setStaff(response);
        setTotalCount(response.length);
      } else {
        console.error('Unexpected response structure:', response);
        setStaff([]);
        setTotalCount(0);
        setError('Unexpected response format from server.');
      }
    } catch (error: any) {
      console.error('Error loading staff:', error);
      setError(error.message || 'Failed to load staff members');
      setStaff([]); // Ensure staff is always an array
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadEmploymentStatuses = async () => {
    try {
      const statuses = await staffService.getEmploymentStatusOptions();
      if (Array.isArray(statuses)) {
        setEmploymentStatuses(statuses);
      }
    } catch (error) {
      console.error('Failed to load employment statuses:', error);
      setEmploymentStatuses(['Active', 'Inactive', 'Terminated', 'Retired', 'On Leave']);
    }
  };

  // Extract unique departments from loaded staff
  useEffect(() => {
    if (staff && staff.length > 0) {
      const uniqueDepartments = [...new Set(staff.map(s => s.department))].sort();
      setDepartments(uniqueDepartments);
    }
  }, [staff]);

  const handleFilterChange = (field: keyof StaffListParams) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      search: value
    }));
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      department: '',
      employment_status: undefined,
      is_active: undefined,
      ordering: '-created_at'
    });
    setPage(1);
  };

  const handleDeleteStaff = async (staff: Staff) => {
    try {
      await staffService.deleteStaff(staff.staff_uuid);
      setDeleteDialog({ open: false, staff: null });
      loadStaff(); // Refresh the list
    } catch (error: any) {
      setError(error.message || 'Failed to delete staff member');
    }
  };

  const getEmploymentStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'warning';
      case 'Terminated':
        return 'error';
      case 'Retired':
        return 'info';
      case 'On Leave':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleSidebarNavigation = (view: string) => {
    if (view === 'dashboard') {
      navigate('/register-dashboard');
    } else {
      navigate(`/register-dashboard/${view}`);
    }
  };

  const handleBack = () => {
    navigate('/register-dashboard');
  };

  // Safe array for rendering - ensure we always have an array
  const safeStaff = Array.isArray(staff) ? staff : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];
  const safeEmploymentStatuses = Array.isArray(employmentStatuses) ? employmentStatuses : [];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <RegisterSidebar 
        collapsed={sidebarCollapsed} 
        currentView="manage-staff"
        onNavigate={handleSidebarNavigation}
      />

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        ml: sidebarCollapsed ? "64px" : "280px",
        transition: "margin-left 0.3s ease",
        minHeight: "100vh", 
        backgroundColor: "#f8f9fa",
        p: 3
      }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={handleBack}
            sx={{ 
              backgroundColor: colors.primary.main,
              color: colors.neutral.white,
              '&:hover': { backgroundColor: colors.primary.hover }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
              Manage Staff
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              View and manage staff member records
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={loadStaff}
            disabled={loading}
            sx={{ 
              backgroundColor: colors.primary.main,
              '&:hover': { backgroundColor: colors.primary.hover }
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Search and Filter Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <PersonSearch sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                Search & Filter Staff
              </Typography>
            </Box>

            {/* Search Bar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search by name, staff number, department, or position..."
                value={filters.search || ''}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: '1 1 300px', minWidth: '250px' }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ 
                  borderColor: colors.secondary.main,
                  color: colors.secondary.main
                }}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </Box>

            {/* Advanced Filters */}
            {showFilters && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filters.department || ''}
                    onChange={handleFilterChange('department')}
                    label="Department"
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {safeDepartments.map((dept) => (
                      <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <InputLabel>Employment Status</InputLabel>
                  <Select
                    value={filters.employment_status || ''}
                    onChange={handleFilterChange('employment_status')}
                    label="Employment Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {safeEmploymentStatuses.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <InputLabel>Active Status</InputLabel>
                  <Select
                    value={filters.is_active === undefined ? '' : filters.is_active.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters(prev => ({
                        ...prev,
                        is_active: value === '' ? undefined : value === 'true'
                      }));
                      setPage(1);
                    }}
                    label="Active Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="text"
                  onClick={clearFilters}
                  sx={{ color: colors.primary.main, alignSelf: 'center' }}
                >
                  Clear All Filters
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: colors.text.secondary }}>
            Showing {safeStaff.length} of {totalCount} staff members
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Page {page} of {Math.ceil(totalCount / pageSize) || 1}
          </Typography>
        </Box>

        {/* Staff Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Staff Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Mobile Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Employment Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Active</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2 }}>Loading staff...</Typography>
                    </TableCell>
                  </TableRow>
                ) : safeStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {error ? 'Failed to load staff. Please try refreshing.' : 'No staff members found matching your criteria'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  safeStaff.map((staffMember) => (
                    <TableRow key={staffMember.staff_uuid} hover>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {staffMember.staff_number}
                      </TableCell>
                      <TableCell>
                        {`${staffMember.first_name} ${staffMember.middle_name ? staffMember.middle_name + ' ' : ''}${staffMember.surname}`}
                      </TableCell>
                      <TableCell>{staffMember.department}</TableCell>
                      <TableCell>{staffMember.position}</TableCell>
                      <TableCell>{staffMember.mobile_phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={staffMember.employment_status}
                          color={getEmploymentStatusColor(staffMember.employment_status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={staffMember.is_active ? 'Active' : 'Inactive'}
                          color={staffMember.is_active ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            sx={{ color: colors.primary.main }}
                            title="View Details"
                            onClick={() => {
                              navigate(`/register-dashboard/staff-details/${staffMember.staff_uuid}`);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                          {userPermissions?.can_upload_photos && (
                            <IconButton
                              size="small"
                              sx={{ color: colors.accent.main }}
                              title="Upload Photo"
                              onClick={() => {
                                // Navigate to photo upload or open modal
                                console.log('Upload photo for:', staffMember.staff_uuid);
                              }}
                            >
                              <PhotoCamera />
                            </IconButton>
                          )}
                          {userPermissions?.can_modify && (
                            <IconButton
                              size="small"
                              sx={{ color: colors.secondary.main }}
                              title="Edit Staff"
                              onClick={() => {
                                // Navigate to edit staff view
                                console.log('Edit staff:', staffMember.staff_uuid);
                              }}
                            >
                              <Edit />
                            </IconButton>
                          )}
                          {userPermissions?.can_delete && (
                            <IconButton
                              size="small"
                              sx={{ color: '#d32f2f' }}
                              title="Delete Staff"
                              onClick={() => setDeleteDialog({ open: true, staff: staffMember })}
                            >
                              <Delete />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalCount > pageSize && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Pagination
                count={Math.ceil(totalCount / pageSize) || 1}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, staff: null })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the staff member "{deleteDialog.staff?.first_name} {deleteDialog.staff?.surname}" 
              (Staff Number: {deleteDialog.staff?.staff_number})?
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: colors.text.secondary }}>
              This action will permanently remove the staff member from the system.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialog({ open: false, staff: null })}
              sx={{ color: colors.secondary.main }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteDialog.staff && handleDeleteStaff(deleteDialog.staff)}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ViewStaff;