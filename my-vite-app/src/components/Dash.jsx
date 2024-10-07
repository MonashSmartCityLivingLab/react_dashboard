import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Chart from "react-apexcharts";
import NavigationMenu from "./NavigationMenu";
import { getSmartPlugs } from "../backend/getPlugs"; // Import the backend logic

const Dashboard = () => {
  const [selectedPlug, setSelectedPlug] = useState("");
  const [smartPlugs, setSmartPlugs] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [averageData, setAverageData] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedPlugDay, setSelectedPlugDay] = useState("");
  const [lineChartData, setLineChartData] = useState({ xAxis: [], yAxis: [] });

  // Fetch average data on component mount
  useEffect(() => {
    const fetchAverageData = async () => {
      try {
        const response = await fetch("http://localhost:3001/cloud-data");
        const data = await response.json();
        console.log(data);
        setAverageData(data);
      } catch (error) {
        console.error("Error fetching average data:", error);
      }
    };

    fetchAverageData();
  }, []);

  useEffect(() => {
    console.log("Updated averageData:", averageData); // This will log the updated state
  }, [averageData]);
  
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

  const handlePlugChange = (date) => {
    setSelectedPlugDay(date ? date.format('YYYY-MM-DD') : "");
  };

  // Fetch smart plugs data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (selectedPlugDay) {
        console.log(selectedPlugDay)
        const plugs = await getSmartPlugs(selectedPlugDay);
        setSmartPlugs(plugs);
      }
    };

    fetchData();
  }, [selectedPlugDay]);

  // Find the selected day's average data
  const selectedDayData = averageData.find((data) => data.date === selectedDay);

  // Find the selected plug's information using the alias
  const selectedPlugInfo = smartPlugs.find((plug) => plug.alias === selectedPlug);

  // Extract all unique days from the average data
  const availableDays = [...new Set(averageData.map((data) => data.date))];

// When selectedPlugInfo is updated, create line chart data
useEffect(() => {
  if (selectedPlugInfo) {
    const xAxis = selectedPlugInfo.info.map((record) => record.timestamp);
    const yAxis = selectedPlugInfo.info.map((record) => record.current);

    setLineChartData({ xAxis, yAxis });
  }
}, [selectedPlugInfo]);


  // Data for ApexCharts bar
  const chartOptions = {
    chart: {
      id: "energy-usage-bar-chart",
      toolbar: {
        show: true, // Keep toolbar
      },
    },
    xaxis: {
      categories: availableDays, // X-axis categories (dates)
      title: {
        text: "Date",
      },
    },
    yaxis: {
      title: {
        text: "Energy Usage (kWh)",
      },
      labels: {
        formatter: (val) => val.toFixed(2), // Format y-axis values to 2 decimal points
      },
    },
    dataLabels: {
      enabled: false, // Disable numbers (data labels) on top of bars
    },
    title: {
      text: "Daily Energy Usage",
      align: "center",
    },
  };

  const chartSeries = [
    {
      name: "Energy Usage (kWh)",
      data: averageData.map((data) => data.averageConsumption || 0), // Y-axis data
    },
  ];

  // Line Chart for Smart Plug
  const lineChartOptions = {
    chart: {
      id: "smart-plug-line-chart",
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: lineChartData.xAxis, // Use timestamps for X-axis
      title: {
        text: "Timestamp",
      },
      labels: {
        rotate: -45, // Rotate labels if they are long
        formatter: (val) => {
          // Convert timestamp to 24-hour time format
          const date = new Date(val);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${hours}:${minutes}`; // Returns HH:mm format
        }
      },
      tickAmount: 10,
    },
    yaxis: {
      title: {
        text: "Current (A)",
      },
      labels: {
        formatter: (val) => val.toFixed(2), // Format y-axis values to 2 decimal points
      },
    },
    dataLabels: {
      enabled: false, // Disable numbers on top of data points
    },
    title: {
      text: "Smart Plug Current Over Time",
      align: "center",
    },
  };
  

  const lineChartSeries = [
    {
      name: "Current (A)",
      data: lineChartData.yAxis, // Use current data for Y-axis
    },
  ];

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
                    {selectedDayData.averageCost
                      ? "$" + selectedDayData.averageCost.toFixed(4)
                      : "N/A"}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  No data available for the selected day.
                </Typography>
              )}
              {/* Add ApexCharts Bar Chart here */}
              <Box sx={{ mt: 4 }}>
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="bar"
                  height={350}
                />
              </Box>
            </Paper>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Select Date"
                  onChange={handlePlugChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Paper elevation={3} sx={{ p: 2, maxWidth: 400 }}>
              <Typography variant="h6" gutterBottom>
                Smart Plug Information
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="smart-plug-select-label">
                  Select Smart Plug
                </InputLabel>
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
                <Box sx={{ mt: 4 }}>
                <Chart
                  options={lineChartOptions}
                  series={lineChartSeries}
                  type="line"
                  height={350}
                />
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
