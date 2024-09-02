// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import SideDrawer from "./components/SideDrawer";
import Dashboard from "./components/Dash"; // Import the Dashboard component
import Appliances from "./components/Appliances";
import LoadDisaggregation from "./components/LoadDisaggregation";
import Prediction from "./components/Prediction";
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
            <Route path="/appliances" element={<Appliances/>} />
            <Route path="/loaddis" element={<LoadDisaggregation/>}/>
            <Route path="/prediction" element={<Prediction/>}/>
            {/* Add more routes as needed */}
          </Routes>
        </Box>
    </Router>
  );
}

export default App;
