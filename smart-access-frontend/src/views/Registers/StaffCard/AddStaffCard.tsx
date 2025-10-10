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
  Person,
  Save,
  Clear,
  PersonSearch,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StaffCardService, { CreateSingleStaffCardRequest } from '../../../service/StaffCardService';
import StaffService, { Staff } from '../../../service/StaffService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

interface AddStaffCardProps {
  onBack?: () => void;
}

const AddStaffCard: React.FC<AddStaffCardProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Form data state
  const [formData, setFormData] = useState<CreateSingleStaffCardRequest>({
    card_type: 'staff',
    staff_uuid: '',
    generate_rfid: true,
    expiry_date: '',
  });

  const [generateRFID, setGenerateRFID] = useState(true);

  useEffect(() => {
    loadAvailableStaff();
  }, []);

  const loadAvailableStaff = async () => {
    setStaffLoading(true);
    try {
      // Get staff without cards
      const response = await StaffCardService.listStaffWithoutCards();
      // Convert StaffWithoutCard to Staff format
      const staffData: Staff[] = response.staff.map(s => ({
        staff_uuid: s.staff_uuid,
        staff_number: s.staff_number,
        first_name: s.full_name.split(' ')[0] || '',
        surname: s.full_name.split(' ').slice(1).join(' ') || '',
        middle_name: '',
        department: s.department,
        position: s.position,
        employment_status: (s.employment_status as 'Active' | 'Inactive' | 'Terminated' | 'Retired' | 'On Leave') || 'Active',
        mobile_phone: '',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: '',
      }));
      setStaffMembers(staffData);
    } catch (error: any) {
      setError(error.message || 'Failed to load staff without cards');
    } finally {
      setStaffLoading(false);
    }
  };

  const handleStaffChange = (staff: Staff | null) => {
    setSelectedStaff(staff);
    setFormData(prev => ({
      ...prev,
      staff_uuid: staff?.staff_uuid || ''
    }));
    
    // Clear messages when selection changes
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleInputChange = (field: keyof CreateSingleStaffCardRequest) => (
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
      generate_rfid: checked
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.staff_uuid) return 'Please select a staff member';
    
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
      const cleanedData: CreateSingleStaffCardRequest = {
        card_type: 'staff',
        staff_uuid: formData.staff_uuid,
        generate_rfid: generateRFID,
        ...(formData.expiry_date ? { expiry_date: formData.expiry_date } : {})
      };

      const newCard = await StaffCardService.createStaffCard(cleanedData);
      
      setSuccess(
        `Card created successfully for ${selectedStaff?.first_name} ${selectedStaff?.surname}! ` +
        `RFID: ${newCard.rfid_number}`
      );
      
      // Clear form after successful submission
      setTimeout(() => {
        handleClear();
        loadAvailableStaff(); // Refresh available staff
      }, 3000);

    } catch (error: any) {
      setError(error.message || 'Failed to create staff card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      card_type: 'staff',
      staff_uuid: '',
      generate_rfid: true,
      expiry_date: '',
    });
    setSelectedStaff(null);
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
        currentView="add-staff-card"
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
              Create Staff Card
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Issue a new access card to a staff member
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
              <Person sx={{ fontSize: 28, color: colors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                Staff Card Information
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              {/* Staff Selection Section */}
              <Typography variant="h6" sx={{ mb: 2, color: colors.secondary.main, fontWeight: 600 }}>
                Staff Selection
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  value={selectedStaff}
                  onChange={(event, newValue) => handleStaffChange(newValue)}
                  options={staffMembers}
                  getOptionLabel={(option) => 
                    `${option.first_name} ${option.surname} (${option.staff_number}) - ${option.department}`
                  }
                  loading={staffLoading}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Staff Member *"
                      placeholder="Search by name or staff number..."
                      helperText="Only staff members without cards are shown"
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
                            {staffLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText={
                    staffLoading 
                      ? "Loading staff members..." 
                      : "No staff members without cards found"
                  }
                />
              </Box>

              {/* Selected Staff Info */}
              {selectedStaff && (
                <Box sx={{ 
                  backgroundColor: '#f0f8ff', 
                  border: '1px solid #e3f2fd', 
                  borderRadius: '8px', 
                  p: 2, 
                  mb: 3 
                }}>
                  <Typography variant="body2" sx={{ color: colors.secondary.main, fontWeight: 500, mb: 1 }}>
                    Selected Staff Details:
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    <strong>Name:</strong> {selectedStaff.first_name} {selectedStaff.surname}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    <strong>Staff Number:</strong> {selectedStaff.staff_number}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    <strong>Department:</strong> {selectedStaff.department}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    <strong>Position:</strong> {selectedStaff.position}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    <strong>Employment Status:</strong> {selectedStaff.employment_status}
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
                  label="Auto-generate RFID number (Recommended)"
                  sx={{ mb: 2 }}
                />
              </Box>

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
                  📋 Staff Card Creation Instructions:
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • Only staff members without existing cards can be selected
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • Auto-generated RFID numbers are recommended for uniqueness
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • Staff cards provide access based on department and position
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
                  disabled={loading || !selectedStaff}
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  sx={{ 
                    backgroundColor: colors.primary.main,
                    '&:hover': { backgroundColor: colors.primary.hover },
                    px: 3
                  }}
                >
                  {loading ? 'Creating Card...' : 'Create Staff Card'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AddStaffCard;
