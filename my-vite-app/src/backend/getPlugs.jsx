import Papa from 'papaparse';

const aliasMapping = {
  "athom-smart-plug-v2-f16702":"Lounge TV",
  "athom-smart-plug-v2-f18175":"Microwave",
  "athom-smart-plug-v2-f1867c":"Washing Machine",
  "athom-smart-plug-v2-a76459": "Kettle",
  "athom-smart-plug-v2-3ff088": "Heater"
};

// Function to group data by device_name and filter non-zero and non-empty values for the current field
export const groupDataByPlug = (data) => {
  const groupedData = {};

  data.forEach((record) => {
    const { device_name, timestamp, current } = record;

    // Check if the current field exists and is not zero or empty
    if (current && Number(current) !== 0 && current.trim() !== '') {
      if (!groupedData[device_name]) {
        groupedData[device_name] = [];
      }
      groupedData[device_name].push({ device_name, current, timestamp }); 
    }
  });

  // Convert grouped data into an array of objects for easy use
  return Object.keys(groupedData).map((deviceName, index) => ({
    id: index + 1,
    name: deviceName,
    alias: aliasMapping[deviceName] || deviceName,
    info: groupedData[deviceName], // Contains all the filtered records related to the device
  }));
};

// Function to fetch CSV data and group it by smart plugs based on the selected date
export const getSmartPlugs = async (selectedDate) => {
  console.log(selectedDate)
  const csvUrl = `http://localhost:3002/data/data_${selectedDate}/current_payload_${selectedDate}.csv`;
  
  try {
    // Fetch the CSV file from the server
    const response = await fetch(csvUrl);

    if (!response.ok) {
      throw new Error(`Error fetching CSV file: ${response.statusText}`);
    }

    // Get the text content of the CSV file
    const csvText = await response.text();

    // Parse the CSV text using PapaParse
    const parsedData = await new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const groupedData = groupDataByPlug(results.data);
          resolve(groupedData);
        },
        error: reject,
      });
    });

    return parsedData;
  } catch (error) {
    console.error('Error processing the data:', error);
    return []; // Return an empty array in case of error
  }
};
