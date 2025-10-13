"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Paper,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  Badge,
} from "@mui/material"
import {
  ExitToApp,
  PersonAdd,
  Dashboard as DashboardIcon,
  People,
  Settings,
  Security,
  Search,
  Notifications,
  Person,
  Menu as MenuIcon,
} from "@mui/icons-material"
import { colors } from '../../styles/themes/colors';
import AuthService from '../../service/AuthService';
import CreateUser from './User/CreateUser';
import AdminSidebar from './shared/AdminSidebar';
import { useAdminNavigation } from '../../hooks/useAdminNavigation';

interface AdminDashboardProps {
  onLogout?: () => void
}

const Dashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      if (onLogout) {
        onLogout();
      }
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const username = AuthService.getUsername();

  const dashboardCards = [
    {
      title: "Create Registration Officer",
      description: "Add new registration officers to manage student access",
      icon: <PersonAdd sx={{ fontSize: 32, color: colors.primary.main }} />,
      action: () => navigate('/admin-dashboard/create-user'),
      stats: "12 Active",
      bgColor: colors.neutral.white,
    },
    {
      title: "Manage Users",
      description: "View and manage all system users",
      icon: <People sx={{ fontSize: 32, color: colors.secondary.main }} />,
      action: () => navigate('/admin-dashboard/users'),
      stats: "248 Users",
      bgColor: colors.neutral.white,
    },
    {
      title: "System Settings",
      description: "Configure system preferences and security",
      icon: <Settings sx={{ fontSize: 32, color: colors.primary.main }} />,
      action: () => navigate('/admin-dashboard/settings'),
      stats: "8 Modules",
      bgColor: colors.neutral.white,
    },
    {
      title: "Access Control",
      description: "Monitor and control system access permissions",
      icon: <Security sx={{ fontSize: 32, color: colors.secondary.main }} />,
      action: () => navigate('/admin-dashboard/access-control'),
      stats: "156 Permissions",
      bgColor: colors.neutral.white,
    },
  ]

  const handleSidebarNavigation = useAdminNavigation();

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        currentView="dashboard"
        onNavigate={handleSidebarNavigation}
      />

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        ml: sidebarCollapsed ? "64px" : "280px",
        transition: "margin-left 0.3s ease",
        minHeight: "100vh", 
        backgroundColor: "#f5f5f5" 
      }}>
        {/* Header */}
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: colors.neutral.white,
            color: colors.secondary.main,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderBottom: `1px solid #e0e0e0`,
          }}
        >
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
              {/* Sidebar Toggle */}
              <IconButton
                onClick={toggleSidebar}
                sx={{
                  color: colors.secondary.main,
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                <MenuIcon />
              </IconButton>

              <Box
                sx={{
                  p: 1.5,
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <DashboardIcon sx={{ color: colors.neutral.white, fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    color: colors.secondary.main,
                    lineHeight: 1.2,
                  }}
                >
                  Admin Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Smart Access Control System
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Search */}
              <TextField
                size="small"
                placeholder="Search..."
                sx={{
                  display: { xs: "none", sm: "block" },
                  width: 250,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Notifications */}
              <IconButton
                sx={{
                  color: colors.secondary.main,
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                <Badge badgeContent={0} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              {/* User menu */}
              <Button
                onClick={handleMenu}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  textTransform: "none",
                  color: colors.secondary.main,
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                    border: `2px solid ${colors.primary.main}`,
                  }}
                >
                  {username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}>
                  <Typography variant="body2" fontWeight="600" sx={{ lineHeight: 1.2 }}>
                    {username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Administrator
                  </Typography>
                </Box>
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 3,
                  sx: { mt: 1.5, minWidth: 180 },
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Person sx={{ mr: 2, color: colors.secondary.main }} />
                  <Typography color={colors.secondary.main}>Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Settings sx={{ mr: 2, color: colors.secondary.main }} />
                  <Typography color={colors.secondary.main}>Settings</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 2, color: "error.main" }} />
                  <Typography color="error.main">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Welcome Section */}
            <Paper
              sx={{
                background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                color: colors.neutral.white,
                p: 4,
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Welcome back, {username}!
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                    Manage your Smart Access Control System with comprehensive administrative tools
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    border: `4px solid rgba(255,255,255,0.3)`,
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    backgroundColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  {username?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
            </Paper>

            {/* Quick Actions */}
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {dashboardCards.map((card, index) => (
                  <Box key={index} sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", lg: "1 1 calc(25% - 18px)" } }}>
                    <Card
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                      }}
                      onClick={card.action}
                    >
                      <CardContent sx={{ p: 3, textAlign: "center" }}>
                        <Box sx={{ mb: 2 }}>{card.icon}</Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: colors.secondary.main }}>
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {card.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Dashboard
