const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001; // Use any available port

// Serve files from the specified directory
app.use(cors({ origin: 'http://localhost:3002' }));
app.use('/data', express.static('/home/scllpi1/smart_plug_data'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});