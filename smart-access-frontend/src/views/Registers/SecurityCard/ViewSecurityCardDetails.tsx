import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Avatar,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Badge,
  CalendarToday,
  CheckCircle,
  Cancel,
  Print,
  CreditCard,
  Phone,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import SecurityCardService, { SecurityCardDetails } from '../../../service/SecurityServiceCard';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

const ViewSecurityCardDetails: React.FC = () => {
  const navigate = useNavigate();
  const { cardUuid } = useParams<{ cardUuid: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<SecurityCardDetails | null>(null);

  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    actionType: 'activate' | 'deactivate';
  }>({ open: false, actionType: 'activate' });

  useEffect(() => {
    if (cardUuid) {
      loadCardDetails();
    }
  }, [cardUuid]);

  const loadCardDetails = async () => {
    if (!cardUuid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await SecurityCardService.getSecurityCard(cardUuid);
      setCardDetails(data);
    } catch (error: any) {
      setError(error.message || 'Failed to load card details');
    } finally {
      setLoading(false);
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
    navigate('/register-dashboard/manage-security-cards');
  };

  const handleCardAction = async () => {
    if (!cardUuid) return;

    const { actionType } = actionDialog;

    try {
      if (actionType === 'activate') {
        await SecurityCardService.activateCard(cardUuid);
        setSuccess('Card activated successfully');
      } else if (actionType === 'deactivate') {
        await SecurityCardService.deactivateCard(cardUuid);
        setSuccess('Card deactivated successfully');
      }
      setActionDialog({ open: false, actionType: 'activate' });
      loadCardDetails(); // Refresh the details
    } catch (error: any) {
      setError(error.message || `Failed to ${actionType} card`);
    }
  };

  const handlePrintCard = async () => {
    if (!cardUuid) return;
    try {
      const blob = await SecurityCardService.printSecurityCard(cardUuid);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Security_Card_${cardDetails?.security.employee_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error: any) {
      setError(error.message || 'Failed to print card');
    }
  };

  if (loading && !cardDetails) {
    return (
      <Box sx={{ display: "flex" }}>
        <RegisterSidebar 
          collapsed={sidebarCollapsed} 
          currentView="manage-security-cards"
          onNavigate={handleSidebarNavigation}
        />
        <Box sx={{ 
          flex: 1, 
          ml: sidebarCollapsed ? "64px" : "280px",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <RegisterSidebar 
        collapsed={sidebarCollapsed} 
        currentView="manage-security-cards"
        onNavigate={handleSidebarNavigation}
      />

      <Box sx={{ 
        flex: 1, 
        ml: sidebarCollapsed ? "64px" : "280px",
        p: 3,
        backgroundColor: "#f8f9fa",
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
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
              Security Card Details
            </Typography>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {cardDetails && (
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Card sx={{ flex: '0 0 auto', width: '350px' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{ 
                    width: 200, 
                    height: 200,
                    bgcolor: colors.primary.main,
                  }}
                  src={cardDetails.security.photo_url || undefined}
                >
                  <Person sx={{ fontSize: '8rem' }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  {cardDetails.security.full_name}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  {cardDetails.security.employee_id}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Print />}
                  onClick={handlePrintCard}
                  fullWidth
                >
                  Print Card
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ flex: '1 1 500px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Card & Personnel Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <InfoRow icon={<CreditCard />} label="RFID Number" value={cardDetails.rfid_number} />
                  <InfoRow icon={<Badge />} label="Employee ID" value={cardDetails.security.employee_id} />
                  <InfoRow icon={<Badge />} label="Badge Number" value={cardDetails.security.badge_number} />
                  <InfoRow icon={<Phone />} label="Phone Number" value={cardDetails.security.phone_number || 'N/A'} />
                  <InfoRow icon={<CalendarToday />} label="Hire Date" value={new Date(cardDetails.security.hire_date).toLocaleDateString()} />
                  <InfoRow icon={<CalendarToday />} label="Card Issued Date" value={new Date(cardDetails.issued_date).toLocaleDateString()} />
                  <InfoRow icon={<CalendarToday />} label="Card Expiry Date" value={cardDetails.expiry_date ? new Date(cardDetails.expiry_date).toLocaleDateString() : 'N/A'} />
                  
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip
                      icon={cardDetails.is_active ? <CheckCircle /> : <Cancel />}
                      label={cardDetails.is_active ? 'Card Active' : 'Card Inactive'}
                      color={cardDetails.is_active ? 'success' : 'error'}
                    />
                    <Chip
                      label={cardDetails.security.is_active ? 'Personnel Active' : 'Personnel Inactive'}
                      color={cardDetails.security.is_active ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {cardDetails.is_active ? (
                      <Button 
                        variant="outlined"
                        color="warning"
                        onClick={() => setActionDialog({ open: true, actionType: 'deactivate' })}
                      >
                        Deactivate Card
                      </Button>
                    ) : (
                      <Button 
                        variant="contained"
                        color="success"
                        onClick={() => setActionDialog({ open: true, actionType: 'activate' })}
                      >
                        Activate Card
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        <Dialog
          open={actionDialog.open}
          onClose={() => setActionDialog({ ...actionDialog, open: false })}
        >
          <DialogTitle>Confirm {actionDialog.actionType}</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {actionDialog.actionType} this card?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ ...actionDialog, open: false })}>Cancel</Button>
            <Button onClick={handleCardAction} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

const InfoRow: React.FC<{ icon: React.ReactElement; label: string; value: string }> = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
    {React.cloneElement(icon, { sx: { color: colors.primary.main } })}
    <Box>
      <Typography variant="body2" sx={{ color: colors.text.secondary }}>{label}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>{value}</Typography>
    </Box>
  </Box>
);

export default ViewSecurityCardDetails;
