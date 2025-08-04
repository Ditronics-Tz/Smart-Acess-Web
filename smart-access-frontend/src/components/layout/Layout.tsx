import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  onLoginClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavbar = true, 
  showFooter = true,
  onLoginClick
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showNavbar && <Navbar onLoginClick={onLoginClick} />}
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>
      {showFooter && <Footer />}
    </Box>
  );
};

export default Layout;
