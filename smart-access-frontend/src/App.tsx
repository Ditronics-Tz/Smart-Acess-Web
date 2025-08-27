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
import LoginTypeModal from './components/common/LoginTypeModal';
import AuthService from './service/AuthService';
import './styles/global.css';

type CurrentPage = 'home' | 'admin-login' | 'registration-login' | 'otp-verify' | 'admin-dashboard' | 'registers-dashboard';

// Keep OTP interface for future use but not currently needed
interface OTPData {
  sessionId: string;
  userType: 'administrator' | 'registration_officer';
  userEmail: string;
}

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [otpData, setOtpData] = useState<OTPData | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'administrator' | 'registration_officer' | null>(null);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        console.log('Checking authentication status...');

        // Check for access tokens directly from localStorage
        const accessToken = localStorage.getItem('access_token');
        const storedUserType = localStorage.getItem('user_type') as 'administrator' | 'registration_officer' | null;

        console.log('Access token exists:', !!accessToken);
        console.log('User type:', storedUserType);

        if (accessToken && storedUserType) {
          setIsAuthenticated(true);
          setUserType(storedUserType);
        } else {
          setIsAuthenticated(false);
          setUserType(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear any corrupted tokens
        localStorage.clear();
        setIsAuthenticated(false);
        setUserType(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const handleSelectLoginType = (type: 'admin' | 'registration') => {
    if (type === 'admin') {
      window.location.href = '/admin-login';
    } else {
      window.location.href = '/registration-login';
    }
    setLoginModalOpen(false);
  };

  const handleBackToHome = () => {
    window.location.href = '/';
    setOtpData(null);
  };

  const handleBackToSelection = () => {
    setLoginModalOpen(true);
    setOtpData(null);
  };

  // Updated: Direct login success handler (no OTP step)
  const handleLoginSuccess = (userType: string) => {
    // Update authentication state
    setIsAuthenticated(true);
    setUserType(userType as 'administrator' | 'registration_officer');

    // Redirect directly to appropriate dashboard since OTP is disabled
    if (userType === 'administrator') {
      window.location.href = '/admin-dashboard';
    } else if (userType === 'registration_officer') {
      window.location.href = '/registration-dashboard';
    }
    setOtpData(null);
  };

  // Keep for backward compatibility but not currently used
  const handleBackToLogin = () => {
    // Go back to the appropriate login page based on current user type
    if (otpData?.userType === 'administrator') {
      window.location.href = '/admin-login';
    } else {
      window.location.href = '/registration-login';
    }
    setOtpData(null);
  };

    // Keep for future OTP implementation
  const handleOTPVerified = (userType: string) => {
    // Update authentication state
    setIsAuthenticated(true);
    setUserType(userType as 'administrator' | 'registration_officer');

    // Redirect to appropriate dashboard based on user type
    if (userType === 'administrator') {
      window.location.href = '/admin-dashboard';
    } else if (userType === 'registration_officer') {
      window.location.href = '/registration-dashboard';
    }
    setOtpData(null);
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out user');
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // If logout fails, clear localStorage anyway
      localStorage.clear();
    } finally {
      // Update state and redirect to home
      setIsAuthenticated(false);
      setUserType(null);
      window.location.href = '/';
      setOtpData(null);
    }
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, requiredUserType }: { children: React.ReactNode; requiredUserType?: 'administrator' | 'registration_officer' }) => {
    if (isCheckingAuth) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Loading...</p>
        </div>
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

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Loading...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Layout onLoginClick={handleLoginClick}>
                <Home onLoginClick={handleLoginClick} />
              </Layout>
            }
          />

          <Route
            path="/admin-login"
            element={
              <AdminLogin
                onBackToHome={handleBackToHome}
                onBackToSelection={handleBackToSelection}
                onLoginSuccess={handleLoginSuccess}
              />
            }
          />

          <Route
            path="/registration-login"
            element={
              <RegistrationLogin
                onBackToHome={handleBackToHome}
                onBackToSelection={handleBackToSelection}
                onLoginSuccess={handleLoginSuccess}
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

          {/* Admin Dashboard Nested Routes */}
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
                <Box sx={{ width: "100vw", height: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4">Users Management - Coming Soon</Typography>
                </Box>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard/reports"
            element={
              <ProtectedRoute requiredUserType="administrator">
                <Box sx={{ width: "100vw", height: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4">Reports - Coming Soon</Typography>
                </Box>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard/settings"
            element={
              <ProtectedRoute requiredUserType="administrator">
                <Box sx={{ width: "100vw", height: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4">Settings - Coming Soon</Typography>
                </Box>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard/security"
            element={
              <ProtectedRoute requiredUserType="administrator">
                <Box sx={{ width: "100vw", height: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4">Security Management - Coming Soon</Typography>
                </Box>
              </ProtectedRoute>
            }
          />

          {/* Protected Registration Officer Routes */}
          <Route
            path="/registration-dashboard"
            element={
              <ProtectedRoute requiredUserType="registration_officer">
                <RegistersDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <LoginTypeModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onSelectLoginType={handleSelectLoginType}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
