const { parse } = require('papaparse'); // Assuming you're using papaparse for CSV parsing
const fs = require('fs');

// Function to process CSV data and group it by day with average calculations
const getMeterData = (csvData) => {
  // Parse the CSV data into JSON format
  const { data } = parse(csvData, { header: true, skipEmptyLines: true });

  // Object to store grouped data by day
  const groupedData = {};

  data.forEach((row) => {
    const date = row['Date & Time'].split(' ')[0]; // Extract the date part
    const consumption = parseFloat(row['Consumption(kWh)']);
    const cost = parseFloat(row['Cost']);

    if (!groupedData[date]) {
      groupedData[date] = { totalConsumption: 0, totalCost: 0, count: 0 };
    }

    groupedData[date].totalConsumption += consumption;
    groupedData[date].totalCost += cost;
    groupedData[date].count += 1;
  });

  // Calculate averages for each day
  const averages = Object.entries(groupedData).map(([date, { totalConsumption, totalCost, count }]) => ({
    date,
    averageConsumption: totalConsumption,
    averageCost: totalCost,
  }));

  return averages;
};

module.exports = { getMeterData };
