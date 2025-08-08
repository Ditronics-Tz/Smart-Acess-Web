import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import { AccountCircle, ExitToApp } from '@mui/icons-material';
import RegistrationAuthService from '../../service/RegistrationAuthService';

interface RegistersDashboardProps {
    onLogout?: () => void;
}

const Dashboard: React.FC<RegistersDashboardProps> = ({ onLogout }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await RegistrationAuthService.logout();
            if (onLogout) {
                onLogout();
            }
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if logout API fails, redirect to home since tokens are cleared
            if (onLogout) {
                onLogout();
            }
        }
    };

    const username = RegistrationAuthService.getUsername();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Registration Officer Dashboard
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                            Welcome, {username}
                        </Typography>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleLogout}>
                                <ExitToApp sx={{ mr: 1 }} />
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Registration Officer Dashboard
                </Typography>
                <Typography variant="body1">
                    Welcome to the registration dashboard. Manage student registrations and access control here.
                </Typography>
            </Container>
        </Box>
    );
};

export default Dashboard;