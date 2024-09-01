import React, { useEffect, useState } from 'react';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SideDrawer from './SideDrawer';
import {useNavigate } from 'react-router-dom';

const drawerWidth = 200;
export default function NavigationMenu({ children }) {

    return(
        <Box sx={{ display: 'flex' }}>
            <AppBar sx={{backgroundColor: '#1F1F1F', color: 'white', zIndex: 1201}}>
            <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left', paddingRight: '10px' }}>
                        <a href='/' style={{ textDecoration: "none", color: "inherit" }} >
                            Smart Homes
                        </a>
                    </Typography>
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
