import csvData from '../data/smart_plug_data/data_2024-09-03/current_payload_2024-09-03.csv';
import Papa from 'papaparse';

// Convert imported CSV data to text if necessary
const csvText = csvData;

// Papa.parse(csvText, {
//     download:true,
//   header: true,
//   complete: (results) => {
//     console.log('Parsed Data:', results.data);
    
//     // Process the parsed data
//     const groupedData = groupDataByPlug(results.data);
//     console.log('Grouped Data:', groupedData);
//   },
//   error: (error) => {
//     console.error('Error parsing CSV:', error);
//   }
// });

// Function to group data by device_name and filter non-zero and non-empty values for the current field
export const groupDataByPlug = (data) => {
    const groupedData = {};
  
    data.forEach((record) => {
      const { device_name, current } = record;
  
      // Check if the current field exists and is not zero or empty
      if (current && Number(current) !== 0 && current.trim() !== "") {
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

// Function to get grouped data of smart plugs
export const getSmartPlugs = async () => {
    try {
      const parsedData = await new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          download: true,
          header: true,
          complete: (results) => {
            const groupedData = groupDataByPlug(results.data);
            console.log('Grouped Data:', groupedData); // Log grouped results for debugging
            resolve(groupedData);
          },
          error: reject
        });
      });
  
      return parsedData;
    } catch (error) {
      console.error('Error processing the data:', error);
      return []; // Return an empty array in case of error
    }
  };