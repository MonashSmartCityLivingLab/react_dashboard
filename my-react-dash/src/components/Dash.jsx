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

const Dashboard = () => {
    // State to manage selected smart plug
    const [selectedPlug, setSelectedPlug] = useState("");
    const smartPlugs = [
        { id: 1, name: "Plug 1", info: "Details about Plug 1" },
        { id: 2, name: "Plug 2", info: "Details about Plug 2" },
        { id: 3, name: "Plug 3", info: "Details about Plug 3" },
    ];

    // Handle selection change
    const handleChange = (event) => {
        setSelectedPlug(event.target.value);
    };

    // Find the selected plug's information
    const selectedPlugInfo = smartPlugs.find(
        (plug) => plug.name === selectedPlug
    );

    return (
        <NavigationMenu>
            <div style={{ padding: "20px", marginTop: "64px" }}>
                <Box sx={{ p: 3 }}>
                    <Paper elevation={3} sx={{ p: 2, maxWidth: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Smart Plug Information
                        </Typography>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="smart-plug-select-label">Select Smart Plug</InputLabel>
                            <Select
                                labelId="smart-plug-select-label"
                                value={selectedPlug}
                                onChange={handleChange}
                                label="Select Smart Plug"
                            >
                                {smartPlugs.map((plug) => (
                                    <MenuItem key={plug.id} value={plug.name}>
                                        {plug.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {selectedPlugInfo && (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                {selectedPlugInfo.info}
                            </Typography>
                        )}
                    </Paper>
                </Box>
            </div>
        </NavigationMenu>
    );
};

export default Dashboard;