import React, { useEffect, useState } from 'react';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SideDrawer from './SideDrawer';
import { useNavigate } from 'react-router-dom';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";

const drawerWidth = 200;
export default function NavigationMenu({ children }) {
    // Users
    const [user, setUser] = useState({});
    const [anchorEl, setAnchorEl] = useState(null); // For managing the user menu
    const navigate = useNavigate();

    // Open the menu when user icon is clicked
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close the menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Mock login/logout function (replace with real authentication logic)
    const handleLoginLogout = () => {
        if (user) {
            setUser(null); // Logout
            navigate('/login'); // Navigate to login page (adjust as needed)
        } else {
            navigate('/login'); // Navigate to login page
        }
        handleClose();
    };
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar sx={{ backgroundColor: '#1F1F1F', color: 'white', zIndex: 1201 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left', paddingRight: '10px' }}>
                        <a href='/' style={{ textDecoration: "none", color: "inherit" }} >
                            Smart Homes
                        </a>
                    </Typography>
                     {/* User Icon and Menu */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <AccountCircle />
          </IconButton>

          {/* Menu with options based on user status */}
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
            {user ? (
              <>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleLoginLogout}>Logout</MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleLoginLogout}>Login</MenuItem>
            )}
          </Menu>
                </Toolbar>
            </AppBar>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: `${drawerWidth}px`, // Adjust this value to match the width of your SideDrawer
                }}
            >
                {children}
            </Box>
            <SideDrawer sx={{ zIndex: 1200 }} /> {/* Add zIndex to ensure SideDrawer stays above main content */}
        </Box>
    );

}
