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


// Reusable function for SSH command execution
const executeSSHCommand = (host, username, privateKeyPath, command, res, dataProcessor) => {
  const conn = new Client();

  conn.on('ready', () => {
    console.log('SSH Client :: ready');
    
    conn.exec(command, (err, stream) => {
      if (err) {
        console.error('Error executing command on VM:', err);
        res.status(500).send('Error executing command on VM');
        return conn.end();
      }

      let data = '';

      stream.on('data', (chunk) => {
        console.log('Receiving data chunk:', chunk.toString());
        data += chunk.toString();
      });

      stream.on('close', () => {
        conn.end(); // Close SSH connection
        if (dataProcessor) {
          const processedData = dataProcessor(data); // Process data if needed
          res.json(processedData); // Send processed data back
        } else {
          res.json(data); // Send raw data if no processor is provided
        }
      });

      stream.on('error', (streamErr) => {
        console.error('Stream Error:', streamErr);
        res.status(500).send('Error processing data from VM');
      });

      stream.stderr.on('data', (stderr) => {
        console.error('STDERR:', stderr.toString());
      });
    });
  });

  conn.on('error', (connErr) => {
    console.error('SSH Client :: error', connErr);
    res.status(500).send('Failed to connect to the cloud VM');
  });

  conn.connect({
    host: host, // VM IP address
    port: 22, // Default SSH port
    username: username, // VM username
    privateKey: fs.readFileSync(privateKeyPath), // Path to your .pem file
  });
};

// Route for retrieving 'central-data'
app.get('/cloud-data', (req, res) => {
  const command = 'cat /home/ubuntu/data/central-data/Emerald_05-08-2024-03-09-2024.csv';
  executeSSHCommand('118.138.233.51', 'ubuntu', './ENG.pem', command, res, getMeterData);
});

// Route for retrieving 'load_dis' data
app.get('/load-dis/:fileName', (req, res) => {
  const { fileName } = req.params;
  const command = `cat /home/ubuntu/data/load_dis/${fileName}`;
  executeSSHCommand('118.138.233.51', 'ubuntu', './ENG.pem', command, res, null); // Add a processor function if needed
});

// Route for retrieving 'preds' data
app.get('/preds/:fileName', (req, res) => {
  const { fileName } = req.params;
  const command = `cat /home/ubuntu/data/preds/${fileName}`;
  executeSSHCommand('118.138.233.51', 'ubuntu', './ENG.pem', command, res, null); // Add a processor function if needed
});

// Route for getting appliance latest-values
app.get('/appliance-status', async (req, res) => {
  try {
    const response = await fetch(`http://localhost:4100/latest-values`);

    if (!response.ok) {
      console.error(`Error: Received status ${response.status} from /latest-values`);
      return res.status(500).json({ error: `Failed to fetch appliance status, status: ${response.status}` });
    }

    const data = await response.json();
    const statuses = data.map((device) => ({
      deviceName: device.deviceName,
      isOn: device.isOn,
      sensorName: device.sensorName,
    }));

    res.json(statuses);
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

// Paths to your config files
const configFilePath = "/taata/configuration/idle-device-management/config.json/config.json";

// Endpoint to get idle configuration data
app.get('/get-config', (req, res) => {
    fs.readFile(configFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading configuration file.');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to update update configuration data
app.post('/update-config', (req, res) => {
    const newConfig = req.body;

    // Write the updated config data back to the file
    fs.writeFile(configFilePath, JSON.stringify(newConfig, null, 2), 'utf-8', (err) => {
        if (err) {
            return res.status(500).send('Error writing to configuration file.');
        }

        // Trigger Gradle build and Docker restart
        const buildPath = "/idle-device-management"; // Update to your correct path
        const dockerComposePath = "/taata";
        const containerName = "idle-device-management"; // Update container name if necessary

        const command = `cd ${buildPath} && ./gradlew build && cd ${dockerComposePath} && docker compose up --force-recreate postgresql mosquitto collector athom-smart-plug athom-presence-sensor idle-device-management`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).send(`Build failed: ${error.message}`);
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            console.log(`Output: ${stdout}`);
            res.send(`Configuration updated, container ${containerName} rebuilt and restarted successfully.`);
        });
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
