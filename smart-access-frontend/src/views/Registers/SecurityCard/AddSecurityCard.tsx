import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  Autocomplete,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  ArrowBack,
  Security,
  Save,
  Clear,
  Person,
  Badge,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SecurityCardService, { CreateSingleSecurityCardRequest } from '../../../service/SecurityServiceCard';
import SecurityPersonelService, { SecurityPersonnel } from '../../../service/SecurityPersonelService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

interface AddSecurityCardProps {
  onBack?: () => void;
}

const AddSecurityCard: React.FC<AddSecurityCardProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [securityPersonnel, setSecurityPersonnel] = useState<SecurityPersonnel[]>([]);
  const [selectedSecurity, setSelectedSecurity] = useState<SecurityPersonnel | null>(null);

  // Form data state
  const [formData, setFormData] = useState<CreateSingleSecurityCardRequest>({
    card_type: 'security',
    security_uuid: '',
    generate_rfid: true,
  });

  useEffect(() => {
    loadSecurityPersonnel();
    
    // Check if security personnel is pre-selected from URL params
    const securityId = searchParams.get('security');
    if (securityId) {
      setFormData(prev => ({
        ...prev,
        security_uuid: securityId
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    // Find and set the selected security personnel when data loads
    if (formData.security_uuid && securityPersonnel.length > 0) {
      const security = securityPersonnel.find(s => s.security_id === formData.security_uuid);
      if (security) {
        setSelectedSecurity(security);
      }
    }
  }, [formData.security_uuid, securityPersonnel]);

  const loadSecurityPersonnel = async () => {
    try {
      const response = await SecurityPersonelService.listSecurityPersonnel({
        is_active: true,
        page_size: 100
      });
      setSecurityPersonnel(response.results || []);
    } catch (error: any) {
      console.error('Error loading security personnel:', error);
      setError('Failed to load security personnel list');
    }
  };

  const handleSecurityChange = (event: any, newValue: SecurityPersonnel | null) => {
    setSelectedSecurity(newValue);
    setFormData(prev => ({
      ...prev,
      security_uuid: newValue?.security_id || ''
    }));
    
    // Clear messages when user changes selection
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSwitchChange = (field: keyof CreateSingleSecurityCardRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.security_uuid) return 'Please select a security personnel';
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
      const newCard = await SecurityCardService.createSecurityCard(formData);
      
      setSuccess(
        `Security card has been successfully created for ${selectedSecurity?.full_name} ` +
        `(${selectedSecurity?.employee_id}) with RFID: ${newCard.rfid_number}`
      );
      
      // Clear form after successful submission
      setTimeout(() => {
        handleClear();
      }, 3000);

    } catch (error: any) {
      setError(error.message || 'Failed to create security card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      card_type: 'security',
      security_uuid: '',
      generate_rfid: true,
    });
    setSelectedSecurity(null);
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
        currentView="add-security-card"
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
              Add Security Card
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Create a new access card for security personnel
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
              <Security sx={{ fontSize: 28, color: colors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                Security Card Information
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              {/* Security Personnel Selection */}
              <Typography variant="h6" sx={{ mb: 2, color: colors.secondary.main, fontWeight: 600 }}>
                Security Personnel Selection
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  options={securityPersonnel}
                  getOptionLabel={(option) => `${option.employee_id} - ${option.full_name}`}
                  value={selectedSecurity}
                  onChange={handleSecurityChange}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Security Personnel *"
                      placeholder="Search by employee ID or name"
                      helperText="Choose the security personnel for this card"
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Person sx={{ color: colors.primary.main }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {option.employee_id} - {option.full_name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            Badge: {option.badge_number} | Phone: {option.phone_number || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                />
              </Box>

              {/* Selected Security Details */}
              {selectedSecurity && (
                <Card sx={{ mb: 3, backgroundColor: '#f0f8ff', border: '1px solid #e3f2fd' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: colors.secondary.main, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge sx={{ color: colors.primary.main }} />
                      Selected Security Personnel
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Employee ID:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedSecurity.employee_id}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Full Name:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedSecurity.full_name}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Badge Number:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedSecurity.badge_number}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Phone:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedSecurity.phone_number || 'N/A'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Hire Date:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {new Date(selectedSecurity.hire_date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Card Configuration */}
              <Typography variant="h6" sx={{ mb: 2, color: colors.secondary.main, fontWeight: 600 }}>
                Card Configuration
              </Typography>

              <Box sx={{ mb: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.generate_rfid}
                      onChange={handleSwitchChange('generate_rfid')}
                      disabled={loading}
                      color="primary"
                    />
                  }
                  label="Auto-generate RFID number"
                />
                <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
                  When enabled, the system will automatically generate a unique RFID number for this card
                </Typography>
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
                  🔒 Security Card Creation Instructions:
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • Select an active security personnel from the dropdown list
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  • RFID numbers are automatically generated to ensure uniqueness
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  • Each security personnel can only have one active card at a time
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
                  disabled={loading || !selectedSecurity}
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  sx={{ 
                    backgroundColor: colors.primary.main,
                    '&:hover': { backgroundColor: colors.primary.hover },
                    px: 3
                  }}
                >
                  {loading ? 'Creating Card...' : 'Create Security Card'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AddSecurityCard;
