"use client"

import type React from "react"
import { useState } from "react"
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
import AdminAuthService from '../../service/AdminAuthService';
import CreateUser from './CreateUser';
import AdminSidebar from './shared/AdminSidebar';

interface AdminDashboardProps {
  onLogout?: () => void
}

const Dashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentView, setCurrentView] = useState<"dashboard" | "create-user">("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await AdminAuthService.logout();
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

  const username = AdminAuthService.getUsername();

  const dashboardCards = [
    {
      title: "Create Registration Officer",
      description: "Add new registration officers to manage student access",
      icon: <PersonAdd sx={{ fontSize: 32, color: colors.primary.main }} />,
      action: () => setCurrentView("create-user"),
      stats: "12 Active",
      bgColor: colors.neutral.white,
    },
    {
      title: "Manage Users",
      description: "View and manage all system users",
      icon: <People sx={{ fontSize: 32, color: colors.secondary.main }} />,
      action: () => console.log("Manage Users"),
      stats: "248 Users",
      bgColor: colors.neutral.white,
    },
    {
      title: "System Settings",
      description: "Configure system preferences and security",
      icon: <Settings sx={{ fontSize: 32, color: colors.primary.main }} />,
      action: () => console.log("System Settings"),
      stats: "8 Modules",
      bgColor: colors.neutral.white,
    },
    {
      title: "Access Control",
      description: "Monitor and control access permissions",
      icon: <Security sx={{ fontSize: 32, color: colors.secondary.main }} />,
      action: () => console.log("Access Control"),
      stats: "156 Permissions",
      bgColor: colors.neutral.white,
    },
  ]

  const statsCards = [
    {
      title: "Total Users",
      value: "248",
      change: "+12% from last month",
      icon: <People sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "Active Sessions",
      value: "156",
      change: "+8% from last week",
      icon: <Security sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "System Health",
      value: "98%",
      change: "All systems operational",
      icon: <Settings sx={{ fontSize: 24, color: colors.primary.main }} />,
      changeColor: "success.main",
    },
    {
      title: "Access Requests",
      value: "23",
      change: "3 pending approval",
      icon: <PersonAdd sx={{ fontSize: 24, color: colors.secondary.main }} />,
      changeColor: "warning.main",
    },
  ]

  const recentActivities = [
    { action: "New user registered", user: "John Doe", time: "2 minutes ago", type: "user" },
    { action: "Access granted", user: "Jane Smith", time: "5 minutes ago", type: "access" },
    { action: "System backup completed", user: "System", time: "1 hour ago", type: "system" },
    { action: "Permission updated", user: "Mike Johnson", time: "2 hours ago", type: "permission" },
  ]

  if (currentView === "create-user") {
    return (
      <Box sx={{ display: "flex" }}>
        <AdminSidebar collapsed={sidebarCollapsed} />
        <Box sx={{ 
          flex: 1, 
          ml: sidebarCollapsed ? "64px" : "280px",
          transition: "margin-left 0.3s ease"
        }}>
          <CreateUser onBack={() => setCurrentView("dashboard")} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar collapsed={sidebarCollapsed} />

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
                  Admin Control Center
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
                <Badge badgeContent={3} color="error">
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
                    fontWeight: "bold",
                  }}
                >
                  {username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
                  <Typography variant="body2" fontWeight="600">
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
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    boxShadow: 3,
                    "& .MuiMenuItem-root": {
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.04)",
                      },
                    },
                  },
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

            {/* Stats Overview */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {statsCards.map((stat, index) => (
                <Box key={index} sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
                  <Card
                    sx={{
                      height: "100%",
                      boxShadow: 2,
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" fontWeight="500">
                            {stat.title}
                          </Typography>
                          <Typography variant="h3" fontWeight="bold" color={colors.secondary.main}>
                            {stat.value}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 1.5,
                            backgroundColor: index % 2 === 0 ? "rgba(16, 37, 66, 0.1)" : "rgba(248, 112, 96, 0.1)",
                            borderRadius: 2,
                          }}
                        >
                          {stat.icon}
                        </Box>
                      </Box>
                      <Typography variant="caption" sx={{ color: stat.changeColor, fontWeight: 500 }}>
                        {stat.change}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>

            {/* Quick Actions */}
            <Box>
              <Typography variant="h4" fontWeight="bold" color={colors.secondary.main} gutterBottom sx={{ mb: 3 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {dashboardCards.map((card, index) => (
                  <Box key={index} sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 16px)" } }}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        height: "100%",
                        boxShadow: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "translateY(-4px)",
                        },
                      }}
                      onClick={card.action}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: index % 2 === 0 ? "rgba(248, 112, 96, 0.1)" : "rgba(16, 37, 66, 0.1)",
                              borderRadius: 2,
                              boxShadow: 1,
                            }}
                          >
                            {card.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                              {card.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                              {card.description}
                            </Typography>
                            <Chip
                              label={card.stats}
                              size="small"
                              sx={{
                                backgroundColor: "rgba(0,0,0,0.05)",
                                color: colors.secondary.main,
                                fontWeight: 500,
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Recent Activity */}
            <Card sx={{ boxShadow: 2 }}>
              <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
                <Typography variant="h5" fontWeight="bold" color={colors.secondary.main} gutterBottom>
                  Recent Activity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Latest system events and user actions
                </Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 3,
                      borderBottom: index < recentActivities.length - 1 ? "1px solid #f0f0f0" : "none",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.02)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: "50%",
                          backgroundColor:
                            activity.type === "user"
                              ? "rgba(16, 37, 66, 0.1)"
                              : activity.type === "access"
                                ? "rgba(76, 175, 80, 0.1)"
                                : activity.type === "system"
                                  ? "rgba(248, 112, 96, 0.1)"
                                  : "rgba(156, 39, 176, 0.1)",
                        }}
                      >
                        {activity.type === "user" && <PersonAdd sx={{ fontSize: 16, color: colors.secondary.main }} />}
                        {activity.type === "access" && <Security sx={{ fontSize: 16, color: "success.main" }} />}
                        {activity.type === "system" && <Settings sx={{ fontSize: 16, color: colors.primary.main }} />}
                        {activity.type === "permission" && <People sx={{ fontSize: 16, color: "secondary.main" }} />}
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight="600" color={colors.secondary.main}>
                          {activity.action}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          by {activity.user}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="500">
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Dashboard
