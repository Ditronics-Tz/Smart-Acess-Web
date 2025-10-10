import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Add,
  Visibility,
  Assessment,
  GroupAdd,
  PersonOff,
  CheckCircle,
  Cancel,
  Warning,
  Refresh,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SecurityCardService, { SecurityWithoutCard, SecurityCardStatistics } from '../../../service/SecurityServiceCard';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

const ManageSecurityCard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<SecurityCardStatistics | null>(null);
  const [securityWithoutCards, setSecurityWithoutCards] = useState<SecurityWithoutCard[]>([]);

  // Dialog states
  const [bulkCreateDialog, setBulkCreateDialog] = useState(false);
  const [selectedSecurity, setSelectedSecurity] = useState<SecurityWithoutCard[]>([]);

  useEffect(() => {
    loadStatistics();
    loadSecurityWithoutCards();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await SecurityCardService.getCardStatistics();
      setStatistics(response);
    } catch (error: any) {
      console.error('Error loading statistics:', error);
      // Don't show error for statistics as it's not critical
    }
  };

  const loadSecurityWithoutCards = async () => {
    setLoading(true);
    try {
      const response = await SecurityCardService.listSecurityWithoutCards();
      setSecurityWithoutCards(response.security || []);
      setError(null);
    } catch (error: any) {
      console.error('Error loading security without cards:', error);
      setError(error.message || 'Failed to load security personnel without cards');
      setSecurityWithoutCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCreateCards = async () => {
    if (selectedSecurity.length === 0) {
      setError('Please select at least one security personnel');
      return;
    }

    try {
      const securityUuids = selectedSecurity.map(s => s.security_id);
      await SecurityCardService.bulkCreateSecurityCards({
        security_uuids: securityUuids,
        generate_rfid: true
      });

      setSuccess(`Successfully created ${selectedSecurity.length} security card(s)`);
      setBulkCreateDialog(false);
      setSelectedSecurity([]);
      loadSecurityWithoutCards();
      loadStatistics();
    } catch (error: any) {
      setError(error.message || 'Failed to create security cards');
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

  const handleViewCards = () => {
    navigate('/register-dashboard/view-security-cards');
  };

  const handleAddSingleCard = () => {
    navigate('/register-dashboard/add-security-card');
  };

  const toggleSecuritySelection = (security: SecurityWithoutCard) => {
    setSelectedSecurity(prev =>
      prev.find(s => s.security_id === security.security_id)
        ? prev.filter(s => s.security_id !== security.security_id)
        : [...prev, security]
    );
  };

  const selectAllSecurity = () => {
    setSelectedSecurity(securityWithoutCards);
  };

  const clearSelection = () => {
    setSelectedSecurity([]);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <RegisterSidebar
        collapsed={sidebarCollapsed}
        currentView="manage-security-cards"
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
              '&:hover': { backgroundColor: colors.primary.dark }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
              Security Card Management
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Overview and management of security personnel access cards
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => {
              loadStatistics();
              loadSecurityWithoutCards();
            }}
            disabled={loading}
            sx={{
              backgroundColor: colors.primary.main,
              '&:hover': { backgroundColor: colors.primary.dark }
            }}
          >
            Refresh
          </Button>
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

        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: colors.primary.main, fontWeight: 'bold' }}>
                {statistics?.summary.total_security || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Total Security Personnel
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                {statistics?.summary.security_cards || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Security Cards Issued
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                {statistics?.summary.security_without_cards || securityWithoutCards.length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Without Cards
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                {Math.round(statistics?.summary.coverage_percentage || 0)}%
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Coverage
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Assessment sx={{ color: colors.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                  Quick Actions
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<Visibility />}
                  onClick={handleViewCards}
                  sx={{
                    backgroundColor: colors.primary.main,
                    '&:hover': { backgroundColor: colors.primary.dark }
                  }}
                >
                  View All Cards
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddSingleCard}
                  sx={{
                    borderColor: colors.primary.main,
                    color: colors.primary.main,
                    '&:hover': {
                      borderColor: colors.primary.dark,
                      backgroundColor: 'rgba(248, 112, 96, 0.04)'
                    }
                  }}
                >
                  Add Single Card
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<GroupAdd />}
                  onClick={() => setBulkCreateDialog(true)}
                  disabled={securityWithoutCards.length === 0}
                  sx={{
                    borderColor: colors.secondary.main,
                    color: colors.secondary.main,
                    '&:hover': {
                      borderColor: colors.secondary.dark,
                      backgroundColor: 'rgba(108, 117, 125, 0.04)'
                    }
                  }}
                >
                  Bulk Create Cards ({securityWithoutCards.length})
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Security Without Cards */}
        {securityWithoutCards.length > 0 ? (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <PersonOff sx={{ color: colors.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                  Security Personnel Without Cards ({securityWithoutCards.length})
                </Typography>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Employee ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Badge Number</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Phone Number</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {securityWithoutCards.map((security) => (
                        <TableRow key={security.security_id} hover>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {security.employee_id}
                          </TableCell>
                          <TableCell>{security.full_name}</TableCell>
                          <TableCell>{security.badge_number}</TableCell>
                          <TableCell>{security.phone_number || 'N/A'}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Create Card">
                                <IconButton
                                  size="small"
                                  sx={{ color: colors.primary.main }}
                                  onClick={() => navigate(`/register-dashboard/add-security-card?security=${security.security_id}`)}
                                >
                                  <Add />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        ) : !loading && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main, mb: 1 }}>
                All Security Personnel Have Cards
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Every active security personnel has been assigned an access card.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Bulk Create Dialog */}
        <Dialog
          open={bulkCreateDialog}
          onClose={() => setBulkCreateDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Bulk Create Security Cards</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Select security personnel to create cards for:
            </Typography>

            {securityWithoutCards.length > 0 ? (
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button size="small" onClick={selectAllSecurity}>
                  Select All
                </Button>
                <Button size="small" onClick={clearSelection}>
                  Clear Selection
                </Button>
                <Chip
                  label={`${selectedSecurity.length} selected`}
                  color="primary"
                  size="small"
                />
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                No security personnel available for card creation.
              </Typography>
            )}

            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">Select</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Badge Number</TableCell>
                    <TableCell>Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {securityWithoutCards.map((security) => (
                    <TableRow
                      key={security.security_id}
                      hover
                      selected={selectedSecurity.some(s => s.security_id === security.security_id)}
                      onClick={() => toggleSecuritySelection(security)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedSecurity.some(s => s.security_id === security.security_id)}
                          onChange={() => toggleSecuritySelection(security)}
                        />
                      </TableCell>
                      <TableCell>{security.employee_id}</TableCell>
                      <TableCell>{security.full_name}</TableCell>
                      <TableCell>{security.badge_number}</TableCell>
                      <TableCell>{security.phone_number || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkCreateCards}
              variant="contained"
              disabled={selectedSecurity.length === 0}
              sx={{
                backgroundColor: colors.primary.main,
                '&:hover': { backgroundColor: colors.primary.dark }
              }}
            >
              Create {selectedSecurity.length} Card{selectedSecurity.length !== 1 ? 's' : ''}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ManageSecurityCard;