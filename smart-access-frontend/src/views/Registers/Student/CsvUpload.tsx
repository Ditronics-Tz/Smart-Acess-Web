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
import StudentService, { CSVUploadResponse, ValidationInfo } from '../../../service/StudentService';
import RegisterSidebar from '../shared/Sidebar';
import { colors } from '../../../styles/themes/colors';

const CsvUpload: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<CSVUploadResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationInfo, setValidationInfo] = useState<ValidationInfo | null>(null);
  const [loadingValidation, setLoadingValidation] = useState(false);

  React.useEffect(() => {
    loadValidationInfo();
  }, []);

  const loadValidationInfo = async () => {
    setLoadingValidation(true);
    try {
      const info = await StudentService.getValidationInfo();
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
      const result = await StudentService.uploadStudentCSV(selectedFile);
      
      setUploadResult(result);
      setSuccess(`Successfully uploaded! ${result.data.total_created} students created.`);
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
      await StudentService.downloadCSVTemplateAsFile('student_upload_template.csv');
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

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <RegisterSidebar 
        collapsed={sidebarCollapsed} 
        currentView="bulk-upload"
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
              Bulk Upload Students
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Upload multiple student records using CSV file (based on API documentation)
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
                      Current User: {validationInfo.user_permissions.full_name}
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
                        {validationInfo.required_fields.join(',')}
                      </Typography>
                    </Paper>
                  </Box>
                  <List dense>
                    {validationInfo.required_fields.map((field) => (
                      <ListItem key={field}>
                        <ListItemIcon><Error sx={{ color: 'red', fontSize: 16 }} /></ListItemIcon>
                        <ListItemText 
                          primary={field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)} 
                          secondary={field === 'registration_number' ? 'Must be unique' : 'Required field'}
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
                            field === 'mobile_phone' ? 'Format: +1234567890 (max 15 chars)' :
                            field === 'soma_class_code' ? 'Alphanumeric code' :
                            'Optional field'
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  {/* Status Values */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: colors.secondary.main }}>
                    🏷️ Valid Status Values
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Academic Year Status:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {validationInfo.academic_year_status_choices.map((status) => (
                        <Chip 
                          key={status} 
                          label={status} 
                          size="small" 
                          color={getStatusColor(status) as any}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Student Status:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {validationInfo.student_status_choices.map((status) => (
                        <Chip 
                          key={status} 
                          label={status} 
                          size="small" 
                          color={getStatusColor(status) as any}
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
                      • Registration numbers must be unique
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
                    Students Created
                  </Typography>
                </Paper>

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

              {/* Created Students Preview - removed program column */}
              {uploadResult.data.students && uploadResult.data.students.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Created Students Preview:
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Registration No.</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Mobile Phone</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {uploadResult.data.students.slice(0, 5).map((student) => (
                          <TableRow key={student.student_uuid}>
                            <TableCell sx={{ fontWeight: 500 }}>
                              {student.registration_number}
                            </TableCell>
                            <TableCell>
                              {`${student.first_name} ${student.middle_name ? student.middle_name + ' ' : ''}${student.surname}`}
                            </TableCell>
                            <TableCell>{student.department}</TableCell>
                            <TableCell>{student.mobile_phone || 'N/A'}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 0.5, flexDirection: 'column' }}>
                                <Chip
                                  label={student.student_status}
                                  color={getStatusColor(student.student_status) as any}
                                  size="small"
                                />
                                <Chip
                                  label={student.academic_year_status}
                                  color={getStatusColor(student.academic_year_status) as any}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {uploadResult.data.students.length > 5 && (
                    <Typography variant="body2" sx={{ mt: 1, color: colors.text.secondary, textAlign: 'center' }}>
                      ... and {uploadResult.data.students.length - 5} more students
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

export default CsvUpload;