import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import LoginTypeModal from './components/common/LoginTypeModal';
import AuthService from './service/AuthService';
import AccessControl from './views/Admin/AccessControl/AccessControl';
import './styles/global.css';

##  rpouting   not working  

type CurrentPage = 'home' | 'admin-login' | 'registration-login' | 'otp-verify' | 'admin-dashboard' | 'registers-dashboard';

interface OTPData {
  sessionId: string;
  userType: 'administrator' | 'registration_officer';
  userEmail: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'administrator' | 'registration_officer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

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

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [otpData, setOTPData] = useState<OTPData | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkExistingLogin = async () => {
      const token = localStorage.getItem('access_token');
      const userType = localStorage.getItem('user_type');
      
      if (token && userType) {
        if (userType === 'administrator') {
          setCurrentPage('admin-dashboard');
        } else if (userType === 'registration_officer') {
          setCurrentPage('registers-dashboard');
        }
      }
    };

    checkExistingLogin();
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleLoginTypeSelect = (type: 'admin' | 'registration') => {
    setShowLoginModal(false);
    if (type === 'admin') {
      setCurrentPage('admin-login');
    } else {
      setCurrentPage('registration-login');
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setOTPData(null);
  };

  const handleBackToSelection = () => {
    setShowLoginModal(true);
    setCurrentPage('home');
  };

  const handleBackToLogin = () => {
    if (otpData?.userType === 'administrator') {
      setCurrentPage('admin-login');
    } else {
      setCurrentPage('registration-login');
    }
    setOTPData(null);
  };

  // Fixed: Match the expected signature (userType: string) => void
  const handleAdminLoginSuccess = (userType: string) => {
    if (userType === 'administrator') {
      setCurrentPage('admin-dashboard');
    }
  };

  // Fixed: Match the expected signature (userType: string) => void
  const handleRegistrationLoginSuccess = (userType: string) => {
    if (userType === 'registration_officer') {
      setCurrentPage('registers-dashboard');
    }
  };

  const handleOTPVerified = (userType: string) => {
    if (userType === 'administrator') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('registers-dashboard');
    }
    setOTPData(null);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setCurrentPage('home');
      setOTPData(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Layout>
                <Home onLoginClick={handleLoginClick} />
                <LoginTypeModal
                  open={showLoginModal}
                  onClose={handleCloseModal}
                  onSelectLoginType={handleLoginTypeSelect}
                />
              </Layout>
            }
          />
          
          {/* Auth Routes */}
          <Route
            path="/admin-login"
            element={
              <AdminLogin
                onBackToHome={handleBackToHome}
                onBackToSelection={handleBackToSelection}
                onLoginSuccess={handleAdminLoginSuccess}
              />
            }
          />
          <Route
            path="/registration-login"
            element={
              <RegistrationLogin
                onBackToHome={handleBackToHome}
                onBackToSelection={handleBackToSelection}
                onLoginSuccess={handleRegistrationLoginSuccess}
              />
            }
          />
          <Route
            path="/otp-verify"
            element={
              otpData ? (
                <OTPVerifyView
                  sessionId={otpData.sessionId}
                  userType={otpData.userType}
                  userEmail={otpData.userEmail}
                  onBackToLogin={handleBackToLogin}
                  onBackToHome={handleBackToHome}
                  onOTPVerified={handleOTPVerified}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredUserType="administrator">
                <AdminDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard Nested Routes - User Management */}
          <Route
            path="/admin-dashboard/create-user"
            element={
              <ProtectedRoute requiredUserType="administrator">
                <Box sx={{ width: "100vw", height: "100vh" }}>
                  <CreateUser onBack={() => window.location.href = '/admin-dashboard'} />
                </Box>
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
                <Box sx={{ width: "100vw", height: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4">Add Security Personnel - Coming Soon</Typography>
                </Box>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/security/view/:securityId"
            element={
              <ProtectedRoute requiredUserType="administrator">
                <Box sx={{ width: "100vw", height: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4">View Security Personnel Details - Coming Soon</Typography>
                </Box>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/security/manage/:securityId"
            element={
              <ProtectedRoute requiredUserType="administrator">
                <Box sx={{ width: "100vw", height: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4">Manage Security Personnel - Coming Soon</Typography>
                </Box>
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
                <Box sx={{ width: "100vw", height: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4">Settings View - Coming Soon</Typography>
                </Box>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/locations"
            element={
              <ProtectedRoute requiredUserType="administrator">
                <Box sx={{ width: "100vw", height: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4">Physical Locations - Coming Soon</Typography>
                </Box>
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
            path="/registers-dashboard"
            element={
              <ProtectedRoute requiredUserType="registration_officer">
                <RegistersDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
