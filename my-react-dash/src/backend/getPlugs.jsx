import Papa from 'papaparse';

// URL pointing to the CSV file on your local server
const csvUrl = 'http://localhost:3001/data/data_2024-09-03/current_payload_2024-09-03.csv';

// Function to group data by device_name and filter non-zero and non-empty values for the current field
export const groupDataByPlug = (data) => {
  const groupedData = {};

  data.forEach((record) => {
    const { device_name, current } = record;

    // Check if the current field exists and is not zero or empty
    if (current && Number(current) !== 0 && current.trim() !== '') {
      if (!groupedData[device_name]) {
        groupedData[device_name] = [];
      }
      groupedData[device_name].push({ device_name, current }); // Only keep the device_name and current fields
    }
  });

  // Convert grouped data into an array of objects for easy use
  return Object.keys(groupedData).map((deviceName, index) => ({
    id: index + 1,
    name: deviceName,
    info: groupedData[deviceName], // Contains all the filtered records related to the device
  }));
};

// Function to fetch CSV data and group it by smart plugs
export const getSmartPlugs = async () => {
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
          console.log('Grouped Data:', groupedData); // Log grouped results for debugging
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
