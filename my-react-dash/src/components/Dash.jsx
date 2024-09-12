import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import NavigationMenu from "./NavigationMenu";
import { getSmartPlugs } from "../backend/getPlugs"; // Import the backend logic

const Dashboard = () => {
  const [selectedPlug, setSelectedPlug] = useState("");
  const [smartPlugs, setSmartPlugs] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  // Fetch smart plugs data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const plugs = await getSmartPlugs();
      setSmartPlugs(plugs);
    };

    fetchData();
  }, []);

  // Handle plug selection change
  const handleChange = (event) => {
    setSelectedPlug(event.target.value);
  };

  // Handle field selection
  const handleFieldSelection = (event) => {
    setSelectedFields(event.target.value);
  };

// Find the selected plug's information using the alias
const selectedPlugInfo = smartPlugs.find((plug) => plug.alias === selectedPlug);

  // Fields available for selection
  const availableFields = ["timestamp", "current"]; // Adjust fields as needed based on your data

  return (
    <NavigationMenu>
      <div style={{ padding: "20px", marginTop: "64px" }}>
        {/* Flex container for side-by-side layout */}
        <Box sx={{ display: "flex", gap: 3, justifyContent: "space-between" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Paper elevation={3} sx={{ p: 2, maxWidth: 400 }}>
              <Typography variant="h6" gutterBottom>
                Energy Usage Trend
              </Typography>
            </Paper>
          </Box>
          <Box>
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
                    <MenuItem key={plug.id} value={plug.alias}>
                    {plug.alias}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedPlugInfo && (
                <Box sx={{ mt: 2, maxHeight: '400px', overflowY: 'auto' }}>
                  <Typography variant="body1">Data Fields:</Typography>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel id="fields-select-label">Select Fields</InputLabel>
                    <Select
                      labelId="fields-select-label"
                      multiple
                      value={selectedFields}
                      onChange={handleFieldSelection}
                      renderValue={(selected) => selected.join(", ")}
                      label="Select Fields"
                    >
                      {availableFields.map((field) => (
                        <MenuItem key={field} value={field}>
                          {field}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* Display selected fields data */}
                  {selectedPlugInfo.info.map((record, index) => (
                    <Paper key={index} elevation={1} sx={{ p: 1, mt: 1 }}>
                      {selectedFields.map((field) => (
                        <Typography key={field} variant="body2">
                          {field}: {record[field]}
                        </Typography>
                      ))}
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </div>
    </NavigationMenu>
  );
};

export default Dashboard;
