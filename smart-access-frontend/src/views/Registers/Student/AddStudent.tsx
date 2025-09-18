import React, { useState } from 'react';
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
import StudentService, { CreateStudentRequest } from '../../../service/StudentService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

interface AddStudentProps {
  onBack?: () => void;
}

const AddStudent: React.FC<AddStudentProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form data state - matching API documentation
  const [formData, setFormData] = useState<CreateStudentRequest>({
    surname: '',
    first_name: '',
    middle_name: '',
    mobile_phone: '',
    registration_number: '',
    department: '',
    soma_class_code: '',
    academic_year_status: 'Continuing',
    student_status: 'Enrolled',
  });

  const academicStatuses = ['Continuing', 'Retake', 'Deferred', 'Probation', 'Completed'];
  const studentStatuses = ['Enrolled', 'Withdrawn', 'Suspended'];

  const handleInputChange = (field: keyof CreateStudentRequest) => (
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

  const handleSelectChange = (field: keyof CreateStudentRequest) => (event: any) => {
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
    if (!formData.registration_number.trim()) return 'Registration number is required';
    if (!formData.department.trim()) return 'Department is required';

    // Removed mobile phone validation - no restrictions

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
      const cleanedData: CreateStudentRequest = {
        surname: formData.surname.trim(),
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name?.trim() || undefined,
        mobile_phone: formData.mobile_phone?.trim() || undefined,
        registration_number: formData.registration_number.trim(),
        department: formData.department.trim(),
        soma_class_code: formData.soma_class_code?.trim() || undefined,
        academic_year_status: formData.academic_year_status,
        student_status: formData.student_status,
      };

      const newStudent = await StudentService.createStudent(cleanedData);
      
      setSuccess(`Student "${newStudent.first_name} ${newStudent.surname}" has been successfully created with registration number: ${newStudent.registration_number}`);
      
      // Clear form after successful submission
      setTimeout(() => {
        handleClear();
      }, 3000);

    } catch (error: any) {
      setError(error.message || 'Failed to create student. Please try again.');
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
      registration_number: '',
      department: '',
      soma_class_code: '',
      academic_year_status: 'Continuing',
      student_status: 'Enrolled',
    });
    setError(null);
    setSuccess(null);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/registers-dashboard');
    }
  };

  const handleSidebarNavigation = (view: string) => {
    if (view === 'dashboard') {
      navigate('/registers-dashboard');
    } else {
      navigate(`/register-dashboard/${view}`);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <RegisterSidebar 
        collapsed={sidebarCollapsed} 
        currentView="add-student"
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
              Add New Student
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Register a new student into the system
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
                Student Information
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
                  placeholder="Enter student's surname"
                  inputProps={{ maxLength: 100 }}
                />
                <TextField
                  label="First Name *"
                  value={formData.first_name}
                  onChange={handleInputChange('first_name')}
                  sx={{ flex: '1 1 250px', minWidth: '200px' }}
                  disabled={loading}
                  placeholder="Enter student's first name"
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
                  helperText="Any format accepted"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Academic Information Section */}
              <Typography variant="h6" sx={{ mb: 2, color: colors.secondary.main, fontWeight: 600 }}>
                Academic Information
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                  label="Registration Number *"
                  value={formData.registration_number}
                  onChange={handleInputChange('registration_number')}
                  sx={{ flex: '1 1 250px', minWidth: '200px' }}
                  disabled={loading}
                  placeholder="Enter registration number"
                />
                <TextField
                  label="Department *"
                  value={formData.department}
                  onChange={handleInputChange('department')}
                  sx={{ flex: '1 1 250px', minWidth: '200px' }}
                  disabled={loading}
                  placeholder="Enter department name"
                  helperText="e.g., Computer Science, Engineering"
                  inputProps={{ maxLength: 255 }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                  label="SOMA Class Code"
                  value={formData.soma_class_code}
                  onChange={handleInputChange('soma_class_code')}
                  sx={{ flex: '1 1 250px', minWidth: '200px' }}
                  disabled={loading}
                  placeholder="Enter SOMA class code (optional)"
                />
                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }} />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <FormControl sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                  <InputLabel>Academic Year Status</InputLabel>
                  <Select
                    value={formData.academic_year_status}
                    onChange={handleSelectChange('academic_year_status')}
                    label="Academic Year Status"
                    disabled={loading}
                  >
                    {academicStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                  <InputLabel>Student Status</InputLabel>
                  <Select
                    value={formData.student_status}
                    onChange={handleSelectChange('student_status')}
                    label="Student Status"
                    disabled={loading}
                  >
                    {studentStatuses.map((status) => (
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
                  • Required fields: Surname, First Name, Registration Number, Department
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • Optional fields: Middle Name, Mobile Phone, SOMA Class Code, Academic/Student Status
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  • Registration numbers must be unique across all students
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
                  {loading ? 'Creating Student...' : 'Create Student'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AddStudent;