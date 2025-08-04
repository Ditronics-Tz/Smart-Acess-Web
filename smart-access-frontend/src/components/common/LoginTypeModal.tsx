import React from 'react';
import {
  Dialog,
  DialogContent,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Fade,
  Divider,
  Stack
} from '@mui/material';
import {
  AdminPanelSettings,
  PersonAdd,
  Close,
  ArrowForward
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
      subtitle: 'System Management',
      description: 'Access admin dashboard, manage users, and control system settings',
      icon: <AdminPanelSettings sx={{ fontSize: 64, color: colors.primary.main }} />,
      bgGradient: `linear-gradient(135deg, ${colors.primary.light} 0%, rgba(248, 112, 96, 0.05) 100%)`
    },
    {
      type: 'registration' as const,
      title: 'Registration Officer',
      subtitle: 'Student Management',
      description: 'Manage student registrations and access control permissions',
      icon: <PersonAdd sx={{ fontSize: 64, color: colors.primary.main }} />,
      bgGradient: `linear-gradient(135deg, ${colors.secondary.light} 0%, rgba(16, 37, 66, 0.05) 100%)`
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backgroundColor: colors.neutral.white,
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
          border: `1px solid ${colors.primary.light}`,
          overflow: 'hidden'
        }
      }}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 400 }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
          color: colors.neutral.white,
          p: 4,
          position: 'relative',
          textAlign: 'center'
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: colors.neutral.white,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
        >
          <Close />
        </IconButton>
        
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Choose Your Access Level
        </Typography>
        <Typography
          variant="h6"
          sx={{
            opacity: 0.9,
            fontWeight: 400
          }}
        >
          Select your role to access the Smart Access Control System
        </Typography>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: { xs: 3, md: 6 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            sx={{ justifyContent: 'center' }}
          >
            {loginTypes.map((loginType, index) => (
              <Card
                key={loginType.type}
                sx={{
                  flex: 1,
                  maxWidth: { md: 400 },
                  cursor: 'pointer',
                  border: `3px solid transparent`,
                  borderRadius: 3,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: loginType.bgGradient,
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    borderColor: colors.primary.main,
                    boxShadow: `0 20px 40px rgba(248, 112, 96, 0.3)`,
                    '& .arrow-icon': {
                      transform: 'translateX(8px)',
                      opacity: 1
                    },
                    '& .card-content': {
                      transform: 'translateY(-4px)'
                    }
                  }
                }}
                onClick={() => {
                  onSelectLoginType(loginType.type);
                  onClose();
                }}
              >
                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${colors.primary.light} 0%, transparent 70%)`,
                    opacity: 0.3
                  }}
                />
                
                <CardContent 
                  className="card-content"
                  sx={{ 
                    p: 4,
                    textAlign: 'center',
                    transition: 'transform 0.3s ease',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 3,
                      borderRadius: '50%',
                      backgroundColor: colors.neutral.white,
                      mb: 3,
                      boxShadow: `0 8px 24px ${colors.primary.light}`,
                      border: `2px solid ${colors.primary.light}`
                    }}
                  >
                    {loginType.icon}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: colors.secondary.main,
                      mb: 1,
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    {loginType.title}
                  </Typography>

                  {/* Subtitle */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.primary.main,
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    {loginType.subtitle}
                  </Typography>

                  <Divider sx={{ my: 2, backgroundColor: colors.primary.light }} />

                  {/* Description */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.neutral.text,
                      lineHeight: 1.6,
                      mb: 3
                    }}
                  >
                    {loginType.description}
                  </Typography>

                  {/* Action Indicator */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      color: colors.primary.main,
                      fontWeight: 'bold'
                    }}
                  >
                    <Typography variant="button">
                      Click to Login
                    </Typography>
                    <ArrowForward
                      className="arrow-icon"
                      sx={{
                        fontSize: 20,
                        transition: 'all 0.3s ease',
                        opacity: 0.7
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginTypeModal;