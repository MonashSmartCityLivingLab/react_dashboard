// src/components/Appliances.jsx
// Page will show the list of monitored and unmonitored appliances
import React, { useState, useEffect } from "react";
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
    const [deviceStatuses, setDeviceStatuses] = useState({});

    useEffect(() => {
        // Fetch the status of each monitored device using fetch
        monitoredDevices.forEach((device) => {
            const sensorName = getSensorNameFromDevice(device); // You'll map the device to the actual sensor name here
            fetch(`http://localhost:3001/appliance-status/${sensorName}`)
                .then(response => response.json())
                .then(data => {
                    setDeviceStatuses(prevStatuses => ({
                        ...prevStatuses,
                        [device]: data.isOn
                    }));
                })
                .catch(error => {
                    console.error(`Error fetching status for ${device}:`, error);
                });
        });
    }, [monitoredDevices]);
        // Dummy function to map device to sensor name, you'll want to use your actual aliasMapping here
    const getSensorNameFromDevice = (device) => {
        const aliasMapping = {
            "Microwave": "athom-smart-plug-v2-f18175",
            "Washing Machine": "athom-smart-plug-v2-f1867c",
            "Kettle": "athom-smart-plug-v2-a76459",
            "Heater": "athom-smart-plug-v2-3ff088",
            "Lamp": "athom-smart-plug-v2-f13f8e",
            "TV":  "athom-smart-plug-v2-f16702",
        };
        return aliasMapping[device];
    };

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
                                    {device} - {deviceStatuses[device] ? "On" : "Off"}
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