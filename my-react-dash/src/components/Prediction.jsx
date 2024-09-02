// src/components/Dashboard.jsx
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import NavigationMenu from "./NavigationMenu";

export default function Prediction() {
    const [selectedPlug, setSelectedPlug] = useState("");
    const smartPlugs = [
      { id: 1, name: "Appliance 1", info: "Prediction for Appliance 1" },
      { id: 2, name: "Appliance 2", info: "Prediction for Appliance 2" },
      { id: 3, name: "Appliance 3", info: "Prediction for Appliance 3" },
    ];
  
    // Handle selection change
    const handleChange = (event) => {
      setSelectedPlug(event.target.value);
    };
  
    // Find the selected plug's information
    const selectedPlugInfo = smartPlugs.find((plug) => plug.name === selectedPlug);
    return (
        <NavigationMenu>
          <div style={{ padding: "20px", marginTop: "64px" }}>
          <Box sx = {{flexGrow: 1}}>
            <Paper elevation={3} sx={{ p: 2, maxWidth: 400 }}>
              <Typography variant="h6" gutterBottom>
                Total Usage Prediction
              </Typography>
            </Paper>
          </Box>
          <Box sx = {{flexGrow: 1}}>
            <Paper elevation={3} sx={{ p: 2, maxWidth: 400, marginTop: "64px"  }}>
              <Typography variant="h6" gutterBottom>
                Individual Appliance Prediction
              </Typography>
            </Paper>
          </Box>
          </div>
          </NavigationMenu>
    )
}