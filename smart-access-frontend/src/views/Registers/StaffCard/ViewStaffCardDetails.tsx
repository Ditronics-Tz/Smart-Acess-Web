import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Edit,
  Delete,
  PowerSettingsNew,
  Block,
  Refresh,
  Business,
  Phone,
  CalendarToday,
  Key,
  Security,
  Print,
  Badge,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import StaffCardService from '../../../service/StaffCardService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

// Interface for staff card details (extends the basic staff card)
interface StaffCardDetails {
  card_uuid: string;
  rfid_number: string;
  card_type: string;
  card_holder_name: string;
  card_holder_number: string;
  department: string;
  position: string;
  employment_status: string;
  is_active: boolean;
  issued_date: string;
  expiry_date?: string | null;
  created_at: string;
  updated_at?: string;
  user_permissions: {
    can_modify: boolean;
    can_deactivate: boolean;
    can_delete: boolean;
  };
}

const ViewStaffCardDetails: React.FC = () => {
  const navigate = useNavigate();
  const { cardUuid } = useParams<{ cardUuid: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<StaffCardDetails | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [printingCard, setPrintingCard] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Action dialogs
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'activate' | 'deactivate';
  }>({ open: false, action: 'activate' });

  useEffect(() => {
    if (cardUuid) {
      loadCard();
    }
  }, [cardUuid]);

  const loadCard = async () => {
    if (!cardUuid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation - replace with actual API call
      // const cardData = await StaffCardService.getStaffCard(cardUuid);
      
      // Mock data for development
      const mockCard: StaffCardDetails = {
        card_uuid: cardUuid,
        rfid_number: 'RF123456789',
        card_type: 'staff',
        card_holder_name: 'John Doe Smith',
        card_holder_number: 'STAFF/2024/001',
        department: 'Computer Science',
        position: 'Senior Lecturer',
        employment_status: 'Active',
        is_active: true,
        issued_date: '2024-01-15T10:30:00Z',
        expiry_date: null,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        user_permissions: {
          can_modify: true,
          can_deactivate: true,
          can_delete: true
        }
      };
      
      setCard(mockCard);
    } catch (error: any) {
      console.error('Error loading staff card:', error);
      setError(error.message || 'Failed to load staff card details');
    } finally {
      setLoading(false);
    }
  };

  const handleCardAction = async (action: 'activate' | 'deactivate') => {
    if (!card) return;
    
    setActionLoading(true);
    try {
      // Mock implementation - replace with actual API calls
      // if (action === 'activate') {
      //   await StaffCardService.activateCard(card.card_uuid);
      // } else {
      //   await StaffCardService.deactivateCard(card.card_uuid);
      // }
      setActionDialog({ open: false, action: 'activate' });
      loadCard(); // Refresh the card data
    } catch (error: any) {
      setError(error.message || `Failed to ${action} card`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!card) return;
    
    setActionLoading(true);
    try {
      // await StaffCardService.deleteCard(card.card_uuid);
      setDeleteDialog(false);
      // Navigate back to staff cards list after successful deletion
      navigate('/register-dashboard/view-staff-cards');
    } catch (error: any) {
      setError(error.message || 'Failed to delete staff card');
      setActionLoading(false);
    }
  };

  const handlePrintStaffCard = async () => {
    if (!card) return;
    
    setPrintingCard(true);
    setError(null);
    
    try {
      const pdfBlob = await StaffCardService.printStaffCard(card.card_uuid);
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Staff_ID_Card_${card.card_holder_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess('Staff ID Card PDF generated successfully! Check your downloads.');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (error: any) {
      console.error('Error printing staff ID card:', error);
      setError(error.message || 'Failed to print staff ID card');
    } finally {
      setPrintingCard(false);
    }
  };

  const getEmploymentStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'error';
      case 'Suspended':
        return 'warning';
      case 'Terminated':
        return 'error';
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
    navigate('/register-dashboard/view-staff-cards');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isCardExpired = (expiryDate?: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isCardExpiringSoon = (expiryDate?: string | null) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const soon = new Date();
    soon.setDate(soon.getDate() + 30); // 30 days from now
    return expiry <= soon && expiry > new Date();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <RegisterSidebar 
          collapsed={sidebarCollapsed} 
          currentView="manage-staff-cards"
          onNavigate={handleSidebarNavigation}
        />
        <Box sx={{ 
          flex: 1, 
          ml: sidebarCollapsed ? "64px" : "280px",
          minHeight: "100vh", 
          backgroundColor: "#f8f9fa",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} />
            <Typography variant="h6" sx={{ mt: 2, color: colors.text.secondary }}>
              Loading staff card details...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error && !card) {
    return (
      <Box sx={{ display: "flex" }}>
        <RegisterSidebar 
          collapsed={sidebarCollapsed} 
          currentView="manage-staff-cards"
          onNavigate={handleSidebarNavigation}
        />
        <Box sx={{ 
          flex: 1, 
          ml: sidebarCollapsed ? "64px" : "280px",
          minHeight: "100vh", 
          backgroundColor: "#f8f9fa",
          p: 3
        }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={handleBack}
            sx={{ backgroundColor: colors.primary.main }}
          >
            Back to Staff Cards
          </Button>
        </Box>
      </Box>
    );
  }

  if (!card) {
    return null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <RegisterSidebar 
        collapsed={sidebarCollapsed} 
        currentView="manage-staff-cards"
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
              Staff Card Details
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              View and manage staff card information
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadCard}
            disabled={loading}
            sx={{ 
              borderColor: colors.primary.main,
              color: colors.primary.main,
              '&:hover': { 
                borderColor: colors.primary.hover,
                backgroundColor: 'rgba(248, 112, 96, 0.04)'
              }
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Card and Staff Information */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            flexWrap: 'wrap',
            '& > *': { flex: '1 1 400px', minWidth: '400px' }
          }}>
            {/* Card Information */}
            <Card sx={{ height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Person sx={{ fontSize: 28, color: colors.primary.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                    Card Information
                  </Typography>
                  <Box sx={{ ml: 'auto' }}>
                    <Chip
                      label={card.is_active ? 'Active' : 'Inactive'}
                      color={card.is_active ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                    RFID Number
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    fontFamily: 'monospace', 
                    color: colors.secondary.main,
                    backgroundColor: '#f5f5f5',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0'
                  }}>
                    {card.rfid_number}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarToday sx={{ fontSize: 18, color: colors.text.secondary }} />
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Issued Date:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDate(card.issued_date)}
                  </Typography>
                </Box>

                {card.expiry_date && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Security sx={{ fontSize: 18, color: colors.text.secondary }} />
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Expiry Date:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatDateOnly(card.expiry_date)}
                    </Typography>
                    {isCardExpired(card.expiry_date) && (
                      <Chip label="Expired" color="error" size="small" />
                    )}
                    {isCardExpiringSoon(card.expiry_date) && !isCardExpired(card.expiry_date) && (
                      <Chip label="Expiring Soon" color="warning" size="small" />
                    )}
                  </Box>
                )}

                {!card.expiry_date && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Security sx={{ fontSize: 18, color: colors.text.secondary }} />
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Expiry Date:
                    </Typography>
                    <Chip label="No Expiry" color="success" size="small" variant="outlined" />
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Key sx={{ fontSize: 18, color: colors.text.secondary }} />
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Card UUID:
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.8rem',
                    backgroundColor: '#f5f5f5',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {card.card_uuid}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 18, color: colors.text.secondary }} />
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Last Updated:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {card.updated_at ? formatDate(card.updated_at) : 'Never'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Staff Information */}
            <Card sx={{ height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Badge sx={{ fontSize: 28, color: colors.primary.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                    Staff Information
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                    Staff Name
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                    {card.card_holder_name}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                    Staff Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {card.card_holder_number}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Business sx={{ fontSize: 18, color: colors.text.secondary }} />
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Department:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {card.department}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Badge sx={{ fontSize: 18, color: colors.text.secondary }} />
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Position:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {card.position}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  <Chip
                    label={card.employment_status}
                    color={getEmploymentStatusColor(card.employment_status) as any}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Action Buttons */}
          <Box>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main, mb: 3 }}>
                  Staff Card Actions
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {/* Print Staff Card Button - Available for all users */}
                  <Tooltip title="Download staff ID card as PDF">
                    <Button
                      variant="contained"
                      startIcon={printingCard ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Print />}
                      onClick={handlePrintStaffCard}
                      disabled={printingCard || !card.is_active}
                      sx={{ 
                        backgroundColor: colors.primary.main,
                        color: 'white',
                        '&:hover': { 
                          backgroundColor: colors.primary.hover
                        },
                        '&:disabled': {
                          backgroundColor: '#ccc'
                        }
                      }}
                    >
                      {printingCard ? 'Generating PDF...' : 'Print Staff ID Card'}
                    </Button>
                  </Tooltip>

                  {card.user_permissions.can_deactivate && (
                    card.is_active ? (
                      <Button
                        variant="outlined"
                        startIcon={<Block />}
                        onClick={() => setActionDialog({ open: true, action: 'deactivate' })}
                        disabled={actionLoading}
                        sx={{ 
                          borderColor: '#ff9800',
                          color: '#ff9800',
                          '&:hover': { 
                            borderColor: '#f57c00',
                            backgroundColor: 'rgba(255, 152, 0, 0.04)'
                          }
                        }}
                      >
                        Deactivate Card
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        startIcon={<PowerSettingsNew />}
                        onClick={() => setActionDialog({ open: true, action: 'activate' })}
                        disabled={actionLoading}
                        sx={{ 
                          borderColor: '#4caf50',
                          color: '#4caf50',
                          '&:hover': { 
                            borderColor: '#388e3c',
                            backgroundColor: 'rgba(76, 175, 80, 0.04)'
                          }
                        }}
                      >
                        Activate Card
                      </Button>
                    )
                  )}

                  {card.user_permissions.can_modify && (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      disabled={actionLoading}
                      sx={{ 
                        borderColor: colors.primary.main,
                        color: colors.primary.main,
                        '&:hover': { 
                          borderColor: colors.primary.hover,
                          backgroundColor: 'rgba(248, 112, 96, 0.04)'
                        }
                      }}
                    >
                      Edit Card
                    </Button>
                  )}

                  {card.user_permissions.can_delete && (
                    <Button
                      variant="outlined"
                      startIcon={<Delete />}
                      onClick={() => setDeleteDialog(true)}
                      disabled={actionLoading}
                      sx={{ 
                        borderColor: '#d32f2f',
                        color: '#d32f2f',
                        '&:hover': { 
                          borderColor: '#c62828',
                          backgroundColor: 'rgba(211, 47, 47, 0.04)'
                        }
                      }}
                    >
                      Delete Card
                    </Button>
                  )}
                </Box>

                {/* Info Messages */}
                {!card.is_active && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Note:</strong> Staff ID card printing is disabled for inactive cards. Please activate the card first to print.
                    </Typography>
                  </Alert>
                )}

                {!card.user_permissions.can_modify && !card.user_permissions.can_deactivate && !card.user_permissions.can_delete && (
                  <Typography variant="body2" sx={{ color: colors.text.secondary, fontStyle: 'italic', mt: 2 }}>
                    You don't have permission to modify this staff card.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this staff card for "{card.card_holder_name}"?
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: colors.text.secondary }}>
              RFID: {card.rfid_number}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#d32f2f' }}>
              This action cannot be undone. The card will be permanently removed from the system.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialog(false)}
              disabled={actionLoading}
              sx={{ color: colors.secondary.main }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCard}
              disabled={actionLoading}
              color="error"
              variant="contained"
              startIcon={actionLoading ? <CircularProgress size={16} /> : undefined}
            >
              {actionLoading ? 'Deleting...' : 'Delete Card'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Card Action Confirmation Dialog */}
        <Dialog
          open={actionDialog.open}
          onClose={() => setActionDialog({ open: false, action: 'activate' })}
        >
          <DialogTitle>
            Confirm {actionDialog.action === 'activate' ? 'Activation' : 'Deactivation'}
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {actionDialog.action} this staff card for "{card.card_holder_name}"?
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: colors.text.secondary }}>
              RFID: {card.rfid_number}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: colors.text.secondary }}>
              {actionDialog.action === 'activate' 
                ? 'This will allow the card to be used for access control.'
                : 'This will prevent the card from being used for access control.'
              }
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setActionDialog({ open: false, action: 'activate' })}
              disabled={actionLoading}
              sx={{ color: colors.secondary.main }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleCardAction(actionDialog.action)}
              disabled={actionLoading}
              color={actionDialog.action === 'activate' ? 'success' : 'warning'}
              variant="contained"
              startIcon={actionLoading ? <CircularProgress size={16} /> : undefined}
            >
              {actionLoading 
                ? `${actionDialog.action === 'activate' ? 'Activating' : 'Deactivating'}...`
                : `${actionDialog.action === 'activate' ? 'Activate' : 'Deactivate'} Card`
              }
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ViewStaffCardDetails;
