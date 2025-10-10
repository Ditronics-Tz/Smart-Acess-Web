import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
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
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Refresh,
  PersonSearch,
  ArrowBack,
  CheckCircle,
  Cancel,
  Delete,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SecurityCardService, { SecurityCard, SecurityCardFilters } from '../../../service/SecurityServiceCard';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

const ViewSecurityCards: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<SecurityCard[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [filters, setFilters] = useState<SecurityCardFilters>({
    search: '',
    is_active: undefined,
    ordering: '-created_at'
  });

  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    card: SecurityCard | null;
    actionType: 'activate' | 'deactivate' | 'delete';
  }>({ open: false, card: null, actionType: 'activate' });

  useEffect(() => {
    loadSecurityCards();
  }, [page, filters]);

  const loadSecurityCards = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key as keyof SecurityCardFilters] = value;
        }
        return acc;
      }, {} as SecurityCardFilters);

      const response = await SecurityCardService.listSecurityCards({
        ...cleanFilters,
        page,
        page_size: pageSize,
      });

      if (response && response.results && Array.isArray(response.results)) {
        setCards(response.results);
        setTotalCount(response.count || 0);
      } else {
        setCards([]);
        setTotalCount(0);
        setError('Unexpected response format from server.');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load security cards');
      setCards([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof SecurityCardFilters) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      search: value
    }));
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      is_active: undefined,
      ordering: '-created_at'
    });
    setPage(1);
  };

  const handleCardAction = async () => {
    if (!actionDialog.card) return;

    const { card, actionType } = actionDialog;

    try {
      if (actionType === 'activate') {
        await SecurityCardService.activateCard(card.card_uuid);
      } else if (actionType === 'deactivate') {
        await SecurityCardService.deactivateCard(card.card_uuid);
      }
      // Note: Delete is not implemented in the service in this example
      setActionDialog({ open: false, card: null, actionType: 'activate' });
      loadSecurityCards(); // Refresh the list
    } catch (error: any) {
      setError(error.message || `Failed to ${actionType} card`);
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

  const safeCards = Array.isArray(cards) ? cards : [];

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
        transition: "margin-left 0.3s ease",
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
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
              Manage Security Cards
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              View and manage security personnel cards
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={loadSecurityCards}
            disabled={loading}
            sx={{ 
              backgroundColor: colors.primary.main,
              '&:hover': { backgroundColor: colors.primary.hover }
            }}
          >
            Refresh
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <PersonSearch sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                Search & Filter Cards
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search by name, employee ID, or RFID..."
                value={filters.search || ''}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: '1 1 300px', minWidth: '250px' }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ 
                  borderColor: colors.secondary.main,
                  color: colors.secondary.main
                }}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </Box>

            {showFilters && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.is_active === undefined ? '' : filters.is_active.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters(prev => ({
                        ...prev,
                        is_active: value === '' ? undefined : value === 'true'
                      }));
                      setPage(1);
                    }}
                    label="Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="text"
                  onClick={clearFilters}
                  sx={{ color: colors.primary.main, alignSelf: 'center' }}
                >
                  Clear All Filters
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: colors.text.secondary }}>
            Showing {safeCards.length} of {totalCount} cards
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Page {page} of {Math.ceil(totalCount / pageSize) || 1}
          </Typography>
        </Box>

        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>RFID Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Issued Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Expiry Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2 }}>Loading cards...</Typography>
                    </TableCell>
                  </TableRow>
                ) : safeCards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {error ? 'Failed to load cards. Please try refreshing.' : 'No security cards found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  safeCards.map((card) => (
                    <TableRow key={card.card_uuid} hover>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {card.card_holder_number}
                      </TableCell>
                      <TableCell>{card.card_holder_name}</TableCell>
                      <TableCell>{card.rfid_number}</TableCell>
                      <TableCell>{new Date(card.issued_date).toLocaleDateString()}</TableCell>
                      <TableCell>{card.expiry_date ? new Date(card.expiry_date).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={card.is_active ? 'Active' : 'Inactive'}
                          color={card.is_active ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            sx={{ color: colors.primary.main }}
                            title="View Details"
                            onClick={() => navigate(`/register-dashboard/security-card-details/${card.card_uuid}`)}
                          >
                            <Visibility />
                          </IconButton>
                          {card.is_active ? (
                            <IconButton
                              size="small"
                              sx={{ color: 'orange' }}
                              title="Deactivate Card"
                              onClick={() => setActionDialog({ open: true, card, actionType: 'deactivate' })}
                            >
                              <Cancel />
                            </IconButton>
                          ) : (
                            <IconButton
                              size="small"
                              sx={{ color: 'green' }}
                              title="Activate Card"
                              onClick={() => setActionDialog({ open: true, card, actionType: 'activate' })}
                            >
                              <CheckCircle />
                            </IconButton>
                          )}
                           <IconButton
                            size="small"
                            sx={{ color: '#d32f2f' }}
                            title="Delete Card"
                            onClick={() => {
                              // setActionDialog({ open: true, card, actionType: 'delete' })
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalCount > pageSize && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Pagination
                count={Math.ceil(totalCount / pageSize) || 1}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Card>

        <Dialog
          open={actionDialog.open}
          onClose={() => setActionDialog({ open: false, card: null, actionType: 'activate' })}
        >
          <DialogTitle>Confirm {actionDialog.actionType}</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {actionDialog.actionType} the card for "{actionDialog.card?.card_holder_name}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setActionDialog({ open: false, card: null, actionType: 'activate' })}
              sx={{ color: colors.secondary.main }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCardAction}
              color={actionDialog.actionType === 'delete' ? 'error' : 'primary'}
              variant="contained"
            >
              {actionDialog.actionType.charAt(0).toUpperCase() + actionDialog.actionType.slice(1)}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ViewSecurityCards;