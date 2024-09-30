import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import NavigationMenu from "./NavigationMenu";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";

// Import the CSV file
import csvFile from '../mock-data/prd_Tutorial_1_AMPds2_29_09_2024_21_09_50.csv?raw';

// Helper function to parse CSV data and round values
const parseCSV = (csvData) => {
  const lines = csvData.trim().split('\n');
  return lines.map(line => line.split(',').map(val => Number(Number(val).toFixed(2))));
};

const APPLIANCES = ['MCR', 'WME', 'LMP', 'TVE', 'UNK'];

export default function LoadDisaggregation() {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [selectedAppliances, setSelectedAppliances] = useState(APPLIANCES);
  const [parsedData, setParsedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = parseCSV(csvFile);
        setParsedData(data);
        updateChartData(data, selectedAppliances);
      } catch (error) {
        console.error('Error loading or parsing CSV file:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    updateChartData(parsedData, selectedAppliances);
  }, [selectedAppliances, parsedData]);

  const updateChartData = (data, appliances) => {
    if (data.length === 0) return;

    const series = appliances.map((appliance, index) => ({
      name: appliance,
      data: data.map(row => row[index]),
    }));

    setChartSeries(series);

    setChartOptions({
      chart: {
        type: 'line',
        height: 350,
      },
      xaxis: {
        categories: data.map((_, index) => index + 1),
      },
      yaxis: {
        title: {
          text: 'Energy Consumption',
        },
        labels: {
          formatter: (value) => value.toFixed(2),
        },
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Load Disaggregation',
        align: 'left',
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        y: {
          formatter: (value) => value.toFixed(2),
        },
      },
      colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
    });
  };

  const handleApplianceChange = (event) => {
    const value = event.target.value;
    setSelectedAppliances(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <NavigationMenu>
      <div style={{ padding: "20px", marginTop: "64px" }}>
        <Box sx={{ display: "flex", gap: 3, justifyContent: "space-between" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Paper elevation={3} sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Breakdown of Usage
              </Typography>
              {chartSeries.length > 0 ? (
                <ReactApexChart 
                  options={chartOptions} 
                  series={chartSeries} 
                  type="line" 
                  height={350} 
                />
              ) : (
                <Typography>Loading data...</Typography>
              )}
            </Paper>
          </Box>
          <Box sx={{ width: 250 }}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Appliances Filter
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="appliance-select-label">Appliances</InputLabel>
                <Select
                  labelId="appliance-select-label"
                  id="appliance-select"
                  multiple
                  value={selectedAppliances}
                  onChange={handleApplianceChange}
                  input={<OutlinedInput label="Appliances" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                      },
                    },
                  }}
                >
                  {APPLIANCES.map((appliance) => (
                    <MenuItem key={appliance} value={appliance}>
                      <Checkbox checked={selectedAppliances.indexOf(appliance) > -1} />
                      <ListItemText primary={appliance} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Box>
        </Box>
      </div>
    </NavigationMenu>
  );
}