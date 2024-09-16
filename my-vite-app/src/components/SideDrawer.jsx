import * as React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import BarChartIcon from '@mui/icons-material/BarChart';
import DevicesIcon from '@mui/icons-material/Devices';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HelpIcon from '@mui/icons-material/Help';
const drawerWidth = 200;

export default function SideDrawer() {
    return (
      <Drawer
        variant="permanent"
        anchor='left'
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1F1F1F",
            color: "#FFFFFF"
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {[
              { text: "Dashboard", link: "/dashboard", icon: <DashboardIcon/> },
              { text: "Appliances", link: "/appliances", icon: <DevicesIcon/>},
              { text: "Load Disaggregation", link:"/loaddis", icon: <CategoryIcon/>},
              { text: "Prediction", link:"/prediction", icon: <BarChartIcon/>},
              { text: "Device Control", icon: <ControlCameraIcon/>},
              { text: "Data Analysis", icon: <AnalyticsIcon/>},
              { text: "Help", icon: <HelpIcon/>},
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                    <ListItemButton component={Link} to={item.link || "#"}
                     sx={{
                        "&:hover": {
                          backgroundColor: "#6a1b9a", // Change to purple when hovering
                        },
                        "&.Mui-selected, &.Mui-selected:hover": {
                          backgroundColor: "#6a1b9a", // Change to purple when selected
                        },
                        paddingRight: "8px"
                      }}>
                <ListItemIcon sx = {{color: "white"}}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer >
    );
  }
  