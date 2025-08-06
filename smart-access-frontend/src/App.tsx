import React, { useState } from 'react';
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
import './styles/global.css';

type CurrentPage = 'home' | 'admin-login' | 'registration-login' | 'otp-verify' | 'admin-dashboard' | 'registers-dashboard';

interface OTPData {
  sessionId: string;
  userType: 'administrator' | 'registration_officer';
  userEmail: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [otpData, setOtpData] = useState<OTPData | null>(null);

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

  const handleBackToLogin = () => {
    // Go back to the appropriate login page based on current user type
    if (otpData?.userType === 'administrator') {
      setCurrentPage('admin-login');
    } else {
      setCurrentPage('registration-login');
    }
    setOtpData(null);
  };

  const handleLoginSuccess = (sessionId: string, userEmail: string) => {
    // Determine user type based on current page
    const userType = currentPage === 'admin-login' ? 'administrator' : 'registration_officer';
    
    setOtpData({
      sessionId,
      userType,
      userEmail
    });
    setCurrentPage('otp-verify');
  };

  const handleOTPVerified = (userType: string) => {
    // Redirect to appropriate dashboard based on user type
    if (userType === 'administrator') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('registers-dashboard');
    }
    setOtpData(null);
  };

  const handleLogout = () => {
    setCurrentPage('home');
    setOtpData(null);
  };

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
        return <RegistersDashboard />;
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
