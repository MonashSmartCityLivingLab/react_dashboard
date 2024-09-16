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
  const [averageData, setAverageData] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");

  // Fetch smart plugs data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const plugs = await getSmartPlugs();
      setSmartPlugs(plugs);
    };

    fetchData();
  }, []);

  // Fetch central meter data from cloud server
  // Fetch average data on component mount
  useEffect(() => {
    const fetchAverageData = async () => {
      try {
        const response = await fetch("http://localhost:3001/cloud-data");
        const data = await response.json();
        setAverageData(data);
      } catch (error) {
        console.error("Error fetching average data:", error);
      }
    };

    fetchAverageData();
  }, []);

  // Handle plug selection change
  const handleChange = (event) => {
    setSelectedPlug(event.target.value);
  };

  // Handle field selection
  const handleFieldSelection = (event) => {
    setSelectedFields(event.target.value);
  };

  // Handle day selection
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  // Find the selected day's average data
  const selectedDayData = averageData.find((data) => data.date === selectedDay);
  // Find the selected plug's information using the alias
  const selectedPlugInfo = smartPlugs.find((plug) => plug.alias === selectedPlug);

  // Extract all unique days from the average data
  const availableDays = [...new Set(averageData.map((data) => data.date))];
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
              <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                <InputLabel id="day-select-label">Select Day</InputLabel>
                <Select
                  labelId="day-select-label"
                  value={selectedDay}
                  onChange={handleDayChange}
                  label="Select Day"
                >
                  {availableDays.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedDayData ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    <strong>Total Consumption:</strong>{" "}
                    {selectedDayData.averageConsumption
                      ? selectedDayData.averageConsumption.toFixed(4) + " kWh"
                      : "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total Cost:</strong>{" "}
                    {selectedDayData.averageCost ? "$" + selectedDayData.averageCost.toFixed(4) : "N/A"}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  No data available for the selected day.
                </Typography>
              )}
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
                <Box sx={{ mt: 2, maxHeight: "400px", overflowY: "auto" }}>
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