import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/themes/themes';
import Layout from './components/layout/Layout';
import Home from './views/Home';
import AdminLogin from './views/Auth/AdminLogin';
import RegistrationLogin from './views/Auth/RegistrationLogin';
import OTPVerifyView from './views/Auth/OTPVerifyView';
import AdminDashboard from './views/Admin/Dashboard';
import RegistersDashboard from './views/Registers/Dashboard';
import CreateUser from './views/Admin/User/CreateUser';
import ViewUser from './views/Admin/User/ViewUser';
import ManageUser from './views/Admin/User/ManageUser';
import ViewUserDetails from './views/Admin/User/ViewUserDetails';
import ViewSecurity from './views/Admin/Security/ViewSecurity';
import AddSecurity from './views/Admin/Security/AddSecurity';
import ViewSecurityDetails from './views/Admin/Security/ViewSecurityDetails';
import ManageSecurity from './views/Admin/Security/ManageSecurity';
import ViewLocations from './views/Admin/Physical-Locations/ViewLocations';
import AddLocations from './views/Admin/Physical-Locations/AddLocations';
import ViewLocationDetails from './views/Admin/Physical-Locations/ViewLocationdetails';
import ManageLocations from './views/Admin/Physical-Locations/ManageLocations';
import ViewGates from './views/Admin/Gates/ViewGates';
import ViewGatesDetails from './views/Admin/Gates/ViewGatesDetails';
import ManageGates from './views/Admin/Gates/ManageGates';
import AddGates from './views/Admin/Gates/AddGates';
import LoginTypeModal from './components/common/LoginTypeModal';
import AuthService from './service/AuthService';
import AccessControl from './views/Admin/AccessControl/AccessControl';
import Setting from './views/Admin/Setting';

// Import Student Management Components
import AddStudent from './views/Registers/Student/AddStudent';
import ViewStudent from './views/Registers/Student/ViewStudent';
import ViewStudentDetails from './views/Registers/Student/ViewStudentDetails';
import CsvUpload from './views/Registers/Student/CsvUpload';

// Import Staff Management Components
import AddStaff from './views/Registers/Staff/AddStaff';
import ViewStaff from './views/Registers/Staff/ViewStaff';
import ViewStaffDetails from './views/Registers/Staff/ViewStaffDetails';
import StaffCsvUpload from './views/Registers/Staff/StaffCsv';

// Import Card Management Components
import AddCard from './views/Registers/Card/AddCard';
import ViewCards from './views/Registers/Card/ViewCards';
import ViewCardDetails from './views/Registers/Card/ViewCardDetails';
import ManageCard from './views/Registers/Card/ManageCard';

import './styles/global.css';

// OTP Context for passing data between components
interface OTPData {
  sessionId: string;
  userType: 'administrator' | 'registration_officer';
  userEmail: string;
}

interface OTPContextType {
  otpData: OTPData | null;
  setOTPData: (data: OTPData | null) => void;
}

const OTPContext = createContext<OTPContextType | undefined>(undefined);

export const useOTP = () => {
  const context = useContext(OTPContext);
  if (context === undefined) {
    throw new Error('useOTP must be used within an OTPProvider');
  }
  return context;
};

// Coming Soon Component for Registration Officer routes
const ComingSoonPage: React.FC<{ title: string; description: string; icon?: React.ReactNode }> = ({ 
  title, 
  description, 
  icon 
}) => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/register-dashboard');
  };

  return (
    <Box sx={{ 
      width: "100vw", 
      height: "100vh", 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      gap: 3
    }}>
      {icon && (
        <Box sx={{ fontSize: '4rem', color: '#F87060' }}>
          {icon}
        </Box>
      )}
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#102542', textAlign: 'center' }}>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ color: '#666666', textAlign: 'center', maxWidth: '600px' }}>
        {description}
      </Typography>
      <Typography variant="body1" sx={{ color: '#999999', textAlign: 'center' }}>
        This feature is currently under development and will be available soon.
      </Typography>
      <Box 
        onClick={handleBackToDashboard}
        sx={{ 
          mt: 2,
          px: 4,
          py: 2,
          backgroundColor: '#F87060',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#e55a4a'
          }
        }}
      >
        Back to Dashboard
      </Box>
    </Box>
  );
};

