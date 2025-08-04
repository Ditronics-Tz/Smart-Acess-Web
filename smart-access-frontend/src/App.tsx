import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/themes/themes';
import Layout from './components/layout/Layout';
import Home from './views/Home';
import AdminLogin from './views/Auth/AdminLogin';
import RegistrationLogin from './views/Auth/RegistrationLogin';
import LoginTypeModal from './components/common/LoginTypeModal';
import './styles/global.css';

type CurrentPage = 'home' | 'admin-login' | 'registration-login';

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
  };

  const handleBackToSelection = () => {
    setLoginModalOpen(true);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'admin-login':
        return (
          <AdminLogin 
            onBackToHome={handleBackToHome}
            onBackToSelection={handleBackToSelection}
          />
        );
      case 'registration-login':
        return (
          <RegistrationLogin 
            onBackToHome={handleBackToHome}
            onBackToSelection={handleBackToSelection}
          />
        );
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
