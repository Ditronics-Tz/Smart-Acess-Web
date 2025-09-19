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
  CreditCard,
  Person,
  Edit,
  Delete,
  PowerSettingsNew,
  Block,
  Refresh,
  School,
  Phone,
  CalendarToday,
  Key,
  Security,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import CardService, { CardDetails } from '../../../service/CardService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

const ViewCardDetails: React.FC = () => {
  const navigate = useNavigate();
  const { cardUuid } = useParams<{ cardUuid: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<CardDetails | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
      const cardData = await CardService.getCard(cardUuid);
      setCard(cardData);
    } catch (error: any) {
      console.error('Error loading card:', error);
      setError(error.message || 'Failed to load card details');
    } finally {
      setLoading(false);
    }
  };

  const handleCardAction = async (action: 'activate' | 'deactivate') => {
    if (!card) return;
    
    setActionLoading(true);
    try {
      if (action === 'activate') {
        await CardService.activateCard(card.card_uuid);
      } else {
        await CardService.deactivateCard(card.card_uuid);
      }
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
      await CardService.deleteCard(card.card_uuid);
      setDeleteDialog(false);
      // Navigate back to cards list after successful deletion
      navigate('/register-dashboard/view-cards');
    } catch (error: any) {
      setError(error.message || 'Failed to delete card');
      setActionLoading(false);
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
      navigate('/registers-dashboard');
    } else {
      navigate(`/register-dashboard/${view}`);
    }
  };

  const handleBack = () => {
    navigate('/register-dashboard/view-cards');
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
          currentView="manage-cards"
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
              Loading card details...
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
          currentView="manage-cards"
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
            Back to Cards
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
        currentView="manage-cards"
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
              Card Details
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              View and manage card information
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

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Card and Student Information */}
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
                  <CreditCard sx={{ fontSize: 28, color: colors.primary.main }} />
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

            {/* Student Information */}
            <Card sx={{ height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Person sx={{ fontSize: 28, color: colors.primary.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                    Student Information
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                    Full Name
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                    {card.student_info.first_name} {card.student_info.middle_name ? card.student_info.middle_name + ' ' : ''}{card.student_info.surname}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                    Registration Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {card.student_info.registration_number}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <School sx={{ fontSize: 18, color: colors.text.secondary }} />
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Department:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {card.student_info.department}
                  </Typography>
                </Box>

                {card.student_info.mobile_phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Phone sx={{ fontSize: 18, color: colors.text.secondary }} />
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Mobile Phone:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {card.student_info.mobile_phone}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  <Chip
                    label={card.student_info.student_status}
                    color={getStatusColor(card.student_info.student_status) as any}
                    size="small"
                  />
                  <Chip
                    label={card.student_info.academic_year_status}
                    color={getStatusColor(card.student_info.academic_year_status) as any}
                    size="small"
                    variant="outlined"
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
                  Card Actions
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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

                {!card.user_permissions.can_modify && !card.user_permissions.can_deactivate && !card.user_permissions.can_delete && (
                  <Typography variant="body2" sx={{ color: colors.text.secondary, fontStyle: 'italic' }}>
                    You don't have permission to modify this card.
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
              Are you sure you want to delete this card for "{card.student_info.first_name} {card.student_info.surname}"?
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
              Are you sure you want to {actionDialog.action} this card for "{card.student_info.first_name} {card.student_info.surname}"?
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

export default ViewCardDetails;
