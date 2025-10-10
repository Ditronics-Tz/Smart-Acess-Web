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
  Tooltip,
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Edit,
  Delete,
  Refresh,
  CreditCard,
  ArrowBack,
  PowerSettingsNew,
  Block,
  Person,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StaffCardService, { StaffWithoutCard, StaffCard, StaffCardFilters, StaffCardsListResponse } from '../../../service/StaffCardService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

const ViewStaffCard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<StaffCard[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Filter state
  const [filters, setFilters] = useState<StaffCardFilters>({
    search: '',
    is_active: undefined,
    staff__department: '',
    staff__employment_status: undefined,
    ordering: '-issued_date'
  });

  // Dropdown data
  const [departments, setDepartments] = useState<string[]>([]);
  const [summary, setSummary] = useState({
    total_cards: 0,
    active_cards: 0,
    inactive_cards: 0
  });

  // Action dialogs
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    card: StaffCard | null;
  }>({ open: false, card: null });

  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    card: StaffCard | null;
    action: 'activate' | 'deactivate';
  }>({ open: false, card: null, action: 'activate' });

  const employmentStatuses = ['Active', 'Inactive', 'Suspended', 'Terminated'];

  useEffect(() => {
    loadCards();
    loadDepartments();
  }, [page, filters]);

  const loadCards = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await StaffCardService.listStaffCards({
        ...filters,
        page,
        page_size: pageSize,
      });

      setCards(response.results || []);
      setTotalCount(response.count || 0);
      setSummary(response.summary || { total_cards: 0, active_cards: 0, inactive_cards: 0 });
    } catch (error: any) {
      console.error('Error loading staff cards:', error);
      setError(error.message || 'Failed to load staff cards');
      setCards([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      // Mock departments - replace with actual API call
      const mockDepartments = [
        'Computer Science',
        'Information Technology',
        'Human Resources',
        'Finance',
        'Administration',
        'Engineering'
      ];
      setDepartments(mockDepartments);
    } catch (error) {
      console.error('Failed to load departments:', error);
      setDepartments([]);
    }
  };

  const handleFilterChange = (field: keyof StaffCardFilters) => (
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
      staff__department: '',
      staff__employment_status: undefined,
      ordering: '-issued_date'
    });
    setPage(1);
  };

  const handleCardAction = async (card: StaffCard, action: 'activate' | 'deactivate') => {
    try {
      // This would be implemented in StaffCardService
      // if (action === 'activate') {
      //   await StaffCardService.activateCard(card.card_uuid);
      // } else {
      //   await StaffCardService.deactivateCard(card.card_uuid);
      // }
      setActionDialog({ open: false, card: null, action: 'activate' });
      loadCards(); // Refresh the list
    } catch (error: any) {
      setError(error.message || `Failed to ${action} card`);
    }
  };

  const handleDeleteCard = async (card: StaffCard) => {
    try {
      // await StaffCardService.deleteCard(card.card_uuid);
      setDeleteDialog({ open: false, card: null });
      loadCards(); // Refresh the list
    } catch (error: any) {
      setError(error.message || 'Failed to delete card');
    }
  };

  const getStatusColor = (status: string) => {
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
    navigate('/register-dashboard');
  };

  const handleViewCard = (cardUuid: string) => {
    navigate(`/register-dashboard/view-staff-card-details/${cardUuid}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
              Manage Staff Cards
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              View and manage staff access cards
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={loadCards}
            disabled={loading}
            sx={{ 
              backgroundColor: colors.primary.main,
              '&:hover': { backgroundColor: colors.primary.hover }
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: colors.primary.main, fontWeight: 'bold' }}>
                {summary.total_cards}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Total Cards
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                {summary.active_cards}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Active Cards
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                {summary.inactive_cards}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Inactive Cards
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Search and Filter Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Person sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                Search & Filter Staff Cards
              </Typography>
            </Box>

            {/* Search Bar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search by RFID, staff name, or staff number..."
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

            {/* Advanced Filters */}
            {showFilters && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <InputLabel>Card Status</InputLabel>
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
                    label="Card Status"
                  >
                    <MenuItem value="">All Cards</MenuItem>
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filters.staff__department || ''}
                    onChange={handleFilterChange('staff__department')}
                    label="Department"
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <InputLabel>Employment Status</InputLabel>
                  <Select
                    value={filters.staff__employment_status || ''}
                    onChange={handleFilterChange('staff__employment_status')}
                    label="Employment Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {employmentStatuses.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.ordering || '-issued_date'}
                    onChange={handleFilterChange('ordering')}
                    label="Sort By"
                  >
                    <MenuItem value="-issued_date">Newest First</MenuItem>
                    <MenuItem value="issued_date">Oldest First</MenuItem>
                    <MenuItem value="staff_name">Staff Name</MenuItem>
                    <MenuItem value="rfid_number">RFID Number</MenuItem>
                    <MenuItem value="staff_number">Staff Number</MenuItem>
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

        {/* Results Summary */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: colors.text.secondary }}>
            Showing {cards.length} of {totalCount} staff cards
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Page {page} of {Math.ceil(totalCount / pageSize) || 1}
          </Typography>
        </Box>

        {/* Cards Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>RFID Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Staff Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Staff Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Employment Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Card Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Issued Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2 }}>Loading staff cards...</Typography>
                    </TableCell>
                  </TableRow>
                ) : cards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {error ? 'Failed to load staff cards. Please try refreshing.' : 'No staff cards found matching your criteria'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  cards.map((card) => (
                    <TableRow key={card.card_uuid} hover>
                      <TableCell sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                        {card.rfid_number}
                      </TableCell>
                      <TableCell>{card.card_holder_name}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {card.card_holder_number}
                      </TableCell>
                      <TableCell>{card.department}</TableCell>
                      <TableCell>
                        <Chip
                          label={card.status}
                          color={getStatusColor(card.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={card.is_active ? 'Active' : 'Inactive'}
                          color={card.is_active ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDate(card.issued_date)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              sx={{ color: colors.primary.main }}
                              onClick={() => handleViewCard(card.card_uuid)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {card.is_active ? (
                            <Tooltip title="Deactivate Card">
                              <IconButton
                                size="small"
                                sx={{ color: '#ff9800' }}
                                onClick={() => setActionDialog({ 
                                  open: true, 
                                  card, 
                                  action: 'deactivate' 
                                })}
                              >
                                <Block />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Activate Card">
                              <IconButton
                                size="small"
                                sx={{ color: '#4caf50' }}
                                onClick={() => setActionDialog({ 
                                  open: true, 
                                  card, 
                                  action: 'activate' 
                                })}
                              >
                                <PowerSettingsNew />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete Card">
                            <IconButton
                              size="small"
                              sx={{ color: '#d32f2f' }}
                              onClick={() => setDeleteDialog({ open: true, card })}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, card: null })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the card for "{deleteDialog.card?.card_holder_name}" 
              (RFID: {deleteDialog.card?.rfid_number})?
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: colors.text.secondary }}>
              This action cannot be undone. The card will be permanently removed from the system.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialog({ open: false, card: null })}
              sx={{ color: colors.secondary.main }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteDialog.card && handleDeleteCard(deleteDialog.card)}
              color="error"
              variant="contained"
            >
              Delete Card
            </Button>
          </DialogActions>
        </Dialog>

        {/* Card Action Confirmation Dialog */}
        <Dialog
          open={actionDialog.open}
          onClose={() => setActionDialog({ open: false, card: null, action: 'activate' })}
        >
          <DialogTitle>
            Confirm {actionDialog.action === 'activate' ? 'Activation' : 'Deactivation'}
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {actionDialog.action} the card for "{actionDialog.card?.card_holder_name}" 
              (RFID: {actionDialog.card?.rfid_number})?
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: colors.text.secondary }}>
              {actionDialog.action === 'activate' 
                ? 'This will allow the card to be used for access control.'
                : 'This will prevent the card from being used for access control.'
              }
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setActionDialog({ open: false, card: null, action: 'activate' })}
              sx={{ color: colors.secondary.main }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => actionDialog.card && handleCardAction(actionDialog.card, actionDialog.action)}
              color={actionDialog.action === 'activate' ? 'success' : 'warning'}
              variant="contained"
            >
              {actionDialog.action === 'activate' ? 'Activate Card' : 'Deactivate Card'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ViewStaffCard;
