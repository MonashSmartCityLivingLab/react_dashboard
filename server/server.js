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
app.use(cors({ origin: 'http://localhost:3002' }));
app.use('/data', express.static('/home/scllpi1/smart_plug_data'));
console.log('reached 13');

// Route to connect to the cloud VM and retrieve data
app.get('/cloud-data', (req, res) => {
  console.log('reached 16');
  const conn = new Client();
  console.log('reached 18');

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
