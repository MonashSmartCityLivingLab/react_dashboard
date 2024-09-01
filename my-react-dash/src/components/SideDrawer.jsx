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
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
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
              { text: "Dashboard", link: "/dashboard"},
              { text: "Devices"},
              { text: "Load Disaggregation"},
              { text: "Prediction"},
              { text: "Device Control"},
              { text: "Data Analysis"},
              { text: "Help"},
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
                      }}>
                <ListItemText primary={item.text} />
              </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer >
    );
  }
  