import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { Badge } from '@mui/icons-material';
import { colors } from '../../styles/themes/colors';

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: colors.secondary.dark, color: colors.neutral.white, py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Badge sx={{ fontSize: 32, color: colors.primary.main, mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Smart Access
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
              Leading access control solutions designed specifically for educational institutions 
              and modern campus security needs.
            </Typography>
          </Box>
          
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: colors.primary.main }}>
              System Features
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Student Access Management</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Faculty & Staff Control</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Visitor Management</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Security Monitoring</Typography>
            </Stack>
          </Box>
          
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: colors.primary.main }}>
              Support
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Email: support@smartaccess.com
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Phone: +1 (555) 123-ACCESS
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                24/7 Technical Support
              </Typography>
            </Stack>
          </Box>
        </Box>
        
        <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${colors.primary.light}`, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            © 2025 Smart Access Control System. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
