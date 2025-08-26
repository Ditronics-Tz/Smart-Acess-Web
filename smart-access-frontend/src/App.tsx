import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/themes/themes';
import Layout from './components/layout/Layout';
import Home from './views/Home';
import AdminLogin from './views/Auth/AdminLogin';
import RegistrationLogin from './views/Auth/RegistrationLogin';
import OTPVerifyView from './views/Auth/OTPVerifyView';
import AdminDashboard from './views/Admin/Dashboard';
import RegistersDashboard from './views/Registers/Dashboard';
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
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [otpData, setOtpData] = useState<OTPData | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        console.log('Checking authentication status...');
        
        // Check for access tokens directly from localStorage
        const accessToken = localStorage.getItem('access_token');
        const userType = localStorage.getItem('user_type');
        
        console.log('Access token exists:', !!accessToken);
        console.log('User type:', userType);
        
        if (accessToken && userType) {
          if (userType === 'administrator') {
            console.log('Redirecting to admin dashboard');
            setCurrentPage('admin-dashboard');
          } else if (userType === 'registration_officer') {
            console.log('Redirecting to registration dashboard');
            setCurrentPage('registers-dashboard');
          } else {
            console.log('Unknown user type, staying on home');
            // Unknown user type, clear tokens and stay on home
            localStorage.clear();
          }
        } else {
          console.log('No valid authentication found, staying on home');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear any corrupted tokens
        localStorage.clear();
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
      setCurrentPage('admin-login');
    } else {
      setCurrentPage('registration-login');
    }
    setLoginModalOpen(false);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setOtpData(null);
  };

  const handleBackToSelection = () => {
    setLoginModalOpen(true);
    setOtpData(null);
  };

  // Updated: Direct login success handler (no OTP step)
  const handleLoginSuccess = (userType: string) => {
    // Redirect directly to appropriate dashboard since OTP is disabled
    if (userType === 'administrator') {
      setCurrentPage('admin-dashboard');
    } else if (userType === 'registration_officer') {
      setCurrentPage('registers-dashboard');
    }
    setOtpData(null);
  };

  // Keep for backward compatibility but not currently used
  const handleBackToLogin = () => {
    // Go back to the appropriate login page based on current user type
    if (otpData?.userType === 'administrator') {
      setCurrentPage('admin-login');
    } else {
      setCurrentPage('registration-login');
    }
    setOtpData(null);
  };

  // Keep for future OTP implementation
  const handleOTPVerified = (userType: string) => {
    // Redirect to appropriate dashboard based on user type
    if (userType === 'administrator') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('registers-dashboard');
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
      // Always redirect to home and clear state
      setCurrentPage('home');
      setOtpData(null);
    }
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

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'admin-login':
        return (
          <AdminLogin 
            onBackToHome={handleBackToHome}
            onBackToSelection={handleBackToSelection}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'registration-login':
        return (
          <RegistrationLogin 
            onBackToHome={handleBackToHome}
            onBackToSelection={handleBackToSelection}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'otp-verify':
        // Keep for future use but not currently accessed
        return otpData ? (
          <OTPVerifyView
            sessionId={otpData.sessionId}
            userType={otpData.userType}
            userEmail={otpData.userEmail}
            onBackToLogin={handleBackToLogin}
            onBackToHome={handleBackToHome}
            onOTPVerified={handleOTPVerified}
          />
        ) : null;
      case 'admin-dashboard':
        return <AdminDashboard onLogout={handleLogout} />;
      case 'registers-dashboard':
        return <RegistersDashboard onLogout={handleLogout} />;
      default:
        return (
          <Layout onLoginClick={handleLoginClick}>
            <Home onLoginClick={handleLoginClick} />
          </Layout>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {renderCurrentPage()}
      
      <LoginTypeModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSelectLoginType={handleSelectLoginType}
      />
    </ThemeProvider>
  );
}

export default App;
