import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Stack } from '@mui/material';
import { Badge, Login } from '@mui/icons-material';
import { colors } from '../../styles/themes/colors';

interface NavbarProps {
  onLoginClick?: () => void;
  showAuthButtons?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onLoginClick, 
  showAuthButtons = true 
}) => {
  const handleNavigation = (section: string) => {
    console.log(`Navigate to ${section}`);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        backgroundColor: colors.secondary.main,
        borderBottom: `3px solid ${colors.primary.main}`
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Badge sx={{ fontSize: 32, color: colors.primary.main, mr: 2 }} />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ fontWeight: 'bold', color: colors.neutral.white, cursor: 'pointer' }}
            onClick={() => handleNavigation('home')}
          >
            Smart Access
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button 
            sx={{ color: colors.neutral.white, fontWeight: 500 }}
            onClick={() => handleNavigation('features')}
          >
            Features
          </Button>
          <Button 
            sx={{ color: colors.neutral.white, fontWeight: 500 }}
            onClick={() => handleNavigation('solutions')}
          >
            Solutions
          </Button>
          <Button 
            sx={{ color: colors.neutral.white, fontWeight: 500 }}
            onClick={() => handleNavigation('support')}
          >
            Support
          </Button>
        </Stack>
        
        {showAuthButtons && (
          <Button 
            variant="contained" 
            onClick={onLoginClick}
            sx={{ 
              backgroundColor: colors.primary.main,
              fontWeight: 'bold',
              px: 3,
              ml: { xs: 0, md: 3 },
              '&:hover': { backgroundColor: colors.primary.hover }
            }}
            startIcon={<Login />}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
