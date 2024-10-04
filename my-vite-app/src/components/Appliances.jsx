import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import NavigationMenu from "./NavigationMenu";

// Fetching and editing configuration logic (from the Dashboard component)
const Appliances = () => {
  const [monitoredDevices, setMonitoredDevices] = useState([]);
  const [unmonitoredDevices, setUnmonitoredDevices] = useState([
    "Fridge", "Speaker", "Fan", "Lounge Lights"
  ]);
  const [deviceStatuses, setDeviceStatuses] = useState({});
  const [config, setConfig] = useState(null);
  const [updatedConfig, setUpdatedConfig] = useState(null);

  // Fetch monitored devices
  useEffect(() => {
    fetch(`http://localhost:3002/appliance-status`)
      .then((response) => response.json())
      .then((data) => {
        setMonitoredDevices(data);
        const statuses = data.reduce((acc, device) => {
          acc[device.deviceName] = device.isOn;
          return acc;
        }, {});
        setDeviceStatuses(statuses);
      })
      .catch((error) => console.error("Error fetching device statuses:", error));
  }, []);

  // Fetch config data
  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        const response = await fetch('http://localhost:3002/get-config');
        const data = await response.json();
        console.log(data[0].rooms);
        setConfig(data[0]);
        setUpdatedConfig(data[0])
      } catch (error) {
        setConfig([]);
        console.error("Error fetching config:', error");
        return error.response;
      }
    };
    fetchConfigData();
  }, []);

  const handleToggle = async (device, isOn) => {
    const sensorName = getSensorNameFromDevice(device);
    const action = isOn ? "turn-off" : "turn-on";

    try {
      const response = await fetch(
        `http://localhost:3002/appliance-status/${sensorName}/${action}`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Failed to perform action");

      setDeviceStatuses((prevStatuses) => ({
        ...prevStatuses,
        [device]: !isOn,
      }));
    } catch (error) {
      console.error(`Error toggling ${device}:`, error);
    }
  };

  const getSensorNameFromDevice = (device) => {
    const foundDevice = monitoredDevices.find((d) => d.deviceName === device);
    return foundDevice ? foundDevice.sensorName : "";
  };

  // Update config handler
  const handleConfigChange = (roomIndex, applianceIndex, key, value) => {
    const newConfig = { ...updatedConfig };
    newConfig.rooms[roomIndex].appliances[applianceIndex][key] = value;
    setUpdatedConfig(newConfig);
  };

  // Submit updated config to the server
  const handleSubmit = () => {
    fetch('http://localhost:3002/update-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedConfig),
    })
      .then((response) => response.text())
      .then((message) => alert(message))
      .catch((error) => console.error('Error updating config:', error));
  };

  return (
    <NavigationMenu>
      <Box sx={{ padding: "20px", marginTop: "64px", display: "flex", gap: 3 }}>
        {/* Monitored Devices */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monitored Appliances
            </Typography>
            {monitoredDevices.length > 0 ? (
              monitoredDevices.map((device, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">
                    {device.deviceName} - {deviceStatuses[device.deviceName] ? "On" : "Off"}
                  </Typography>
                  <Switch
                    checked={deviceStatuses[device.deviceName] || false}
                    onChange={() => handleToggle(device.deviceName, deviceStatuses[device.deviceName])}
                  />
                </Box>
              ))
            ) : (
              <Typography variant="body2">
                No monitored devices found.
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Unmonitored Devices */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Unmonitored Appliances
            </Typography>
            {unmonitoredDevices.length > 0 ? (
              unmonitoredDevices.map((device, index) => (
                <Typography key={index} variant="body1">
                  {device}
                </Typography>
              ))
            ) : (
              <Typography variant="body2">
                No unmonitored devices found.
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Config Editing Section */}
      <Box sx={{ marginTop: "20px" }}>
        {config ? (
          <div>
            <h2>Appliance Configurations</h2>
            {config?.rooms.map((room, roomIndex) => (
              <div key={room.roomName}>
                <h3>{room.roomName}</h3>
                {room.appliances.map((appliance, applianceIndex) => (
                  <div key={appliance.deviceName}>
                    <h4>{appliance.deviceName}</h4>
                    {/* <input
                      type="text"
                      value={config.rooms[roomIndex].appliances[applianceIndex].deviceName}
                      onChange={(e) =>
                        handleConfigChange(roomIndex, applianceIndex, 'deviceName', e.target.value)
                      }
                    /> */}
                    <div>
                      <span>Start times: </span>
                      <span>
                        {config.rooms[roomIndex].appliances[applianceIndex].standardUseTimes.map(item => item.startTime + " ")}
                      </span>
                    </div>
                    <div>
                      <span>End times: </span>
                      <span>
                        {config.rooms[roomIndex].appliances[applianceIndex].standardUseTimes.map(item => item.endTime + " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <button onClick={handleSubmit}>Submit Changes & Rebuild</button>
          </div>
        ) : (
          <p>Loading config data...</p>
        )}
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        color="success"
        sx={{ position: "absolute", bottom: 20, right: 20 }}
      >
        Add Appliance/Device
      </Button>
    </NavigationMenu>
  );
};

export default Appliances;
