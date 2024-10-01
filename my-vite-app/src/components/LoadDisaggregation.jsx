import { useState, useEffect } from 'react';
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

// Import the CSV files
import csvFile1 from '../mock-data/output_1.csv?raw';
import csvFile2 from '../mock-data/output_2.csv?raw';
import csvFile3 from '../mock-data/output_3.csv?raw';
import csvFile4 from '../mock-data/output_4.csv?raw';

// Helper function to parse CSV data and round values
const parseCSV = (csvData) => {
  const lines = csvData.trim().split('\n');
  return lines.map(line => line.split(',').map(val => Number(Number(val).toFixed(2))));
};

const APPLIANCES = ['MCR', 'WME', 'LMP', 'TVE', 'UNK'];
const DATES = ['September 1', 'September 2', 'September 3', 'September 4'];

export default function LoadDisaggregation() {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [selectedAppliances, setSelectedAppliances] = useState(APPLIANCES);
  const [parsedData, setParsedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('September 1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data1 = parseCSV(csvFile1);
        const data2 = parseCSV(csvFile2);
        const data3 = parseCSV(csvFile3);
        const data4 = parseCSV(csvFile4);
        setParsedData([data1, data2, data3, data4]);
        updateChartData([data1, data2, data3, data4], selectedAppliances, 0);
      } catch (error) {
        console.error('Error loading or parsing CSV files:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    updateChartData(parsedData, selectedAppliances, DATES.indexOf(selectedDate));
  }, [selectedAppliances, parsedData, selectedDate]);

  const updateChartData = (allData, appliances, dateIndex) => {
    if (allData.length === 0) return;

    const data = allData[dateIndex];
    const timeIntervals = data.length;
    const minutesPerInterval = 1440 / timeIntervals; // 1440 minutes in a day

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
        categories: data.map((_, i) => {
          const minutes = i * minutesPerInterval;
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        }),
        labels: {
          rotate: -45,
          rotateAlways: false,
          formatter: function(value, timestamp, opts) {
            if (value === undefined || value === null) return '';
            const timePart = value.split('.')[0]; // Take only the part before the decimal point
            const [hours, minutes] = timePart.split(':');
            const hour = parseInt(hours);
            if (isNaN(hour)) return '';
            if (hour % 3 === 0) {
              return `${hours}:${minutes}`;
            }
            return '';
          },
        },
        tickAmount: 8,  // Limit the number of ticks shown
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
        curve: 'straight', // Changed from 'smooth' to 'straight'
      },
      title: {
        text: `Load Disaggregation - ${selectedDate}`,
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

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <NavigationMenu>
      <div style={{ padding: "20px", marginTop: "64px" }}>
        <Box sx={{ display: "flex", gap: 3, justifyContent: "space-between" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Paper elevation={3} sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Breakdown of Usage for {selectedDate}
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
                Filters
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="date-select-label">Date</InputLabel>
                <Select
                  labelId="date-select-label"
                  id="date-select"
                  value={selectedDate}
                  onChange={handleDateChange}
                  input={<OutlinedInput label="Date" />}
                >
                  {DATES.map((date) => (
                    <MenuItem key={date} value={date}>
                      {date}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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