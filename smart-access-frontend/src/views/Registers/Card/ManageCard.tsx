import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  CreditCard,
  Add,
  Visibility,
  Assessment,
  GroupAdd,
  PersonOff,
  TrendingUp,
  School,
  CheckCircle,
  Cancel,
  Warning,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CardService, { CardStatistics, StudentWithoutCard } from '../../../service/CardService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

const ManageCard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<CardStatistics | null>(null);
  const [studentsWithoutCards, setStudentsWithoutCards] = useState<StudentWithoutCard[]>([]);

  // Bulk operations state
  const [bulkDialog, setBulkDialog] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<StudentWithoutCard[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [generateRFID, setGenerateRFID] = useState(true);

  useEffect(() => {
    loadStatistics();
    loadStudentsWithoutCards();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const stats = await CardService.getCardStatistics();
      setStatistics(stats);
    } catch (error: any) {
      console.error('Error loading statistics:', error);
      setError(error.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsWithoutCards = async () => {
    try {
      const response = await CardService.getStudentsWithoutCards();
      setStudentsWithoutCards(response.students || []);
    } catch (error: any) {
      console.error('Error loading students without cards:', error);
    }
  };

  const handleBulkCreateCards = async () => {
    if (selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }

    setBulkLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const studentUuids = selectedStudents.map(s => s.student_uuid);
      const response = await CardService.bulkCreateCards({
        student_uuids: studentUuids,
        generate_rfid: generateRFID
      });

      setSuccess(
        `Successfully created ${response.summary.successful} cards. ` +
        (response.summary.failed > 0 ? `${response.summary.failed} failed.` : '')
      );

      setBulkDialog(false);
      setSelectedStudents([]);
      loadStatistics();
      loadStudentsWithoutCards();

    } catch (error: any) {
      setError(error.message || 'Failed to create cards');
    } finally {
      setBulkLoading(false);
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

  const handleRefresh = () => {
    loadStatistics();
    loadStudentsWithoutCards();
  };

  if (loading && !statistics) {
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
              Loading card management dashboard...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
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
              Card Management
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Manage student access cards and view system statistics
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Statistics Overview */}
          {statistics && (
            <>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.secondary.main, mb: 2 }}>
                  System Overview
                </Typography>
              </Box>

              {/* Main Statistics Cards */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                '& > *': { flex: '1 1 200px', minWidth: '200px' }
              }}>
                <Card sx={{ textAlign: 'center', py: 2 }}>
                  <CardContent>
                    <CreditCard sx={{ fontSize: 40, color: colors.primary.main, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.primary.main }}>
                      {statistics.summary.total_cards}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Total Cards
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ textAlign: 'center', py: 2 }}>
                  <CardContent>
                    <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      {statistics.summary.active_cards}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Active Cards
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ textAlign: 'center', py: 2 }}>
                  <CardContent>
                    <Cancel sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                      {statistics.summary.inactive_cards}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Inactive Cards
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ textAlign: 'center', py: 2 }}>
                  <CardContent>
                    <PersonOff sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                      {statistics.summary.students_without_cards}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Students Without Cards
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Coverage and Recent Activity */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                '& > *': { flex: '1 1 300px', minWidth: '300px' }
              }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <TrendingUp sx={{ color: colors.primary.main }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                        Coverage Statistics
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                        Coverage Percentage
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary.main }}>
                          {statistics.summary.coverage_percentage.toFixed(1)}%
                        </Typography>
                        <Chip 
                          label={statistics.summary.coverage_percentage >= 90 ? 'Excellent' : 
                                statistics.summary.coverage_percentage >= 75 ? 'Good' : 'Needs Improvement'}
                          color={statistics.summary.coverage_percentage >= 90 ? 'success' : 
                                statistics.summary.coverage_percentage >= 75 ? 'primary' : 'warning'}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                        Recent Cards (30 days)
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                        {statistics.summary.recent_cards_30_days}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Cards by Department */}
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <School sx={{ color: colors.primary.main }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                        Cards by Department
                      </Typography>
                    </Box>
                    
                    <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {statistics.cards_by_department.map((dept, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            {dept.student__department}
                          </Typography>
                          <Chip 
                            label={dept.count} 
                            size="small" 
                            variant="outlined"
                            sx={{ color: colors.primary.main, borderColor: colors.primary.main }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </>
          )}

          {/* Quick Actions */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.secondary.main, mb: 2 }}>
              Quick Actions
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap',
              '& > *': { flex: '1 1 250px', minWidth: '250px' }
            }}>
              <Card sx={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}
                    onClick={() => navigate('/register-dashboard/add-card')}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Add sx={{ fontSize: 48, color: colors.primary.main, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main, mb: 1 }}>
                    Create New Card
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Issue a new access card to a student
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}
                    onClick={() => navigate('/register-dashboard/view-cards')}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Visibility sx={{ fontSize: 48, color: colors.primary.main, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main, mb: 1 }}>
                    View All Cards
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Browse and manage existing cards
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}
                    onClick={() => setBulkDialog(true)}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <GroupAdd sx={{ fontSize: 48, color: colors.primary.main, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main, mb: 1 }}>
                    Bulk Create Cards
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Create cards for multiple students
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Assessment sx={{ fontSize: 48, color: colors.primary.main, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main, mb: 1 }}>
                    Generate Reports
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Export card usage and statistics
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Students Without Cards */}
          {studentsWithoutCards.length > 0 && (
            <Box>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Warning sx={{ color: '#ff9800' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                        Students Without Cards ({studentsWithoutCards.length})
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setBulkDialog(true)}
                      sx={{ 
                        borderColor: colors.primary.main,
                        color: colors.primary.main
                      }}
                    >
                      Create Cards
                    </Button>
                  </Box>
                  
                  <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <List dense>
                      {studentsWithoutCards.slice(0, 10).map((student) => (
                        <ListItem key={student.student_uuid}>
                          <ListItemIcon>
                            <PersonOff sx={{ color: '#ff9800' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={student.full_name}
                            secondary={`${student.registration_number} - ${student.department}`}
                          />
                          <Chip 
                            label={student.student_status} 
                            size="small" 
                            color={student.student_status === 'Enrolled' ? 'success' : 'default'}
                          />
                        </ListItem>
                      ))}
                      {studentsWithoutCards.length > 10 && (
                        <ListItem>
                          <ListItemText
                            primary={`... and ${studentsWithoutCards.length - 10} more students`}
                            sx={{ textAlign: 'center', color: colors.text.secondary }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

        {/* Bulk Create Cards Dialog */}
        <Dialog
          open={bulkDialog}
          onClose={() => setBulkDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Bulk Create Cards</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 3, color: colors.text.secondary }}>
              Select students to create cards for. Only students without existing cards are shown.
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <Autocomplete
                multiple
                options={studentsWithoutCards}
                getOptionLabel={(option) => `${option.full_name} (${option.registration_number})`}
                value={selectedStudents}
                onChange={(event, newValue) => setSelectedStudents(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Students"
                    placeholder="Choose students to create cards for..."
                  />
                )}
                disabled={bulkLoading}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>RFID Generation</InputLabel>
              <Select
                value={generateRFID ? 'auto' : 'manual'}
                onChange={(e) => setGenerateRFID(e.target.value === 'auto')}
                label="RFID Generation"
                disabled={bulkLoading}
              >
                <MenuItem value="auto">Auto-generate RFID numbers</MenuItem>
                <MenuItem value="manual">Manual RFID numbers (not recommended for bulk)</MenuItem>
              </Select>
            </FormControl>

            {selectedStudents.length > 0 && (
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Ready to create {selectedStudents.length} card{selectedStudents.length !== 1 ? 's' : ''}.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setBulkDialog(false)}
              disabled={bulkLoading}
              sx={{ color: colors.secondary.main }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkCreateCards}
              disabled={bulkLoading || selectedStudents.length === 0}
              variant="contained"
              sx={{ 
                backgroundColor: colors.primary.main,
                '&:hover': { backgroundColor: colors.primary.hover }
              }}
              startIcon={bulkLoading ? <CircularProgress size={16} /> : undefined}
            >
              {bulkLoading ? 'Creating Cards...' : `Create ${selectedStudents.length} Card${selectedStudents.length !== 1 ? 's' : ''}`}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ManageCard;
