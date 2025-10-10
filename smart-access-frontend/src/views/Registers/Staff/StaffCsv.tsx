import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  Download,
  CheckCircle,
  Error,
  Info,
  FileUpload,
  Person,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import staffService, { CSVUploadResponse, ValidationInfoResponse } from '../../../service/StaffService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

const StaffCsvUpload: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<CSVUploadResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationInfo, setValidationInfo] = useState<ValidationInfoResponse | null>(null);
  const [loadingValidation, setLoadingValidation] = useState(false);

  React.useEffect(() => {
    loadValidationInfo();
  }, []);

  const loadValidationInfo = async () => {
    setLoadingValidation(true);
    try {
      const info = await staffService.getValidationInfo();
      setValidationInfo(info);
    } catch (error: any) {
      console.error('Failed to load validation info:', error);
      setError('Failed to load validation requirements');
    } finally {
      setLoadingValidation(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
      setUploadResult(null);

      // Validate file type
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError('Please select a CSV file (.csv extension)');
        setSelectedFile(null);
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        setSelectedFile(null);
        return;
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a CSV file first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setUploadResult(null);

    try {
      const result = await staffService.uploadCSV(selectedFile);
      
      setUploadResult(result);
      setSuccess(`Successfully uploaded! ${result.data.total_created} staff members created.`);
      setSelectedFile(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      setError(error.message || 'Failed to upload CSV file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await staffService.downloadCSVTemplateWithFilename();
    } catch (error: any) {
      setError(error.message || 'Failed to download template');
    }
  };

  const handleBack = () => {
    navigate('/register-dashboard');
  };

  const handleSidebarNavigation = (view: string) => {
    if (view === 'dashboard') {
      navigate('/register-dashboard');
    } else {
      navigate(`/register-dashboard/${view}`);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <RegisterSidebar 
        collapsed={sidebarCollapsed} 
        currentView="staff-csv-upload"
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
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
              Bulk Upload Staff
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Upload multiple staff records using CSV file (based on API documentation)
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

        {/* Upload Progress */}
        {loading && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CircularProgress size={24} />
                <Typography variant="body1">Uploading and processing CSV file...</Typography>
              </Box>
              <LinearProgress />
            </CardContent>
          </Card>
        )}

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Upload Section */}
          <Card sx={{ flex: '1 1 400px', minWidth: '350px' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <FileUpload sx={{ fontSize: 28, color: colors.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                  Upload CSV File
                </Typography>
              </Box>

              {/* Download Template */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa', border: `1px solid ${colors.primary.main}20` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Download sx={{ color: colors.primary.main }} />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Download CSV Template
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                  Download the template file with the correct format and required columns based on API documentation
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleDownloadTemplate}
                  sx={{ 
                    borderColor: colors.primary.main,
                    color: colors.primary.main,
                    '&:hover': {
                      borderColor: colors.primary.hover,
                      backgroundColor: colors.primary.light
                    }
                  }}
                >
                  Download Template
                </Button>
              </Paper>

              {/* File Selection */}
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />

              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: `2px dashed ${selectedFile ? colors.primary.main : '#ddd'}`,
                  backgroundColor: selectedFile ? colors.primary.light : '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: colors.primary.main,
                    backgroundColor: colors.primary.light
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUpload sx={{ 
                  fontSize: 48, 
                  color: selectedFile ? colors.primary.main : '#999',
                  mb: 2 
                }} />
                
                {selectedFile ? (
                  <Box>
                    <Typography variant="h6" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Size: {formatFileSize(selectedFile.size)}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 1 }}>
                      Click to select CSV file
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Or drag and drop your CSV file here (Max 5MB)
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Upload Button */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                  sx={{ 
                    backgroundColor: colors.primary.main,
                    '&:hover': { backgroundColor: colors.primary.hover },
                    px: 4
                  }}
                >
                  {loading ? 'Uploading...' : 'Upload CSV File'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Requirements & Guidelines */}
          <Card sx={{ flex: '1 1 400px', minWidth: '350px' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Info sx={{ fontSize: 28, color: colors.secondary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                  CSV Format Requirements
                </Typography>
              </Box>

              {loadingValidation ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : validationInfo ? (
                <Box>
                  {/* User Permissions Info */}
                  <Paper sx={{ p: 2, mb: 3, backgroundColor: '#e3f2fd' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Current User: {validationInfo.user_permissions.current_user}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      User Type: {validationInfo.user_permissions.user_type.replace('_', ' ').toUpperCase()}
                    </Typography>
                  </Paper>

                  {/* File Requirements */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: colors.secondary.main }}>
                    📋 File Requirements
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: 'green', fontSize: 20 }} /></ListItemIcon>
                      <ListItemText 
                        primary={`Format: ${validationInfo.file_requirements.format}`}
                        secondary={`Max Size: ${validationInfo.file_requirements.max_size}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: 'green', fontSize: 20 }} /></ListItemIcon>
                      <ListItemText 
                        primary={`Encoding: ${validationInfo.file_requirements.encoding}`}
                        secondary="Must be properly formatted CSV file"
                      />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  {/* Required Fields */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: colors.secondary.main }}>
                    ⚠️ Required CSV Headers (Must Match Exactly)
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Paper sx={{ p: 2, backgroundColor: '#fff3e0' }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        Your Staff Number:,Your Surname:,Your First_Name:,Your Department,Your Position
                      </Typography>
                    </Paper>
                  </Box>
                  <List dense>
                    {validationInfo.required_fields.map((field) => (
                      <ListItem key={field}>
                        <ListItemIcon><Error sx={{ color: 'red', fontSize: 16 }} /></ListItemIcon>
                        <ListItemText 
                          primary={field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)} 
                          secondary={
                            field === 'staff_number' ? validationInfo.validation_rules.staff_number :
                            field === 'department' ? validationInfo.validation_rules.department :
                            field === 'position' ? validationInfo.validation_rules.position :
                            'Required field'
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  {/* Optional Fields */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: colors.secondary.main }}>
                    📝 Optional CSV Headers
                  </Typography>
                  <List dense>
                    {validationInfo.optional_fields.map((field) => (
                      <ListItem key={field}>
                        <ListItemIcon><Info sx={{ color: 'blue', fontSize: 16 }} /></ListItemIcon>
                        <ListItemText 
                          primary={field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)}
                          secondary={
                            field === 'mobile_phone' ? validationInfo.validation_rules.mobile_phone :
                            field === 'employment_status' ? validationInfo.validation_rules.employment_status :
                            'Optional field'
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  {/* Employment Status Values */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: colors.secondary.main }}>
                    🏷️ Valid Employment Status Values
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {validationInfo.employment_status_choices.map((status) => (
                        <Chip 
                          key={status} 
                          label={status} 
                          size="small" 
                          color={getEmploymentStatusColor(status) as any}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Important Notes */}
                  <Paper sx={{ p: 2, mt: 3, backgroundColor: '#fff3e0', border: '1px solid #ffb74d' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Warning sx={{ color: '#f57c00', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#f57c00' }}>
                        Important Notes:
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                      • Headers must match exactly (case-sensitive)
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                      • Staff numbers must be unique across all staff
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                      • Mobile phone max 15 characters
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      • Empty cells for optional fields are allowed
                    </Typography>
                  </Paper>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: colors.text.secondary, textAlign: 'center', py: 4 }}>
                  Failed to load validation requirements
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Upload Results */}
        {uploadResult && (
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <CheckCircle sx={{ fontSize: 28, color: 'green' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.secondary.main }}>
                  Upload Results
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mb: 3 }}>
                <Paper sx={{ p: 3, flex: '1 1 200px', textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'green', mb: 1 }}>
                    {uploadResult.data.total_created}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                    Staff Created
                  </Typography>
                </Paper>

                {uploadResult.data.total_skipped > 0 && (
                  <Paper sx={{ p: 3, flex: '1 1 200px', textAlign: 'center', backgroundColor: '#fff3e0' }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'orange', mb: 1 }}>
                      {uploadResult.data.total_skipped}
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                      Records Skipped
                    </Typography>
                  </Paper>
                )}

                <Paper sx={{ p: 3, flex: '1 1 300px' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                    Upload Details
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                    Uploaded by: {uploadResult.data.uploaded_by.full_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                    User Type: {uploadResult.data.uploaded_by.user_type.replace('_', ' ').toUpperCase()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Timestamp: {new Date(uploadResult.data.uploaded_by.upload_timestamp).toLocaleString()}
                  </Typography>
                </Paper>
              </Box>

              {/* Created Staff Preview */}
              {uploadResult.data.staff_members && uploadResult.data.staff_members.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Created Staff Preview:
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Staff Number</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Mobile Phone</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Employment Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {uploadResult.data.staff_members.slice(0, 5).map((staff) => (
                          <TableRow key={staff.staff_uuid}>
                            <TableCell sx={{ fontWeight: 500 }}>
                              {staff.staff_number}
                            </TableCell>
                            <TableCell>
                              {`${staff.first_name} ${staff.middle_name ? staff.middle_name + ' ' : ''}${staff.surname}`}
                            </TableCell>
                            <TableCell>{staff.department}</TableCell>
                            <TableCell>{staff.position}</TableCell>
                            <TableCell>{staff.mobile_phone || 'N/A'}</TableCell>
                            <TableCell>
                              <Chip
                                label={staff.employment_status}
                                color={getEmploymentStatusColor(staff.employment_status) as any}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {uploadResult.data.staff_members.length > 5 && (
                    <Typography variant="body2" sx={{ mt: 1, color: colors.text.secondary, textAlign: 'center' }}>
                      ... and {uploadResult.data.staff_members.length - 5} more staff members
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default StaffCsvUpload;