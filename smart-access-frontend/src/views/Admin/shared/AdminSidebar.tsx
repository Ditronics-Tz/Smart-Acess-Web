import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People,
  Assessment,
  Settings,
  ExitToApp,
} from "@mui/icons-material";
import { colors } from '../../../styles/themes/colors';

type AdminSidebarProps = {
  collapsed?: boolean;
  currentView?: string;
  onNavigate?: (view: string) => void;
  onLogout?: () => void;
};

const links = [
  { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { id: "users", label: "Users", icon: <People /> },
  { id: "reports", label: "Reports", icon: <Assessment /> },
  { id: "settings", label: "Settings", icon: <Settings /> },
  { id: "logout", label: "Logout", icon: <ExitToApp />, isLogout: true },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  collapsed = false, 
  currentView = "dashboard",
  onNavigate,
  onLogout 
}) => {
  const handleItemClick = (linkId: string) => {
    if (linkId === "logout") {
      onLogout?.();
    } else {
      onNavigate?.(linkId);
    }
  };

  return (
    <Box
      sx={{
        width: collapsed ? 64 : 280,
        minWidth: collapsed ? 64 : 280,
        height: "100vh",
        background: `linear-gradient(180deg, ${colors.secondary.main} 0%, #0f1724 100%)`,
        color: colors.neutral.white,
        boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        transition: "width 0.3s ease",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
        borderRight: `1px solid rgba(255,255,255,0.1)`,
      }}
    >
      {/* Brand Section */}
      <Box
        sx={{
          p: collapsed ? 2 : 3,
          borderBottom: `1px solid rgba(255,255,255,0.1)`,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: collapsed ? 32 : 40,
            height: collapsed ? 32 : 40,
            background: `linear-gradient(135deg, ${colors.primary.main} 0%, rgba(255,255,255,0.2) 100%)`,
            border: `2px solid rgba(255,255,255,0.3)`,
          }}
        >
          <DashboardIcon sx={{ fontSize: collapsed ? 16 : 20 }} />
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
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.75rem",
              }}
            >
              Admin Panel
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List sx={{ px: collapsed ? 1 : 2 }}>
          {links.map((link, index) => (
            <React.Fragment key={link.id}>
              {link.isLogout && <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />}
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleItemClick(link.id)}
                  sx={{
                    borderRadius: 2,
                    px: collapsed ? 1.5 : 2,
                    py: 1.5,
                    minHeight: 48,
                    color: "rgba(255,255,255,0.8)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: colors.neutral.white,
                      transform: "translateX(4px)",
                    },
                    ...(currentView === link.id && {
                      backgroundColor: `rgba(255,255,255,0.15)`,
                      color: colors.neutral.white,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 4,
                        height: "60%",
                        backgroundColor: colors.primary.main,
                        borderRadius: "0 2px 2px 0",
                      },
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: collapsed ? "auto" : 40,
                      justifyContent: "center",
                    }}
                  >
                    {link.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={link.label}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontWeight: 500,
                          fontSize: "0.95rem",
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Footer */}
      {!collapsed && (
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid rgba(255,255,255,0.1)`,
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              display: "block",
            }}
          >
            Smart Access v1.0
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AdminSidebar;