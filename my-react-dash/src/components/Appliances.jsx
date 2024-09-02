// src/components/Appliances.jsx
// Page will show the list of monitored and unmonitored appliances
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import NavigationMenu from "./NavigationMenu";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

export default function Appliances() {
    const [monitoredDevices, setMonitoredDevices] = useState([
        "Microwave",
        "Kettle",
        "Lamp",
        "Washing Machine",
        "TV",
        "Toaster",
        "Heater"
    ]);
    const [unmonitoredDevices, setUnmonitoredDevices] = useState([
        "Fridge",
        "Speaker",
        "Fan",
        "Lounge Lights"
    ]);
    return (
        <NavigationMenu>
            <Box sx={{ padding: "20px", marginTop: "64px", display: "flex", gap: 3 }}>
                {/* Monitored Devices */}
                <Box sx={{ flex: 1 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Monitored Appliances
                        </Typography>
                        {monitoredDevices.length > 0 ? (
                            monitoredDevices.map((device, index) => (
                                <Typography key={index} variant="body1">
                                    {device}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="body2">No monitored devices found.</Typography>
                        )}
                    </Paper>
                </Box>

                {/* Unmonitored Devices */}
                <Box sx={{ flex: 1 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Unmonitored Appliances
                        </Typography>
                        {unmonitoredDevices.length > 0 ? (
                            unmonitoredDevices.map((device, index) => (
                                <Typography key={index} variant="body1">
                                    {device}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="body2">No unmonitored devices found.</Typography>
                        )}
                    </Paper>
                </Box>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} color="success" sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
          }}>
                Add Appliance/Device
            </Button>
        </NavigationMenu>
    );

}