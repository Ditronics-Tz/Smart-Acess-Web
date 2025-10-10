import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Autocomplete,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Security,
  Person,
  Badge,
  CreditCard,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import SecurityCardService, { SecurityCardDetails } from '../../../service/SecurityServiceCard';
import SecurityPersonelService, { SecurityPersonnel } from '../../../service/SecurityPersonelService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

interface FormData {
  security_id: string;
  rfid_number: string;
  generate_rfid: boolean;
  status: string;
}

const EditSecurityCard: React.FC = () => {
  const navigate = useNavigate();
  const { cardId } = useParams<{ cardId: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<SecurityCardDetails | null>(null);
  const [securityPersonnel, setSecurityPersonnel] = useState<SecurityPersonnel[]>([]);
  const [selectedSecurity, setSelectedSecurity] = useState<SecurityPersonnel | null>(null);

  const [formData, setFormData] = useState<FormData>({
    security_id: '',
    rfid_number: '',
    generate_rfid: false,
    status: 'active',
  });

  useEffect(() => {
    if (cardId) {
      loadCardDetails();
      loadSecurityPersonnel();
    }
  }, [cardId]);

  useEffect(() => {
    if (cardDetails) {
      setFormData({
        security_id: cardDetails.security.security_uuid || '',
        rfid_number: cardDetails.rfid_number || '',
        generate_rfid: false,
        status: cardDetails.is_active ? 'active' : 'inactive',
      });

      // Find and set the selected security personnel
      const security = securityPersonnel.find(s => s.security_id === cardDetails.security.security_uuid);
      if (security) {
        setSelectedSecurity(security);
      }
    }
  }, [cardDetails, securityPersonnel]);

  const loadCardDetails = async () => {
    if (!cardId) return;

    setLoading(true);
    try {
      const response = await SecurityCardService.getSecurityCardDetails(cardId);
      setCardDetails(response);
      setError(null);
    } catch (error: any) {
      console.error('Error loading card details:', error);
      setError(error.message || 'Failed to load card details');
    } finally {
      setLoading(false);
    }
  };

  const loadSecurityPersonnel = async () => {
    try {
      const response = await SecurityPersonelService.listSecurityPersonnel();
      setSecurityPersonnel(response.security || []);
    } catch (error: any) {
      console.error('Error loading security personnel:', error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityChange = (event: any, newValue: SecurityPersonnel | null) => {
    setSelectedSecurity(newValue);
    setFormData(prev => ({
      ...prev,
      security_id: newValue?.security_id || ''
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!cardId) return;

    if (!formData.security_id) {
      setError('Please select a security personnel');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData = {
        security_id: formData.security_id,
        rfid_number: formData.generate_rfid ? null : formData.rfid_number,
        generate_rfid: formData.generate_rfid,
        status: formData.status,
      };

      await SecurityCardService.updateSecurityCard(cardId, updateData);
      setSuccess('Security card updated successfully');

      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/register-dashboard/view-security-card-details/${cardId}`);
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Failed to update security card');
    } finally {
      setSaving(false);
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
    if (cardId) {
      navigate(`/register-dashboard/view-security-card-details/${cardId}`);
    } else {
      navigate('/register-dashboard/view-security-cards');
    }
  };

  const generateRFID = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SEC${timestamp}${random}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <RegisterSidebar
          collapsed={sidebarCollapsed}
          currentView="view-security-cards"
          onNavigate={handleSidebarNavigation}
        />
        <Box sx={{
          flex: 1,
          ml: sidebarCollapsed ? "64px" : "280px",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error && !cardDetails) {
    return (
      <Box sx={{ display: "flex" }}>
        <RegisterSidebar
          collapsed={sidebarCollapsed}
          currentView="view-security-cards"
          onNavigate={handleSidebarNavigation}
        />
        <Box sx={{
          flex: 1,
          ml: sidebarCollapsed ? "64px" : "280px",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          p: 3
        }}>
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
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
              Edit Security Card
            </Typography>
          </Box>

          <Alert severity="error">
            {error}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <RegisterSidebar
        collapsed={sidebarCollapsed}
        currentView="view-security-cards"
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
              Edit Security Card
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Update security personnel access card information
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

        {/* Form */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Security sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                Card Information
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Security Personnel Selection */}
                <Autocomplete
                  options={securityPersonnel}
                  getOptionLabel={(option) => `${option.employee_id} - ${option.full_name}`}
                  value={selectedSecurity}
                  onChange={handleSecurityChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Security Personnel"
                      required
                      helperText="Select the security personnel for this card"
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {option.employee_id} - {option.full_name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                          Badge: {option.badge_number}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />

                <Divider />

                {/* RFID Configuration */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: colors.secondary.main }}>
                    RFID Configuration
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.generate_rfid}
                          onChange={(e) => handleInputChange('generate_rfid', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Generate new RFID automatically"
                    />
                  </Box>

                  {!formData.generate_rfid && (
                    <TextField
                      fullWidth
                      label="RFID Number"
                      value={formData.rfid_number}
                      onChange={(e) => handleInputChange('rfid_number', e.target.value)}
                      helperText="Enter RFID number or leave empty for auto-generation"
                      InputProps={{
                        endAdornment: (
                          <Button
                            size="small"
                            onClick={() => handleInputChange('rfid_number', generateRFID())}
                            sx={{ minWidth: 'auto' }}
                          >
                            Generate
                          </Button>
                        ),
                      }}
                    />
                  )}
                </Box>

                <Divider />

                {/* Card Status */}
                <FormControl fullWidth>
                  <InputLabel>Card Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Card Status"
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{
                      borderColor: colors.secondary.main,
                      color: colors.secondary.main,
                      '&:hover': {
                        borderColor: colors.secondary.hover,
                        backgroundColor: 'rgba(108, 117, 125, 0.04)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    disabled={saving}
                    sx={{
                      backgroundColor: colors.primary.main,
                      '&:hover': { backgroundColor: colors.primary.hover },
                      '&:disabled': { backgroundColor: colors.primary.main, opacity: 0.6 }
                    }}
                  >
                    {saving ? 'Updating...' : 'Update Card'}
                  </Button>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default EditSecurityCard;