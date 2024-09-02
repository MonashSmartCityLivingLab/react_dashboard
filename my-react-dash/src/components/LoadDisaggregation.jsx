// src/components/LoadDisaggregation.jsx
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import NavigationMenu from "./NavigationMenu";

export default function LoadDisaggregation() {
    return (
        <NavigationMenu>
            <div style={{ padding: "20px", marginTop: "64px" }}>
                <Box sx={{ display: "flex", gap: 3, justifyContent: "space-between" }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Paper elevation={3} sx={{ p: 2, maxWidth: 400 }}>
                            <Typography variant="h6" gutterBottom>
                                Breakdown of Usage
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                <Paper elevation={3} sx={{ p: 2, maxWidth: 400 }}>
                <Typography variant="h6" gutterBottom>
                Central Meter Reading
              </Typography>
                    </Paper>
                </Box>
                </Box>
                
            </div>
        </NavigationMenu>
    )
}