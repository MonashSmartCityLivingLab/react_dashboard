import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Papa from 'papaparse';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import NavigationMenu from "./NavigationMenu";

const PredictionChart = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedModels, setSelectedModels] = useState(['ARIMA']);
  const [selectedAppliances, setSelectedAppliances] = useState(['Heater']);
  const [dataTypes, setDataTypes] = useState(['actual', 'prediction']);

  const modelTypes = ['ARIMA', 'CNN', 'NeuralProphet'];
  const appliances = ['Heater', 'Kettle', 'Lounge TV', 'Microwave', 'Washing Machine'];
  const dataTypeOptions = ['actual', 'prediction'];

  const colors = [
    '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0',
    '#3F51B5', '#03A9F4', '#4CAF50', '#F9CE1D', '#FF9800'
  ];

  useEffect(() => {
    const fetchData = async () => {
      const newChartData = [];
      for (const model of selectedModels) {
        for (const appliance of selectedAppliances) {
          try {
            const fileName = `${model}_forecast_${appliance.replace(' ', '%20')}.csv`;
            const response = await fetch(`/src/mock-data/${fileName}`);
            const reader = response.body.getReader();
            const result = await reader.read();
            const decoder = new TextDecoder('utf-8');
            const csv = decoder.decode(result.value);
            
            Papa.parse(csv, {
              header: true,
              complete: (results) => {
                const parsedData = results.data.filter(row => row.Timestamp && row.Actual && row.Prediction);
                
                if (dataTypes.includes('actual')) {
                  newChartData.push({
                    name: `${appliance} - ${model} (Actual)`,
                    data: parsedData.map(row => ({ x: new Date(row.Timestamp).getTime(), y: parseFloat(row.Actual) }))
                  });
                }
                if (dataTypes.includes('prediction')) {
                  newChartData.push({
                    name: `${appliance} - ${model} (Prediction)`,
                    data: parsedData.map(row => ({ x: new Date(row.Timestamp).getTime(), y: parseFloat(row.Prediction) }))
                  });
                }
              }
            });
          } catch (error) {
            console.error(`Error fetching or parsing CSV for ${model} - ${appliance}:`, error);
          }
        }
      }
      setChartData(newChartData);
    };

    fetchData();
  }, [selectedModels, selectedAppliances, dataTypes]);

  const options = {
    chart: {
      type: 'line',
      height: 350,
      zoom: { enabled: true }
    },
    xaxis: { type: 'datetime' },
    yaxis: { title: { text: 'Value' } },
    title: {
      text: 'Appliance Predictions Comparison',
      align: 'left'
    },
    legend: { position: 'top' },
    tooltip: { x: { format: 'dd MMM yyyy HH:mm:ss' } },
    colors: colors
  };

  const handleModelChange = (event) => {
    const { value } = event.target;
    setSelectedModels(typeof value === 'string' ? value.split(',') : value);
  };

  const handleApplianceChange = (event) => {
    const { value } = event.target;
    setSelectedAppliances(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDataTypeChange = (event) => {
    const { value } = event.target;
    setDataTypes(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <NavigationMenu>
      <div style={{ padding: "20px", marginTop: "64px" }}>
        <Box sx={{ display: "flex", gap: 3, justifyContent: "space-between" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Paper elevation={3} sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Breakdown of Usage for Prediction
              </Typography>
              {chartData.length > 0 ? (
                <ReactApexChart 
                  options={options} 
                  series={chartData} 
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
                <InputLabel id="model-type-label">Model Type</InputLabel>
                <Select
                  labelId="model-type-label"
                  multiple
                  value={selectedModels}
                  onChange={handleModelChange}
                  input={<OutlinedInput label="Model Type" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {modelTypes.map((model) => (
                    <MenuItem key={model} value={model}>
                      <Checkbox checked={selectedModels.indexOf(model) > -1} />
                      <ListItemText primary={model} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="appliance-label">Appliance</InputLabel>
                <Select
                  labelId="appliance-label"
                  multiple
                  value={selectedAppliances}
                  onChange={handleApplianceChange}
                  input={<OutlinedInput label="Appliance" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {appliances.map((app) => (
                    <MenuItem key={app} value={app}>
                      <Checkbox checked={selectedAppliances.indexOf(app) > -1} />
                      <ListItemText primary={app} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="data-type-label">Data Type</InputLabel>
                <Select
                  labelId="data-type-label"
                  multiple
                  value={dataTypes}
                  onChange={handleDataTypeChange}
                  input={<OutlinedInput label="Data Type" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {dataTypeOptions.map((type) => (
                    <MenuItem key={type} value={type}>
                      <Checkbox checked={dataTypes.indexOf(type) > -1} />
                      <ListItemText primary={type.charAt(0).toUpperCase() + type.slice(1)} />
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
};

export default PredictionChart;