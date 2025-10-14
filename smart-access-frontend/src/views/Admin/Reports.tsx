"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
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
  Badge,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material"
import {
  ExitToApp,
  Assessment,
  Dashboard as DashboardIcon,
  People,
  Settings,
  Security,
  Search,
  Notifications,
  Person,
  Menu as MenuIcon,
  Download,
  Refresh,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Warning,
  CheckCircle,
  LocationOn,
  Schedule,
  Analytics,
  PieChart,
} from "@mui/icons-material"
import { colors } from '../../styles/themes/colors'
import AuthService from '../../service/AuthService'
import AdminSidebar from './shared/AdminSidebar'
import { useAdminNavigation } from '../../hooks/useAdminNavigation'
import AnalyticsService, { 
  DashboardOverview, 
  CardAnalytics, 
  VerificationAnalytics, 
  UserDemographics, 
  SystemHealth, 
  SystemAlerts 
} from '../../service/AnallyticsService'

interface AdminReportsProps {
  onLogout?: () => void
}

const Reports: React.FC<AdminReportsProps> = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'error' | 'warning' | 'info' | 'success' })
  const [reportPeriod, setReportPeriod] = useState('30')
  
  // Analytics data state
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null)
  const [cardData, setCardData] = useState<CardAnalytics | null>(null)
  const [verificationData, setVerificationData] = useState<VerificationAnalytics | null>(null)
  const [demographicsData, setDemographicsData] = useState<UserDemographics | null>(null)
  const [healthData, setHealthData] = useState<SystemHealth | null>(null)
  const [alertsData, setAlertsData] = useState<SystemAlerts | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const navigate = useNavigate()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await AuthService.logout()
      if (onLogout) {
        onLogout()
      }
    } catch (error) {
      console.error('Logout failed:', error)
      if (onLogout) {
        onLogout()
      }
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const username = AuthService.getUsername()

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      const analyticsData = await AnalyticsService.getAllAnalytics()
      
      setDashboardData(analyticsData.dashboard)
      setCardData(analyticsData.cards)
      setVerificationData(analyticsData.verifications)
      setDemographicsData(analyticsData.demographics)
      setHealthData(analyticsData.health)
      setAlertsData(analyticsData.alerts)
      setErrors(analyticsData.errors)

      if (analyticsData.errors.length > 0) {
        setSnackbar({
          open: true,
          message: `Some data could not be loaded: ${analyticsData.errors.join(', ')}`,
          severity: 'warning'
        })
      }
    } catch (error: any) {
      console.error('Failed to load analytics data:', error)
      setSnackbar({
        open: true,
        message: 'Failed to load analytics data',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAnalyticsData()
    setRefreshing(false)
    setSnackbar({
      open: true,
      message: 'Reports refreshed successfully',
      severity: 'success'
    })
  }

  const handleExportCSV = (data: any[], filename: string) => {
    AnalyticsService.exportToCSV(data, filename)
    setSnackbar({
      open: true,
      message: `${filename} exported successfully`,
      severity: 'success'
    })
  }

  useEffect(() => {
    loadAnalyticsData()
  }, [reportPeriod])

  const handleSidebarNavigation = useAdminNavigation()

  // Helper function to get trend icon
  const getTrendIcon = (current: number, previous: number) => {
    const trend = AnalyticsService.calculateTrend(current, previous)
    if (trend.direction === 'up') {
      return <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
    } else if (trend.direction === 'down') {
      return <TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />
    }
    return null
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        currentView="reports"
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
                <Assessment sx={{ color: colors.neutral.white, fontSize: 28 }} />
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
                  Analytics & Reports
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive System Analytics
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Period Selection */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={reportPeriod}
                  label="Period"
                  onChange={(e) => setReportPeriod(e.target.value)}
                >
                  <MenuItem value="7">Last 7 days</MenuItem>
                  <MenuItem value="30">Last 30 days</MenuItem>
                  <MenuItem value="90">Last 90 days</MenuItem>
                </Select>
              </FormControl>

              {/* Refresh Button */}
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  color: colors.secondary.main,
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                {refreshing ? <CircularProgress size={24} /> : <Refresh />}
              </IconButton>

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
                <Badge badgeContent={alertsData?.summary.total_active || 0} color="error">
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

        {/* Reports Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* System Overview Cards */}
            {dashboardData && (
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                  System Overview
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
                    <Card sx={{ height: "100%", boxShadow: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" fontWeight="500">
                              Total Users
                            </Typography>
                            <Typography variant="h3" fontWeight="bold" color={colors.secondary.main}>
                              {AnalyticsService.formatNumber(dashboardData.overview.total_users)}
                            </Typography>
                          </Box>
                          <People sx={{ fontSize: 32, color: colors.primary.main }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Students: {AnalyticsService.formatNumber(dashboardData.overview.total_students)} | 
                          Staff: {AnalyticsService.formatNumber(dashboardData.overview.total_staff)} | 
                          Security: {AnalyticsService.formatNumber(dashboardData.overview.total_security)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>

                  <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
                    <Card sx={{ height: "100%", boxShadow: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" fontWeight="500">
                              Active Cards
                            </Typography>
                            <Typography variant="h3" fontWeight="bold" color={colors.secondary.main}>
                              {AnalyticsService.formatNumber(dashboardData.overview.active_cards)}
                            </Typography>
                          </Box>
                          <CreditCard sx={{ fontSize: 32, color: colors.secondary.main }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Cards: {AnalyticsService.formatNumber(dashboardData.overview.total_cards)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>



                  <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
                    <Card sx={{ height: "100%", boxShadow: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" fontWeight="500">
                              Photo Completion
                            </Typography>
                            <Typography variant="h3" fontWeight="bold" color={colors.secondary.main}>
                              {AnalyticsService.formatPercentage(
                                (dashboardData.photo_completion.students.completion_rate + 
                                 dashboardData.photo_completion.staff.completion_rate) / 2
                              )}
                            </Typography>
                          </Box>
                          <Analytics sx={{ fontSize: 32, color: colors.secondary.main }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Students: {AnalyticsService.formatPercentage(dashboardData.photo_completion.students.completion_rate)} | 
                          Staff: {AnalyticsService.formatPercentage(dashboardData.photo_completion.staff.completion_rate)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Card Analytics */}
            {cardData && cardData.distribution && cardData.distribution.by_type && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: colors.secondary.main }}>
                    Card Analytics
                  </Typography>
                  <Button
                    startIcon={<Download />}
                    onClick={() => handleExportCSV(cardData.issuance_trends || [], 'card_issuance_trends')}
                    variant="outlined"
                  >
                    Export
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
                    <Card sx={{ height: "100%", boxShadow: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Card Distribution by Type
                        </Typography>
                        {cardData.distribution.by_type.map((item, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                {item.card_type} Cards
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {AnalyticsService.formatNumber(item.count)}
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={(item.count / cardData.distribution.by_type.reduce((sum, type) => sum + type.count, 0)) * 100}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Box>

                  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
                    <Card sx={{ height: "100%", boxShadow: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Print Statistics
                        </Typography>
                        {cardData.print_statistics ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">Total Print Jobs</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {AnalyticsService.formatNumber(cardData.print_statistics.total_print_jobs)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="success.main">Successful Prints</Typography>
                              <Typography variant="body2" fontWeight="bold" color="success.main">
                                {AnalyticsService.formatNumber(cardData.print_statistics.successful_prints)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="error.main">Failed Prints</Typography>
                              <Typography variant="body2" fontWeight="bold" color="error.main">
                                {AnalyticsService.formatNumber(cardData.print_statistics.failed_prints)}
                              </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body1" fontWeight="bold">Success Rate</Typography>
                              <Typography variant="body1" fontWeight="bold" color="success.main">
                                {AnalyticsService.formatPercentage(cardData.print_statistics.success_rate)}
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No print statistics available
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </Box>
            )}



            {/* User Demographics */}
            {demographicsData && demographicsData.students && demographicsData.staff && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: colors.secondary.main }}>
                    User Demographics
                  </Typography>
                  <Button
                    startIcon={<Download />}
                    onClick={() => handleExportCSV([
                      { category: 'Students', total: demographicsData.students?.total || 0, phone_completion: demographicsData.students?.phone_completion_rate || 0 },
                      { category: 'Staff', total: demographicsData.staff?.total || 0, phone_completion: demographicsData.staff?.phone_completion_rate || 0 },
                      { category: 'Security', total: demographicsData.security_personnel?.total || 0, active: demographicsData.security_personnel?.active || 0 }
                    ], 'user_demographics')}
                    variant="outlined"
                  >
                    Export
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 16px)" } }}>
                    <Card sx={{ height: "100%", boxShadow: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color={colors.primary.main}>
                          Students ({AnalyticsService.formatNumber(demographicsData.students.total)})
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Phone Completion: {AnalyticsService.formatPercentage(demographicsData.students.phone_completion_rate)}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle2" gutterBottom>By Department:</Typography>
                        {demographicsData.students.by_department && demographicsData.students.by_department.length > 0 ? (
                          demographicsData.students.by_department.slice(0, 5).map((dept, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">{dept.department}</Typography>
                              <Typography variant="body2" fontWeight="bold">{dept.count}</Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No department data available
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Box>

                  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 16px)" } }}>
                    <Card sx={{ height: "100%", boxShadow: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color={colors.secondary.main}>
                          Staff ({AnalyticsService.formatNumber(demographicsData.staff.total)})
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Phone Completion: {AnalyticsService.formatPercentage(demographicsData.staff.phone_completion_rate)}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle2" gutterBottom>By Department:</Typography>
                        {demographicsData.staff.by_department && demographicsData.staff.by_department.length > 0 ? (
                          demographicsData.staff.by_department.slice(0, 5).map((dept, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">{dept.department}</Typography>
                              <Typography variant="body2" fontWeight="bold">{dept.count}</Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No department data available
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Box>

                  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 16px)" } }}>
                    <Card sx={{ height: "100%", boxShadow: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color={colors.primary.main}>
                          Security Personnel
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Total Personnel</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {AnalyticsService.formatNumber(demographicsData.security_personnel.total)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="success.main">Active Personnel</Typography>
                            <Typography variant="body2" fontWeight="bold" color="success.main">
                              {AnalyticsService.formatNumber(demographicsData.security_personnel.active)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Availability Rate</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {AnalyticsService.formatPercentage(
                                (demographicsData.security_personnel.active / demographicsData.security_personnel.total) * 100
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </Box>
            )}

            {/* System Health */}
            {healthData && healthData.infrastructure && (
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                  System Health
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
                    <Card sx={{ height: "100%", boxShadow: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Infrastructure Status
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Gates ({AnalyticsService.formatNumber(healthData.infrastructure.gates.total)})
                          </Typography>
                          {healthData.infrastructure.gates.status_summary && healthData.infrastructure.gates.status_summary.length > 0 ? (
                            healthData.infrastructure.gates.status_summary.map((status, index) => (
                              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {status.status === 'active' ? 
                                    <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} /> : 
                                    <Warning sx={{ fontSize: 16, color: 'warning.main' }} />
                                  }
                                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                    {status.status}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {status.count}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No gate status data available
                            </Typography>
                          )}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Locations ({AnalyticsService.formatNumber(healthData.infrastructure.locations.total)})
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Restricted</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {healthData.infrastructure.locations.restricted}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>

                  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
                    <Card sx={{ height: "100%", boxShadow: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Data Integrity Issues
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Students without cards</Typography>
                            <Chip 
                              label={healthData.data_integrity.students_without_cards} 
                              color={healthData.data_integrity.students_without_cards > 0 ? 'warning' : 'success'}
                              size="small"
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Staff without cards</Typography>
                            <Chip 
                              label={healthData.data_integrity.staff_without_cards} 
                              color={healthData.data_integrity.staff_without_cards > 0 ? 'warning' : 'success'}
                              size="small"
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Cards without photos</Typography>
                            <Chip 
                              label={healthData.data_integrity.cards_without_photos} 
                              color={healthData.data_integrity.cards_without_photos > 0 ? 'warning' : 'success'}
                              size="small"
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Active Alerts */}
            {alertsData && alertsData.active_alerts.length > 0 && (
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: colors.secondary.main, mb: 3 }}>
                  Active System Alerts
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Severity</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {alertsData.active_alerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell>
                            <Chip 
                              label={alert.severity}
                              size="small"
                              sx={{ 
                                backgroundColor: AnalyticsService.getAlertSeverityColor(alert.severity),
                                color: 'white'
                              }}
                            />
                          </TableCell>
                          <TableCell>{alert.title}</TableCell>
                          <TableCell>{alert.type}</TableCell>
                          <TableCell>{AnalyticsService.formatDate(alert.created_at)}</TableCell>
                          <TableCell>
                            {alert.acknowledged_at ? (
                              <Chip label="Acknowledged" color="info" size="small" />
                            ) : (
                              <Chip label="Pending" color="warning" size="small" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Reports