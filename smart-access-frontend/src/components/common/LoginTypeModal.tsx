import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Fade
} from '@mui/material';
import {
  AdminPanelSettings,
  PersonAdd,
  Close
} from '@mui/icons-material';
import { colors } from '../../styles/themes/colors';

interface LoginTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelectLoginType: (type: 'admin' | 'registration') => void;
}

const LoginTypeModal: React.FC<LoginTypeModalProps> = ({
  open,
  onClose,
  onSelectLoginType
}) => {
  const loginTypes = [
    {
      type: 'admin' as const,
      title: 'Administrator',
      description: 'Access admin dashboard, manage users, and system settings',
      icon: <AdminPanelSettings sx={{ fontSize: 48, color: colors.primary.main }} />
    },
    {
      type: 'registration' as const,
      title: 'Registration Officer',
      description: 'Manage student registrations and access control permissions',
      icon: <PersonAdd sx={{ fontSize: 48, color: colors.primary.main }} />
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: colors.neutral.white
        }
      }}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        pb: 1,
        position: 'relative',
        color: colors.secondary.main,
        fontWeight: 'bold',
        fontSize: '1.5rem'
      }}>
        Select Login Type
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: colors.neutral.text
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2, pb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center'
        }}>
          {loginTypes.map((loginType) => (
            <Card
              key={loginType.type}
              sx={{
                flex: 1,
                cursor: 'pointer',
                border: `2px solid transparent`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: colors.primary.main,
                  boxShadow: `0 8px 24px ${colors.primary.light}`
                }
              }}
              onClick={() => {
                onSelectLoginType(loginType.type);
                onClose();
              }}
            >
              <CardContent sx={{ 
                textAlign: 'center', 
                p: 4,
                '&:last-child': { pb: 4 }
              }}>
                <Box sx={{ mb: 2 }}>
                  {loginType.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    color: colors.secondary.main,
                    mb: 2
                  }}
                >
                  {loginType.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {loginType.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginTypeModal;