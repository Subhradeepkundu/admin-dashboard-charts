const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Load data from CSV
let inventoryData = [];
fs.createReadStream('sample-data.csv')
  .pipe(csv())
  .on('data', (row) => inventoryData.push({
    condition: row.condition,
    description: row.description,
    title: row.title,
    brand: row.brand,
    price: parseFloat(row.price.replace(" USD", "").replace(",", "")), // Parse price into a number
    product_type: row.product_type,
    custom_label_0: row.custom_label_0,
    timestamp: new Date(row.timestamp), // Parse timestamp to Date object
  }))
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });

// API Endpoint: Get Inventory Data with filters
app.get('/api/inventory', (req, res) => {
  let { make, duration } = req.query;
  let filteredData = [...inventoryData];

  // Filter by make (if provided)
  if (make) {
    filteredData = filteredData.filter((item) => item.brand.toLowerCase() === make.toLowerCase());
  }

  // Filter by duration (if provided)
  if (duration) {
    const now = new Date();
    let startDate;

    // Define the start date based on the duration
    switch (duration) {
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last3Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'last6Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'lastYear':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid duration parameter.' });
    }

    filteredData = filteredData.filter((item) => item.timestamp >= startDate);
  }

  // Return filtered data
  res.json(filteredData);
});

app.get('/api/history-log', (req, res) => {
  const groupedData = inventoryData.reduce((acc, item) => {
    const date = item.timestamp.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, newCount: 0, usedCount: 0, cpoCount: 0, totalMSRP: 0 };
    }
    acc[date].totalMSRP += item.price;
    if (item.product_type === 'new') acc[date].newCount++;
    if (item.product_type === 'used') acc[date].usedCount++;
    if (item.product_type === 'cpo') acc[date].cpoCount++;
    return acc;
  }, {});

  res.json(Object.values(groupedData));
});

// API Endpoint: Get Unique Makes
app.get('/api/makes', (req, res) => {
  const uniqueMakes = [...new Set(inventoryData.map(item => item.brand))];
  res.json(uniqueMakes);
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});