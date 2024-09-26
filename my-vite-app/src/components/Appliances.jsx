import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import NavigationMenu from "./NavigationMenu";

export default function Appliances() {
  const [monitoredDevices, setMonitoredDevices] = useState([]);
  const [unmonitoredDevices, setUnmonitoredDevices] = useState([
    "Fridge", "Speaker", "Fan", "Lounge Lights"
  ]);
  const [deviceStatuses, setDeviceStatuses] = useState({});

  useEffect(() => {
    // Fetch the status of all devices from the server
    fetch(`http://localhost:3002/appliance-status`)
      .then((response) => response.json())
      .then((data) => {
        // Now expecting `data` to be an array of objects with both `deviceName` and `sensorName`
        setMonitoredDevices(data); // Store full object, not just device names
        const statuses = data.reduce((acc, device) => {
          acc[device.deviceName] = device.isOn;
          return acc;
        }, {});

        setDeviceStatuses(statuses);
      })
      .catch((error) => {
        console.error("Error fetching device statuses:", error);
      });
  }, []);

  const handleToggle = async (device, isOn) => {
    const sensorName = getSensorNameFromDevice(device); // Ensure this returns a valid sensor name
    const action = isOn ? "turn-off" : "turn-on";
    console.log("sensorName:", sensorName); // Add this for debugging
    try {
      const response = await fetch(
        `http://localhost:3002/appliance-status/${sensorName}/${action}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to perform action");
      }

      setDeviceStatuses((prevStatuses) => ({
        ...prevStatuses,
        [device]: !isOn,
      }));
    } catch (error) {
      console.error(`Error toggling ${device}:`, error);
    }
  };

  // Adjust `getSensorNameFromDevice` to work with the new structure of `monitoredDevices`
  const getSensorNameFromDevice = (device) => {
    const foundDevice = monitoredDevices.find((d) => d.deviceName === device);
    return foundDevice ? foundDevice.sensorName : "";
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
                    {device.deviceName} -{" "}
                    {deviceStatuses[device.deviceName] ? "On" : "Off"}
                  </Typography>
                  <Switch
                    checked={deviceStatuses[device.deviceName] || false}
                    onChange={() =>
                      handleToggle(device.deviceName, deviceStatuses[device.deviceName])
                    }
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
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        color="success"
        sx={{
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
      >
        Add Appliance/Device
      </Button>
    </NavigationMenu>
  );
}
