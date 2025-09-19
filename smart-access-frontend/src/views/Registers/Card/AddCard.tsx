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
  Switch,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';
import {
  ArrowBack,
  CreditCard,
  Save,
  Clear,
  PersonSearch,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CardService, { CreateCardRequest } from '../../../service/CardService';
import StudentService, { Student } from '../../../service/StudentService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

interface AddCardProps {
  onBack?: () => void;
}

const AddCard: React.FC<AddCardProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form data state
  const [formData, setFormData] = useState<CreateCardRequest>({
    student_uuid: '',
    rfid_number: '',
    generate_rfid: true,
    expiry_date: '',
  });

  const [generateRFID, setGenerateRFID] = useState(true);

  useEffect(() => {
    loadAvailableStudents();
  }, []);

  const loadAvailableStudents = async () => {
    setStudentsLoading(true);
    try {
      // Get students without cards
      const response = await CardService.getStudentsWithoutCards();
      setStudents(response.students.map(s => ({
        id: 0, // Not used
        student_uuid: s.student_uuid,
        surname: s.full_name.split(' ').pop() || '',
        first_name: s.full_name.split(' ')[0] || '',
        middle_name: '',
        registration_number: s.registration_number,
        department: s.department,
        mobile_phone: '',
        soma_class_code: '',
        academic_year_status: 'Continuing' as const,
        student_status: s.student_status,
        is_active: true,
        created_at: s.created_at,
        updated_at: '',
      })));
    } catch (error: any) {
      setError(error.message || 'Failed to load students without cards');
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleStudentChange = (student: Student | null) => {
    setSelectedStudent(student);
    setFormData(prev => ({
      ...prev,
      student_uuid: student?.student_uuid || ''
    }));
    
    // Clear messages when selection changes
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleInputChange = (field: keyof CreateCardRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleGenerateRFIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setGenerateRFID(checked);
    setFormData(prev => ({
      ...prev,
      generate_rfid: checked,
      rfid_number: checked ? '' : prev.rfid_number
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.student_uuid) return 'Please select a student';
    if (!generateRFID && !formData.rfid_number?.trim()) return 'RFID number is required when not auto-generating';
    
    // Validate expiry date if provided
    if (formData.expiry_date) {
      const expiryDate = new Date(formData.expiry_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate <= today) {
        return 'Expiry date must be in the future';
      }
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
      const cleanedData: CreateCardRequest = {
        student_uuid: formData.student_uuid,
        generate_rfid: generateRFID,
        ...(generateRFID ? {} : { rfid_number: formData.rfid_number?.trim() }),
        ...(formData.expiry_date ? { expiry_date: new Date(formData.expiry_date).toISOString() } : {})
      };

      const newCard = await CardService.createCard(cleanedData);
      
      setSuccess(
        `Card created successfully for ${selectedStudent?.first_name} ${selectedStudent?.surname}! ` +
        `RFID: ${newCard.rfid_number}`
      );
      
      // Clear form after successful submission
      setTimeout(() => {
        handleClear();
        loadAvailableStudents(); // Refresh available students
      }, 3000);

    } catch (error: any) {
      setError(error.message || 'Failed to create card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      student_uuid: '',
      rfid_number: '',
      generate_rfid: true,
      expiry_date: '',
    });
    setSelectedStudent(null);
    setGenerateRFID(true);
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

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <RegisterSidebar 
        collapsed={sidebarCollapsed} 
        currentView="add-card"
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
              Create New Card
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Issue a new access card to a student
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
              <CreditCard sx={{ fontSize: 28, color: colors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                Card Information
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              {/* Student Selection Section */}
              <Typography variant="h6" sx={{ mb: 2, color: colors.secondary.main, fontWeight: 600 }}>
                Student Selection
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  value={selectedStudent}
                  onChange={(event, newValue) => handleStudentChange(newValue)}
                  options={students}
                  getOptionLabel={(option) => 
                    `${option.first_name} ${option.surname} (${option.registration_number}) - ${option.department}`
                  }
                  loading={studentsLoading}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Student *"
                      placeholder="Search by name or registration number..."
                      helperText="Only students without cards are shown"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <PersonSearch sx={{ mr: 1, color: colors.primary.main }} />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                        endAdornment: (
                          <>
                            {studentsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText={
                    studentsLoading 
                      ? "Loading students..." 
                      : "No students without cards found"
                  }
                />
              </Box>

              {/* Selected Student Info */}
              {selectedStudent && (
                <Box sx={{ 
                  backgroundColor: '#f0f8ff', 
                  border: '1px solid #e3f2fd', 
                  borderRadius: '8px', 
                  p: 2, 
                  mb: 3 
                }}>
                  <Typography variant="body2" sx={{ color: colors.secondary.main, fontWeight: 500, mb: 1 }}>
                    Selected Student Details:
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    <strong>Name:</strong> {selectedStudent.first_name} {selectedStudent.surname}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    <strong>Registration:</strong> {selectedStudent.registration_number}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    <strong>Department:</strong> {selectedStudent.department}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    <strong>Status:</strong> {selectedStudent.student_status}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* RFID Configuration Section */}
              <Typography variant="h6" sx={{ mb: 2, color: colors.secondary.main, fontWeight: 600 }}>
                RFID Configuration
              </Typography>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={generateRFID}
                      onChange={handleGenerateRFIDChange}
                      color="primary"
                      disabled={loading}
                    />
                  }
                  label="Auto-generate RFID number"
                  sx={{ mb: 2 }}
                />
              </Box>

              {!generateRFID && (
                <Box sx={{ mb: 3 }}>
                  <TextField
                    label="RFID Number *"
                    value={formData.rfid_number}
                    onChange={handleInputChange('rfid_number')}
                    fullWidth
                    disabled={loading}
                    placeholder="Enter RFID number manually"
                    helperText="Must be unique across all cards"
                    inputProps={{ maxLength: 50 }}
                  />
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Optional Configuration Section */}
              <Typography variant="h6" sx={{ mb: 2, color: colors.secondary.main, fontWeight: 600 }}>
                Optional Configuration
              </Typography>

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Expiry Date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={handleInputChange('expiry_date')}
                  fullWidth
                  disabled={loading}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: today
                  }}
                  helperText="Leave empty for no expiry date"
                />
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
                  📋 Card Creation Instructions:
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • Only students without existing cards can be selected
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • Auto-generated RFID numbers are recommended for uniqueness
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • Manual RFID numbers must be unique across all cards
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  • Expiry date is optional - leave empty for permanent cards
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
                  disabled={loading || !selectedStudent}
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  sx={{ 
                    backgroundColor: colors.primary.main,
                    '&:hover': { backgroundColor: colors.primary.hover },
                    px: 3
                  }}
                >
                  {loading ? 'Creating Card...' : 'Create Card'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AddCard;
