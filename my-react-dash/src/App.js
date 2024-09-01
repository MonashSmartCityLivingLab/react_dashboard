// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import SideDrawer from "./components/SideDrawer";
import Dashboard from "./components/Dash"; // Import the Dashboard component
import Box from "@mui/material/Box"; // Import Box from Material UI

const drawerWidth = 200; // Make sure this matches the width defined in SideDrawer

function App() {
  return (
    <Router>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3
          }}
        >
          <Routes>
            {/* Default Route to Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add more routes as needed */}
          </Routes>
        </Box>
    </Router>
  );
}

export default App;
