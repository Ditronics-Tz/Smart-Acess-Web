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
        background: `linear-gradient(180deg, ${colors.primary.main} 0%, ${colors.primary.hover} 100%)`,
        color: colors.neutral.white,
        boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        transition: "width 0.3s ease",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
        borderRight: `1px solid rgba(255, 255, 255, 0.1)`,
      }}
    >
      {/* Brand Section */}
      <Box
        sx={{
          p: collapsed ? 2 : 3,
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: collapsed ? 32 : 40,
            height: collapsed ? 32 : 40,
            background: `linear-gradient(135deg, ${colors.secondary.main} 0%, rgba(255, 255, 255, 0.2) 100%)`,
            border: `2px solid rgba(255, 255, 255, 0.2)`,
          }}
        >
          <School sx={{ fontSize: collapsed ? 16 : 20 }} />
        </Avatar>
        {!collapsed && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: colors.neutral.white,
                lineHeight: 1.2,
              }}
            >
              Smart Access
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
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
            <ListItem key={link.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleItemClick(link.id)}
                sx={{
                  borderRadius: collapsed ? "50%" : "12px",
                  minHeight: collapsed ? 48 : 56,
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: collapsed ? 0 : 3,
                  backgroundColor: currentView === link.id 
                    ? "rgba(255, 255, 255, 0.15)" 
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: currentView === link.id 
                      ? colors.neutral.white 
                      : "rgba(255, 255, 255, 0.8)",
                    minWidth: collapsed ? 0 : 40,
                    justifyContent: "center",
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={link.label}
                    sx={{
                      color: currentView === link.id 
                        ? colors.neutral.white 
                        : "rgba(255, 255, 255, 0.9)",
                      "& .MuiListItemText-primary": {
                        fontSize: "0.95rem",
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