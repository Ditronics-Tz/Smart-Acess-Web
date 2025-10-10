import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  PersonAdd,
  Save,
  Clear,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import staffService, { CreateStaffRequest } from '../../../service/StaffService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

interface AddStaffProps {
  onBack?: () => void;
}

const AddStaff: React.FC<AddStaffProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [employmentStatusOptions, setEmploymentStatusOptions] = useState<string[]>([]);

  // Position options for academic and administrative roles
  const positionOptions = [
    
    'Senior Lecturer',
    'Lecturer',
    'Assistant Lecturer',
    'Tutorial Assistant',
    'Research Assistant',
    'Teaching Assistant',
    
    // Administrative Positions
    'Dean',
    'Head of Department',
    'Program Coordinator',
    'Academic Registrar',
    'Student Affairs Officer',
    
    // Support Staff
    'Accountant',
    'ICT Officer',
    'Systems Administrator',
    'Network Administrator',
    'IT Support Specialist',
    'Librarian',
    'Library Assistant',
    'Administrative Assistant',
    'Secretary',
    'Receptionist',
    
    // Other Roles
    'Security Officer',
    'Maintenance Technician',
    'Driver',
    'Cleaner',
    'Gardener'
  ];

  // Department options for academic departments
  const departmentOptions = [
    // Engineering & Technology
    'Computer Engineering',
    'Electronics Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    
    // Sciences
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Information Technology',
    
    // Social Sciences & Humanities
    'General Studies',
    'Business Administration',
    'Economics',
    
    
    // Health Sciences
    'Nursing',
    'Pharmacy',
    'Medical Laboratory Sciences',
    'Public Health',
    

  ];

  // Form data state - matching API documentation
  const [formData, setFormData] = useState<CreateStaffRequest>({
    surname: '',
    first_name: '',
    middle_name: '',
    mobile_phone: '',
    staff_number: '',
    department: '',
    position: '',
    employment_status: 'Active',
  });

  useEffect(() => {
    loadEmploymentStatusOptions();
  }, []);

  const loadEmploymentStatusOptions = async () => {
    try {
      const options = await staffService.getEmploymentStatusOptions();
      setEmploymentStatusOptions(options);
    } catch (error) {
      console.error('Failed to load employment status options:', error);
      // Fallback to default options
      setEmploymentStatusOptions(['Active', 'Inactive', 'Terminated', 'Retired', 'On Leave']);
    }
  };

  const handleInputChange = (field: keyof CreateStaffRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSelectChange = (field: keyof CreateStaffRequest) => (event: any) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): string | null => {
    // Required fields based on API documentation
    if (!formData.surname.trim()) return 'Surname is required';
    if (!formData.first_name.trim()) return 'First name is required';
    if (!formData.staff_number.trim()) return 'Staff number is required';
    if (!formData.department.trim()) return 'Department is required';
    if (!formData.position.trim()) return 'Position is required';

    // Validate mobile phone if provided
    if (formData.mobile_phone && formData.mobile_phone.length > 15) {
      return 'Mobile phone number must not exceed 15 characters';
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Clean up form data - only include fields from API documentation
      const cleanedData: CreateStaffRequest = {
        surname: formData.surname.trim(),
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name?.trim() || undefined,
        mobile_phone: formData.mobile_phone?.trim() || undefined,
        staff_number: formData.staff_number.trim(),
        department: formData.department.trim(),
        position: formData.position.trim(),
        employment_status: formData.employment_status,
      };

      const newStaff = await staffService.createStaff(cleanedData);
      
      setSuccess(`Staff member "${newStaff.first_name} ${newStaff.surname}" has been successfully created with staff number: ${newStaff.staff_number}`);
      
      // Clear form after successful submission
      setTimeout(() => {
        handleClear();
      }, 3000);

    } catch (error: any) {
      setError(error.message || 'Failed to create staff member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      surname: '',
      first_name: '',
      middle_name: '',
      mobile_phone: '',
      staff_number: '',
      department: '',
      position: '',
      employment_status: 'Active',
    });
    setError(null);
    setSuccess(null);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/register-dashboard');
    }
  };

  const handleSidebarNavigation = (view: string) => {
    if (view === 'dashboard') {
      navigate('/register-dashboard');
    } else {
      navigate(`/register-dashboard/${view}`);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <RegisterSidebar 
        collapsed={sidebarCollapsed} 
        currentView="add-staff"
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
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
              Add New Staff Member
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Register a new staff member into the system
            </Typography>
          </Box>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Form Card */}
        <Card sx={{ maxWidth: '800px' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <PersonAdd sx={{ fontSize: 28, color: colors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                Staff Information
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <Typography variant="h6" sx={{ mb: 2, color: colors.secondary.main, fontWeight: 600 }}>
                Personal Information
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                  label="Surname *"
                  value={formData.surname}
                  onChange={handleInputChange('surname')}
                  sx={{ flex: '1 1 250px', minWidth: '200px' }}
                  disabled={loading}
                  placeholder="Enter staff member's surname"
                  inputProps={{ maxLength: 100 }}
                />
                <TextField
                  label="First Name *"
                  value={formData.first_name}
                  onChange={handleInputChange('first_name')}
                  sx={{ flex: '1 1 250px', minWidth: '200px' }}
                  disabled={loading}
                  placeholder="Enter staff member's first name"
                  inputProps={{ maxLength: 100 }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                  label="Middle Name"
                  value={formData.middle_name}
                  onChange={handleInputChange('middle_name')}
                  sx={{ flex: '1 1 250px', minWidth: '200px' }}
                  disabled={loading}
                  placeholder="Enter middle name (optional)"
                  inputProps={{ maxLength: 100 }}
                />
                <TextField
                  label="Mobile Phone"
                  value={formData.mobile_phone}
                  onChange={handleInputChange('mobile_phone')}
                  sx={{ flex: '1 1 250px', minWidth: '200px' }}
                  disabled={loading}
                  placeholder="Enter mobile phone number (optional)"
                  helperText="Maximum 15 characters"
                  inputProps={{ maxLength: 15 }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Employment Information Section */}
              <Typography variant="h6" sx={{ mb: 2, color: colors.secondary.main, fontWeight: 600 }}>
                Employment Information
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                  label="Staff Number *"
                  value={formData.staff_number}
                  onChange={handleInputChange('staff_number')}
                  sx={{ flex: '1 1 250px', minWidth: '200px' }}
                  disabled={loading}
                  placeholder="Enter unique staff number"
                  helperText="Must be unique across all staff"
                  inputProps={{ maxLength: 20 }}
                />
                <FormControl sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                  <InputLabel>Department *</InputLabel>
                  <Select
                    value={formData.department}
                    onChange={handleSelectChange('department')}
                    label="Department *"
                    disabled={loading}
                  >
                    {departmentOptions.map((department) => (
                      <MenuItem key={department} value={department}>
                        {department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <FormControl sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                  <InputLabel>Position *</InputLabel>
                  <Select
                    value={formData.position}
                    onChange={handleSelectChange('position')}
                    label="Position *"
                    disabled={loading}
                  >
                    {positionOptions.map((position) => (
                      <MenuItem key={position} value={position}>
                        {position}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                  <InputLabel>Employment Status</InputLabel>
                  <Select
                    value={formData.employment_status}
                    onChange={handleSelectChange('employment_status')}
                    label="Employment Status"
                    disabled={loading}
                  >
                    {employmentStatusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Form Instructions */}
              <Box sx={{ 
                backgroundColor: '#f0f8ff', 
                border: '1px solid #e3f2fd', 
                borderRadius: '8px', 
                p: 2, 
                mb: 3 
              }}>
                <Typography variant="body2" sx={{ color: colors.secondary.main, fontWeight: 500, mb: 1 }}>
                  📋 Form Instructions (Based on API Documentation):
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • Required fields: Surname, First Name, Staff Number, Department, Position
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • Optional fields: Middle Name, Mobile Phone, Employment Status
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • Department: Select from predefined academic and administrative departments
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • Position: Select from predefined academic and administrative roles
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  • Staff numbers must be unique across all staff members
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  disabled={loading}
                  startIcon={<Clear />}
                  sx={{ 
                    borderColor: colors.secondary.main,
                    color: colors.secondary.main,
                    '&:hover': {
                      borderColor: colors.secondary.dark,
                      backgroundColor: 'rgba(16, 37, 66, 0.04)'
                    }
                  }}
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  sx={{ 
                    backgroundColor: colors.primary.main,
                    '&:hover': { backgroundColor: colors.primary.hover },
                    px: 3
                  }}
                >
                  {loading ? 'Creating Staff...' : 'Create Staff Member'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AddStaff;