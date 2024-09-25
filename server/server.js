import express from 'express';
import cors from 'cors';
import { Client } from 'ssh2';
import { getMeterData } from './getMeterData.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config(); // Ensure this is called to load environment variables

const app = express();
const port = 3001; // Use any available port

// Serve local files from the specified directory
app.use(cors({ origin: "*" }));
app.use('/data', express.static('/home/scllpi1/smart_plug_data'));
console.log('reached 13');


// Route to connect to the cloud VM and retrieve data
app.get('/cloud-data', (req, res) => {
  const conn = new Client();

  conn.on('ready', () => {
    console.log('SSH Client :: ready');

    // Execute a command on the VM, e.g., retrieving data
    conn.exec('cat /home/ubuntu/data/central-data/Emerald_05-08-2024-03-09-2024.csv', (err, stream) => {
      if (err) {
        console.error('Error executing command on VM:', err);
        res.status(500).send('Error executing command on VM');
        return conn.end();
      }

      let data = '';

      // Collect data from the stream
      stream.on('data', (chunk) => {
        console.log('Receiving data chunk:', chunk.toString()); // Add logging here to see incoming data
        data += chunk.toString();
      });

      // Handle the stream close event
      stream.on('close', () => {
        conn.end(); // Close the SSH connection
        const averages = getMeterData(data); // Process the raw data
        res.json(averages); // Send the processed averages back to the client
      });

      // Handle stream errors
      stream.on('error', (streamErr) => {
        console.error('Stream Error:', streamErr);
        res.status(500).send('Error processing data from VM');
      });

      // Log stderr data if present
      stream.stderr.on('data', (stderr) => {
        console.error('STDERR:', stderr.toString());
      });
    });
  });

  // Handle SSH connection errors
  conn.on('error', (connErr) => {
    console.error('SSH Client :: error', connErr);
    res.status(500).send('Failed to connect to the cloud VM');
  });

  // Connect to the VM using SSH
  conn.connect({
    host: '118.138.233.51', // VM IP address
    port: 22, // SSH port, default is 22
    username: 'ubuntu', // VM username
    privateKey: fs.readFileSync('./ENG.pem'), // Replace with the actual path to your .pem file
  });
});

// Route for getting appliance latest-values
app.get('/appliance-status/:sensorName', async (req, res) => {
  const sensorName = req.params.sensorName;
  
  try {
    const response = await fetch(`http://localhost:4100/sensor/${sensorName}/latest-values`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const isOn = data.isOn;
    
    res.json({ isOn });
  } catch (error) {
    console.error('Error fetching appliance status:', error);
    res.status(500).json({ error: 'Failed to fetch appliance status' });
  }
});

// Route for turning the appliance on or off
app.post('/appliance-status/:sensorName/:action', async (req, res) => {
  const { sensorName, action } = req.params;

  const validActions = ['turn-on', 'turn-off'];
  if (!validActions.includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    const response = await fetch(`http://localhost:4100/sensor/${sensorName}/${action}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to perform action');
    }

    res.json({ message: `Device ${action} successfully` });
  } catch (error) {
    console.error(`Error performing ${action} for ${sensorName}:`, error);
    res.status(500).json({ error: `Failed to ${action} device` });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
