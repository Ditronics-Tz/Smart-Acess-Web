import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PersonAdd,
  People,
  School,
  FileUpload,
  Assessment,
  Search,
  Settings,
} from '@mui/icons-material';
import { colors } from '../../../styles/themes/colors';

type RegisterSidebarProps = {
  collapsed?: boolean;
  currentView?: string;
  onNavigate?: (view: string) => void;
};

const links = [
  { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { id: "add-student", label: "Add Student", icon: <PersonAdd /> },
  { id: "manage-students", label: "Manage Students", icon: <People /> },
  { id: "student-search", label: "Student Search", icon: <Search /> },
  { id: "bulk-upload", label: "Bulk Upload", icon: <FileUpload /> },
  { id: "programs", label: "Programs", icon: <School /> },
  { id: "reports", label: "Reports", icon: <Assessment /> },
  { id: "settings", label: "Settings", icon: <Settings /> },
];

const RegisterSidebar: React.FC<RegisterSidebarProps> = ({ 
  collapsed = false, 
  currentView = "dashboard",
  onNavigate,
}) => {
  const handleItemClick = (linkId: string) => {
    onNavigate?.(linkId);
  };

  return (
    <Box
      sx={{
        width: collapsed ? 64 : 280,
        minWidth: collapsed ? 64 : 280,
        height: "100vh",
        background: "linear-gradient(180deg, #1a2332 0%, #0d1117 100%)",
        color: colors.neutral.white,
        boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        transition: "width 0.3s ease",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
        borderRight: "none",
      }}
    >
      {/* Brand Section */}
      <Box
        sx={{
          p: collapsed ? 2 : 3,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: collapsed ? 32 : 40,
            height: collapsed ? 32 : 40,
            background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.hover} 100%)`,
            border: "none",
          }}
        >
          <DashboardIcon sx={{ fontSize: collapsed ? 16 : 20, color: colors.neutral.white }} />
        </Avatar>
        {!collapsed && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: colors.neutral.white,
                lineHeight: 1.2,
                fontSize: "1.1rem",
              }}
            >
              Smart Access
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(248, 112, 96, 0.8)",
                fontSize: "0.75rem",
              }}
            >
              Registration Panel
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List sx={{ px: collapsed ? 1 : 2 }}>
          {links.map((link) => (
            <ListItem key={link.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleItemClick(link.id)}
                sx={{
                  borderRadius: collapsed ? "8px" : "8px",
                  minHeight: 48,
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: collapsed ? 1 : 2,
                  mx: collapsed ? 0 : 0.5,
                  backgroundColor: currentView === link.id 
                    ? `${colors.primary.main}` 
                    : "transparent",
                  "&:hover": {
                    backgroundColor: currentView === link.id 
                      ? `${colors.primary.main}`
                      : "rgba(255, 255, 255, 0.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: currentView === link.id 
                      ? colors.neutral.white 
                      : "rgba(255, 255, 255, 0.7)",
                    minWidth: collapsed ? 0 : 36,
                    justifyContent: "center",
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={link.label}
                    sx={{
                      ml: 1,
                      color: currentView === link.id 
                        ? colors.neutral.white 
                        : "rgba(255, 255, 255, 0.8)",
                      "& .MuiListItemText-primary": {
                        fontSize: "0.9rem",
                        fontWeight: currentView === link.id ? 600 : 400,
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default RegisterSidebar;