// Home component wrapper to handle modal and navigation
const HomeWrapper: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleLoginTypeSelect = (type: 'admin' | 'registration') => {
    setShowLoginModal(false);
    if (type === 'admin') {
      navigate('/admin-login');
    } else {
      navigate('/registration-login');
    }
  };

  return (
    <Layout>
      <Home onLoginClick={handleLoginClick} />
      <LoginTypeModal
        open={showLoginModal}
        onClose={handleCloseModal}
        onSelectLoginType={handleLoginTypeSelect}
      />
    </Layout>
  );
};

// Auth wrapper components to handle navigation
const AdminLoginWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { setOTPData } = useOTP();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleBackToSelection = () => {
    navigate('/');
  };

  const handleLoginSuccess = (userType: string, sessionId?: string, userEmail?: string) => {
    if (userType === 'administrator') {
      if (sessionId && userEmail) {
        // If OTP is required
        setOTPData({
          sessionId,
          userType: 'administrator',
          userEmail
        });
        navigate('/otp-verify');
      } else {
        // Direct login
        navigate('/admin-dashboard');
      }
    }
  };

  return (
    <AdminLogin
      onBackToHome={handleBackToHome}
      onBackToSelection={handleBackToSelection}
      onLoginSuccess={handleLoginSuccess}
    />
  );
};

const RegistrationLoginWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { setOTPData } = useOTP();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleBackToSelection = () => {
    navigate('/');
  };

  const handleLoginSuccess = (userType: string, sessionId?: string, userEmail?: string) => {
    if (userType === 'registration_officer') {
      if (sessionId && userEmail) {
        // If OTP is required
        setOTPData({
          sessionId,
          userType: 'registration_officer',
          userEmail
        });
        navigate('/otp-verify');
      } else {
        // Direct login
        navigate('/register-dashboard');
      }
    }
  };

  return (
    <RegistrationLogin
      onBackToHome={handleBackToHome}
      onBackToSelection={handleBackToSelection}
      onLoginSuccess={handleLoginSuccess}
    />
  );
};

const OTPVerifyWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { otpData, setOTPData } = useOTP();

  const handleBackToLogin = () => {
    if (otpData?.userType === 'administrator') {
      navigate('/admin-login');
    } else {
      navigate('/registration-login');
    }
  };

  const handleBackToHome = () => {
    setOTPData(null);
    navigate('/');
  };

  const handleOTPVerified = (userType: string) => {
    setOTPData(null);
    if (userType === 'administrator') {
      navigate('/admin-dashboard');
    } else {
      navigate('/register-dashboard');
    }
  };

  if (!otpData) {
    return <Navigate to="/" replace />;
  }

  return (
    <OTPVerifyView
      sessionId={otpData.sessionId}
      userType={otpData.userType}
      userEmail={otpData.userEmail}
      onBackToLogin={handleBackToLogin}
      onBackToHome={handleBackToHome}
      onOTPVerified={handleOTPVerified}
    />
  );
};

// Logout wrapper to handle navigation
const LogoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { setOTPData } = useOTP();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setOTPData(null);
      navigate('/');
    }
  };

  // Pass onLogout prop to children if they expect it
  if (React.isValidElement(children)) {
    return React.cloneElement(children, { onLogout: handleLogout } as any);
  }
  
  return <>{children}</>;
};

// Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'administrator' | 'registration_officer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      const storedUserType = localStorage.getItem('user_type');
      
      if (!token || !storedUserType) {
        setIsAuthenticated(false);
        return;
      }

      setUserType(storedUserType);
      setIsAuthenticated(true);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// CreateUser wrapper to handle navigation
const CreateUserWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/admin-dashboard');
  };

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <CreateUser onBack={handleBack} />
    </Box>
  );
};

function App() {
  const [otpData, setOTPData] = useState<OTPData | null>(null);

  return (
    <OTPContext.Provider value={{ otpData, setOTPData }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeWrapper />} />
            
            {/* Auth Routes */}
            <Route path="/admin-login" element={<AdminLoginWrapper />} />
            <Route path="/registration-login" element={<RegistrationLoginWrapper />} />
            <Route path="/otp-verify" element={<OTPVerifyWrapper />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <LogoutWrapper>
                    <AdminDashboard />
                  </LogoutWrapper>
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard Nested Routes - User Management */}
            <Route
              path="/admin-dashboard/create-user"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <CreateUserWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/users"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ViewUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/users/manage/:userId"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ManageUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/users/view/:userId"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ViewUserDetails />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard Nested Routes - Security Personnel */}
            <Route
              path="/admin-dashboard/security"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ViewSecurity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/security/add"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <AddSecurity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/security/view/:securityId"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ViewSecurityDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/security/manage/:securityId"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ManageSecurity />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard Nested Routes - Physical Locations */}
            <Route
              path="/admin-dashboard/locations"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ViewLocations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/locations/create"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <AddLocations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/locations/view/:locationId"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ViewLocationDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/locations/manage/:locationId"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ManageLocations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/locations/edit/:locationId"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ManageLocations />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard Nested Routes - Access Gates */}
            <Route
              path="/admin-dashboard/gates"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ViewGates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/gates/create"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <AddGates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/gates/view/:gateId"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ViewGatesDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/gates/edit/:gateId"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <ManageGates />
                </ProtectedRoute>
              }
            />

            {/* Other Admin Routes */}
            <Route
              path="/admin-dashboard/reports"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <Box sx={{ width: "100vw", height: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h4">Reports View - Coming Soon</Typography>
                  </Box>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/settings"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <Setting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/access-control"
              element={
                <ProtectedRoute requiredUserType="administrator">
                  <AccessControl />
                </ProtectedRoute>
              }
            />

            {/* Protected Registration Officer Routes */}
            <Route
              path="/register-dashboard"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <LogoutWrapper>
                    <RegistersDashboard />
                  </LogoutWrapper>
                </ProtectedRoute>
              }
            />

            {/* Registration Officer Dashboard - Student Management Routes */}
            <Route
              path="/register-dashboard/add-student"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <AddStudent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-dashboard/manage-students"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <ViewStudent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-dashboard/student-details/:studentUuid"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <ViewStudentDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-dashboard/bulk-upload"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <CsvUpload />
                </ProtectedRoute>
              }
            />

            {/* Registration Officer Dashboard - Staff Management Routes */}
            <Route
              path="/register-dashboard/add-staff"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <AddStaff />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-dashboard/manage-staff"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <ViewStaff />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-dashboard/staff-details/:staffUuid"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <ViewStaffDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-dashboard/staff-csv-upload"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <StaffCsvUpload />
                </ProtectedRoute>
              }
            />

            {/* Registration Officer Dashboard - Card Management Routes */}
            <Route
              path="/register-dashboard/manage-cards"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <ManageCard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-dashboard/add-card"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <AddCard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-dashboard/view-cards"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <ViewCards />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-dashboard/view-card-details/:cardUuid"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <ViewCardDetails />
                </ProtectedRoute>
              }
            />

            {/* Registration Officer Dashboard - Coming Soon Routes */}
            <Route
              path="/register-dashboard/search"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <ComingSoonPage 
                    title="Student Search" 
                    description="Advanced search functionality to quickly find students by name, registration number, department, or program."
                    icon={<span>🔍</span>}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-dashboard/reports"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <ComingSoonPage 
                    title="Student Reports" 
                    description="Generate comprehensive reports on student enrollment, demographics, academic status, and registration analytics."
                    icon={<span>📊</span>}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-dashboard/settings"
              element={
                <ProtectedRoute requiredUserType="registration_officer">
                  <ComingSoonPage 
                    title="Registration Settings" 
                    description="Configure registration preferences, notification settings, and personal account management."
                    icon={<span>⚙️</span>}
                  />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </OTPContext.Provider>
  );
}

export default App;
