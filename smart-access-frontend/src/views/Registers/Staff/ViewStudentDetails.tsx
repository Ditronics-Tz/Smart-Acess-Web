import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  Chip,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  PhotoCamera,
  Person,
  Work,
  Phone,
  Business,
  Badge,
  AccessTime,
  Save,
  Cancel,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import staffService, { Staff, StaffDetailsResponse, PhotoUploadResponse } from '../../../service/StaffService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

const ViewStaffDetails: React.FC = () => {
  const navigate = useNavigate();
  const { staffUuid } = useParams<{ staffUuid: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [staff, setStaff] = useState<StaffDetailsResponse | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState(false);
  
  // Photo upload dialog
  const [photoDialog, setPhotoDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  useEffect(() => {
    if (staffUuid) {
      loadStaffDetails();
    } else {
      setError('Staff UUID is required');
    }
  }, [staffUuid]);

  const loadStaffDetails = async () => {
    if (!staffUuid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const staffDetails = await staffService.getStaffDetails(staffUuid);
      setStaff(staffDetails);
    } catch (error: any) {
      setError(error.message || 'Failed to load staff details');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Please select a JPEG or PNG image file');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('Image file size must be less than 5MB');
        return;
      }

      setSelectedPhoto(file);
      setError(null);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedPhoto || !staffUuid) return;

    setUploadingPhoto(true);
    setError(null);

    try {
      const result: PhotoUploadResponse = await staffService.uploadStaffPhoto(staffUuid, selectedPhoto);
      setSuccess(`Photo uploaded successfully for ${staff?.first_name} ${staff?.surname}`);
      setPhotoDialog(false);
      setSelectedPhoto(null);
      
      // Refresh staff details to get updated photo URL
      loadStaffDetails();
    } catch (error: any) {
      setError(error.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffUuid) return;

    try {
      await staffService.deleteStaff(staffUuid);
      setSuccess('Staff member deleted successfully');
      // Navigate back after a delay
      setTimeout(() => {
        navigate('/register-dashboard/manage-staff');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to delete staff member');
    } finally {
      setDeleteDialog(false);
    }
  };

  const handleBack = () => {
    navigate('/register-dashboard/manage-staff');
  };

  const handleEdit = () => {
    // Navigate to edit staff view (to be implemented)
    console.log('Edit staff:', staffUuid);
  };

  const handleSidebarNavigation = (view: string) => {
    if (view === 'dashboard') {
      navigate('/register-dashboard');
    } else {
      navigate(`/register-dashboard/${view}`);
    }
  };

  const getEmploymentStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'warning';
      case 'Terminated':
        return 'error';
      case 'Retired':
        return 'info';
      case 'On Leave':
        return 'default';
      default:
        return 'default';
    }
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

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <RegisterSidebar 
          collapsed={sidebarCollapsed} 
          currentView="manage-staff"
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
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>Loading staff details...</Typography>
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
        currentView="manage-staff"
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
              Staff Details
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              {staff ? `${staff.first_name} ${staff.surname} - ${staff.staff_number}` : 'Staff information'}
            </Typography>
          </Box>
          
          {/* Action Buttons */}
          {staff && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<PhotoCamera />}
                onClick={() => setPhotoDialog(true)}
                sx={{ 
                  borderColor: colors.primary.main,
                  color: colors.primary.main
                }}
              >
                Upload Photo
              </Button>
              
              {staff.user_permissions?.can_modify && (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  sx={{ 
                    borderColor: colors.secondary.main,
                    color: colors.secondary.main
                  }}
                >
                  Edit Staff
                </Button>
              )}
              
              {staff.user_permissions?.can_delete && (
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialog(true)}
                  sx={{ 
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      backgroundColor: 'rgba(211, 47, 47, 0.04)'
                    }
                  }}
                >
                  Delete
                </Button>
              )}
            </Box>
          )}
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

        {/* Staff Details Card */}
        {staff && (
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Profile Card */}
            <Card sx={{ flex: '1 1 400px', minWidth: '350px' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                  <Avatar
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      backgroundColor: colors.primary.main,
                      fontSize: '2rem'
                    }}
                  >
                    {/* If staff has photo, show it, otherwise show initials */}
                    {staff.first_name?.charAt(0)}{staff.surname?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                      {staff.first_name} {staff.middle_name ? staff.middle_name + ' ' : ''}{staff.surname}
                    </Typography>
                    <Typography variant="h6" sx={{ color: colors.text.secondary }}>
                      {staff.position}
                    </Typography>
                    <Chip
                      label={staff.employment_status}
                      color={getEmploymentStatusColor(staff.employment_status) as any}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Personal Information */}
                <Typography variant="h6" sx={{ mb: 2, color: colors.secondary.main, fontWeight: 600 }}>
                  Personal Information
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Person sx={{ color: colors.primary.main }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Full Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {staff.first_name} {staff.middle_name ? staff.middle_name + ' ' : ''}{staff.surname}
                      </Typography>
                    </Box>
                  </Box>

                  {staff.mobile_phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Phone sx={{ color: colors.primary.main }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                          Mobile Phone
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {staff.mobile_phone}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Employment Details Card */}
            <Card sx={{ flex: '1 1 400px', minWidth: '350px' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, color: colors.secondary.main, fontWeight: 600 }}>
                  Employment Information
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Badge sx={{ color: colors.primary.main }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Staff Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {staff.staff_number}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Work sx={{ color: colors.primary.main }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Position
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {staff.position}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Business sx={{ color: colors.primary.main }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Department
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {staff.department}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AccessTime sx={{ color: colors.primary.main }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Employment Status
                      </Typography>
                      <Chip
                        label={staff.employment_status}
                        color={getEmploymentStatusColor(staff.employment_status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      backgroundColor: staff.is_active ? 'green' : 'red',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        backgroundColor: 'white'
                      }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Active Status
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {staff.is_active ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* System Information */}
                <Typography variant="h6" sx={{ mb: 2, color: colors.secondary.main, fontWeight: 600 }}>
                  System Information
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Created At
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(staff.created_at)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(staff.updated_at)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Photo Upload Dialog */}
        <Dialog
          open={photoDialog}
          onClose={() => setPhotoDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Upload Photo for {staff?.first_name} {staff?.surname}
          </DialogTitle>
          <DialogContent>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handlePhotoSelect}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                border: `2px dashed ${selectedPhoto ? colors.primary.main : '#ddd'}`,
                backgroundColor: selectedPhoto ? colors.primary.light : '#fafafa',
                cursor: 'pointer',
                mt: 2
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <PhotoCamera sx={{ 
                fontSize: 48, 
                color: selectedPhoto ? colors.primary.main : '#999',
                mb: 2 
              }} />
              
              {selectedPhoto ? (
                <Box>
                  <Typography variant="h6" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                    {selectedPhoto.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Size: {(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 1 }}>
                    Click to select photo
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    JPEG or PNG format, max 5MB
                  </Typography>
                </Box>
              )}
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setPhotoDialog(false);
                setSelectedPhoto(null);
              }}
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePhotoUpload}
              disabled={!selectedPhoto || uploadingPhoto}
              variant="contained"
              startIcon={uploadingPhoto ? <CircularProgress size={20} /> : <Save />}
              sx={{ 
                backgroundColor: colors.primary.main,
                '&:hover': { backgroundColor: colors.primary.hover }
              }}
            >
              {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the staff member "{staff?.first_name} {staff?.surname}" 
              (Staff Number: {staff?.staff_number})?
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: colors.text.secondary }}>
              This action will permanently remove the staff member from the system and cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialog(false)}
              sx={{ color: colors.secondary.main }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteStaff}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ViewStaffDetails;