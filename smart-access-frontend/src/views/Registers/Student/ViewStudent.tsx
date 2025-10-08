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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StudentService, { Student, StudentFilters } from '../../../service/StudentService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

const ViewStudent: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]); // Initialize as empty array
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Filter state - updated to match API documentation
  const [filters, setFilters] = useState<StudentFilters>({
    search: '',
    department: '',
    academic_year_status: undefined,
    student_status: undefined,
    is_active: undefined,
    ordering: '-created_at'
  });

  // Dropdown data - removed programs since it's not in API
  const [departments, setDepartments] = useState<string[]>([]);

  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    student: Student | null;
  }>({ open: false, student: null });

  const academicStatuses = ['Continuing', 'Retake', 'Deferred', 'Probation', 'Completed'];
  const studentStatuses = ['Enrolled', 'Withdrawn', 'Suspended'];

  useEffect(() => {
    loadStudents();
    loadDepartments();
  }, [page, filters]);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key as keyof StudentFilters] = value;
        }
        return acc;
      }, {} as StudentFilters);

      const response = await StudentService.listStudents({
        ...cleanFilters,
        page,
        page_size: pageSize,
      });

      console.log('Raw API response:', response); // Debug logging

      // Handle different response formats - remove the data property check
      if (Array.isArray(response)) {
        // Direct array response (non-paginated)
        console.log('Received direct array response');
        setStudents(response);
        setTotalCount(response.length);
      } else if (response && response.results && Array.isArray(response.results)) {
        // Paginated response with results array
        console.log('Received paginated response');
        setStudents(response.results);
        setTotalCount(response.count || 0);
      } else {
        console.error('Unexpected response structure:', response);
        setStudents([]);
        setTotalCount(0);
        setError('Unexpected response format from server.');
      }
    } catch (error: any) {
      console.error('Error loading students:', error);
      setError(error.message || 'Failed to load students');
      setStudents([]); // Ensure students is always an array
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const depts = await StudentService.getDepartments();
      if (Array.isArray(depts)) {
        setDepartments(depts);
      } else {
        console.error('Invalid departments response:', depts);
        setDepartments([]);
      }
    } catch (error) {
      console.error('Failed to load departments:', error);
      setDepartments([]); // Ensure departments is always an array
    }
  };

  const handleFilterChange = (field: keyof StudentFilters) => (
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
      academic_year_status: undefined,
      student_status: undefined,
      is_active: undefined,
      ordering: '-created_at'
    });
    setPage(1);
  };

  const handleDeleteStudent = async (student: Student) => {
    try {
      await StudentService.deleteStudent(student.student_uuid);
      setDeleteDialog({ open: false, student: null });
      loadStudents(); // Refresh the list
    } catch (error: any) {
      setError(error.message || 'Failed to delete student');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Enrolled':
        return 'success';
      case 'Withdrawn':
        return 'error';
      case 'Suspended':
        return 'warning';
      case 'Continuing':
        return 'primary';
      case 'Retake':
        return 'warning';
      case 'Deferred':
        return 'info';
      case 'Probation':
        return 'error';
      case 'Completed':
        return 'success';
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
  const safeStudents = Array.isArray(students) ? students : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <RegisterSidebar 
        collapsed={sidebarCollapsed} 
        currentView="manage-students"
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
              Manage Students
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              View and manage student records
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={loadStudents}
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
                Search & Filter Students
              </Typography>
            </Box>

            {/* Search Bar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search by name or registration number..."
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

            {/* Advanced Filters - removed program filter */}
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
                  <InputLabel>Student Status</InputLabel>
                  <Select
                    value={filters.student_status || ''}
                    onChange={handleFilterChange('student_status')}
                    label="Student Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {studentStatuses.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <InputLabel>Academic Status</InputLabel>
                  <Select
                    value={filters.academic_year_status || ''}
                    onChange={handleFilterChange('academic_year_status')}
                    label="Academic Status"
                  >
                    <MenuItem value="">All Academic Statuses</MenuItem>
                    {academicStatuses.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <InputLabel>Status</InputLabel>
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
                    label="Status"
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
            Showing {safeStudents.length} of {totalCount} students
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Page {page} of {Math.ceil(totalCount / pageSize) || 1}
          </Typography>
        </Box>

        {/* Students Table - removed Program column */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Registration No.</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Mobile Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Student Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Academic Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Active</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2 }}>Loading students...</Typography>
                    </TableCell>
                  </TableRow>
                ) : safeStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {error ? 'Failed to load students. Please try refreshing.' : 'No students found matching your criteria'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  safeStudents.map((student) => (
                    <TableRow key={student.student_uuid} hover>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {student.registration_number}
                      </TableCell>
                      <TableCell>
                        {`${student.first_name} ${student.middle_name ? student.middle_name + ' ' : ''}${student.surname}`}
                      </TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{student.mobile_phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={student.student_status}
                          color={getStatusColor(student.student_status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.academic_year_status}
                          color={getStatusColor(student.academic_year_status) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.is_active ? 'Active' : 'Inactive'}
                          color={student.is_active ? 'success' : 'error'}
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
                              navigate(`/register-dashboard/student-details/${student.student_uuid}`);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: colors.secondary.main }}
                            title="Edit Student"
                            onClick={() => {
                              // Navigate to edit student view
                              console.log('Edit student:', student.student_uuid);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: '#d32f2f' }}
                            title="Delete Student"
                            onClick={() => setDeleteDialog({ open: true, student })}
                          >
                            <Delete />
                          </IconButton>
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
          onClose={() => setDeleteDialog({ open: false, student: null })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the student "{deleteDialog.student?.first_name} {deleteDialog.student?.surname}" 
              (Registration: {deleteDialog.student?.registration_number})?
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: colors.text.secondary }}>
              This action will soft-delete the student and can be restored later by administrators.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialog({ open: false, student: null })}
              sx={{ color: colors.secondary.main }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteDialog.student && handleDeleteStudent(deleteDialog.student)}
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

export default ViewStudent;