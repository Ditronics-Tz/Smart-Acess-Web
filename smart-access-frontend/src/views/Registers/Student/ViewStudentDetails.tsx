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
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  PhotoCamera,
  Upload,
  Person,
  School,
  Phone,
  Badge,
  CalendarToday,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import StudentService, { Student } from '../../../service/StudentService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

const ViewStudentDetails: React.FC = () => {
  const navigate = useNavigate();
  const { studentUuid } = useParams<{ studentUuid: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  
  // Photo upload states
  const [photoUploadDialog, setPhotoUploadDialog] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  
  // Webcam states
  const [useWebcam, setUseWebcam] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (studentUuid) {
      loadStudentDetails();
    }
  }, [studentUuid]);

  useEffect(() => {
    // Cleanup webcam on unmount or when dialog closes
    return () => {
      stopWebcam();
    };
  }, []);

  const loadStudentDetails = async () => {
    if (!studentUuid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await StudentService.getStudent(studentUuid);
      setStudent(data);
    } catch (error: any) {
      console.error('Error loading student details:', error);
      setError(error.message || 'Failed to load student details');
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
    navigate('/register-dashboard/manage-students');
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

  // Photo Upload Functions
  const handleOpenPhotoUpload = () => {
    setPhotoUploadDialog(true);
    setPhotoError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUseWebcam(false);
  };

  const handleClosePhotoUpload = () => {
    setPhotoUploadDialog(false);
    setPhotoError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUseWebcam(false);
    stopWebcam();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setPhotoError('Invalid file type. Only JPEG and PNG images are allowed.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setPhotoError('File size too large. Maximum size is 5MB.');
      return;
    }

    setSelectedFile(file);
    setPhotoError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      setWebcamStream(stream);
      setUseWebcam(true);
      setPhotoError(null);
      
      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error: any) {
      console.error('Error accessing webcam:', error);
      setPhotoError('Failed to access webcam. Please check permissions.');
    }
  };

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
    setUseWebcam(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'webcam-photo.jpg', { type: 'image/jpeg' });
        setSelectedFile(file);
        setPreviewUrl(canvas.toDataURL('image/jpeg'));
        stopWebcam();
      }
    }, 'image/jpeg', 0.95);
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile || !studentUuid) return;

    setUploadingPhoto(true);
    setPhotoError(null);

    try {
      const response = await StudentService.uploadStudentPhoto(studentUuid, selectedFile);
      setSuccess('Photo uploaded successfully!');
      handleClosePhotoUpload();
      
      // Reload student details to get updated photo URL
      await loadStudentDetails();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      setPhotoError(error.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading && !student) {
    return (
      <Box sx={{ display: "flex" }}>
        <RegisterSidebar 
          collapsed={sidebarCollapsed} 
          currentView="manage-students"
          onNavigate={handleSidebarNavigation}
        />
        <Box sx={{ 
          flex: 1, 
          ml: sidebarCollapsed ? "64px" : "280px",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh", 
          backgroundColor: "#f8f9fa",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2, color: colors.text.secondary }}>
              Loading student details...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error && !student) {
    return (
      <Box sx={{ display: "flex" }}>
        <RegisterSidebar 
          collapsed={sidebarCollapsed} 
          currentView="manage-students"
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
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ 
              backgroundColor: colors.primary.main,
              '&:hover': { backgroundColor: colors.primary.hover }
            }}
          >
            Back to Students
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <RegisterSidebar 
        collapsed={sidebarCollapsed} 
        currentView="manage-students"
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
              Student Details
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              View and manage student information
            </Typography>
          </Box>
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

        {student && (
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Photo Card */}
            <Card sx={{ flex: '0 0 auto', width: '350px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{ 
                      width: 200, 
                      height: 200,
                      bgcolor: colors.primary.main,
                      fontSize: '4rem'
                    }}
                    src={student.photo_url || undefined}
                  >
                    {!student.photo_url && (
                      <Person sx={{ fontSize: '8rem' }} />
                    )}
                  </Avatar>
                  
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main, textAlign: 'center' }}>
                    {`${student.first_name} ${student.middle_name ? student.middle_name + ' ' : ''}${student.surname}`}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    {student.registration_number}
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<PhotoCamera />}
                    onClick={handleOpenPhotoUpload}
                    fullWidth
                    sx={{ 
                      backgroundColor: colors.primary.main,
                      '&:hover': { backgroundColor: colors.primary.hover }
                    }}
                  >
                    {student.photo_url ? 'Update Photo' : 'Add Photo'}
                  </Button>

                  <Divider sx={{ width: '100%', my: 1 }} />

                  {/* Status Badges */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Student Status:
                      </Typography>
                      <Chip
                        label={student.student_status}
                        color={getStatusColor(student.student_status) as any}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Academic Status:
                      </Typography>
                      <Chip
                        label={student.academic_year_status}
                        color={getStatusColor(student.academic_year_status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Account Status:
                      </Typography>
                      <Chip
                        label={student.is_active ? 'Active' : 'Inactive'}
                        color={student.is_active ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                        icon={student.is_active ? <CheckCircle /> : <Cancel />}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card sx={{ flex: '1 1 500px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main, mb: 3 }}>
                  Personal Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {/* Registration Number */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Badge sx={{ color: colors.primary.main, mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                        Registration Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {student.registration_number}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  {/* Full Name */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Person sx={{ color: colors.primary.main, mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                        Full Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {`${student.first_name} ${student.middle_name ? student.middle_name + ' ' : ''}${student.surname}`}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            First Name:
                          </Typography>
                          <Typography variant="body2">{student.first_name}</Typography>
                        </Box>
                        {student.middle_name && (
                          <Box>
                            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                              Middle Name:
                            </Typography>
                            <Typography variant="body2">{student.middle_name}</Typography>
                          </Box>
                        )}
                        <Box>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            Surname:
                          </Typography>
                          <Typography variant="body2">{student.surname}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Divider />

                  {/* Department */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <School sx={{ color: colors.primary.main, mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                        Department
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {student.department}
                      </Typography>
                      {student.soma_class_code && (
                        <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.5 }}>
                          Class Code: {student.soma_class_code}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Divider />

                  {/* Mobile Phone */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Phone sx={{ color: colors.primary.main, mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                        Mobile Phone
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {student.mobile_phone || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  {/* Registration Dates */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <CalendarToday sx={{ color: colors.primary.main, mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                        Registration Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="body2">
                          <strong>Created:</strong> {new Date(student.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Last Updated:</strong> {new Date(student.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                        {student.deleted_at && (
                          <Typography variant="body2" sx={{ color: '#d32f2f' }}>
                            <strong>Deleted:</strong> {new Date(student.deleted_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Photo Upload Dialog */}
        <Dialog
          open={photoUploadDialog}
          onClose={handleClosePhotoUpload}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhotoCamera sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Upload Student Photo
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {photoError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {photoError}
              </Alert>
            )}

            {/* Upload Method Selection */}
            {!useWebcam && !previewUrl && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  onClick={() => fileInputRef.current?.click()}
                  fullWidth
                  sx={{ 
                    borderColor: colors.secondary.main,
                    color: colors.secondary.main,
                    py: 2
                  }}
                >
                  Upload from Computer
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  onClick={startWebcam}
                  fullWidth
                  sx={{ 
                    borderColor: colors.primary.main,
                    color: colors.primary.main,
                    py: 2
                  }}
                >
                  Capture from Webcam
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />

                <Typography variant="caption" sx={{ color: colors.text.secondary, textAlign: 'center', mt: 1 }}>
                  Accepted formats: JPEG, PNG (Max size: 5MB)
                </Typography>
              </Box>
            )}

            {/* Webcam View */}
            {useWebcam && !previewUrl && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box sx={{ 
                  position: 'relative', 
                  width: '100%', 
                  backgroundColor: '#000',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ width: '100%', display: 'block' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<PhotoCamera />}
                    onClick={capturePhoto}
                    fullWidth
                    sx={{ 
                      backgroundColor: colors.primary.main,
                      '&:hover': { backgroundColor: colors.primary.hover }
                    }}
                  >
                    Capture Photo
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={stopWebcam}
                    sx={{ 
                      borderColor: colors.secondary.main,
                      color: colors.secondary.main
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}

            {/* Preview */}
            {previewUrl && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  p: 2
                }}>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '400px',
                      borderRadius: '8px'
                    }} 
                  />
                </Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary, textAlign: 'center' }}>
                  {selectedFile?.name || 'Captured photo'}
                </Typography>
                <Button
                  variant="text"
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    setPhotoError(null);
                  }}
                  sx={{ color: colors.primary.main }}
                >
                  Choose Different Photo
                </Button>
              </Box>
            )}

            {/* Hidden canvas for webcam capture */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleClosePhotoUpload}
              disabled={uploadingPhoto}
              sx={{ color: colors.secondary.main }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadPhoto}
              disabled={!selectedFile || uploadingPhoto}
              variant="contained"
              sx={{ 
                backgroundColor: colors.primary.main,
                '&:hover': { backgroundColor: colors.primary.hover }
              }}
            >
              {uploadingPhoto ? <CircularProgress size={24} /> : 'Upload Photo'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ViewStudentDetails;
