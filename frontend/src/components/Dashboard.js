import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory } from '../features/inventory/inventorySlice'; // Import fetchInventory thunk
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();

  // Redux state
  const { data: inventory, status, error } = useSelector((state) => state.inventory);

  // Component-level states
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [vehicleType, setVehicleType] = useState('all');
  const [vehicleMake, setVehicleMake] = useState('all');
  const [duration, setDuration] = useState('all');
  const [historyLog, setHistoryLog] = useState([]); // State for history log

  // Fetch inventory from Redux on mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchInventory());
    }
  }, [dispatch, status]);

  // Fetch history log data
  useEffect(() => {
    const fetchHistoryLog = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/history-log');
        const data = await response.json();
        setHistoryLog(data);
      } catch (err) {
        console.error('Failed to fetch history log:', err);
      }
    };

    fetchHistoryLog();
  }, []);

  // Filter inventory
  useEffect(() => {
    let filteredData = [...inventory];

    if (vehicleType !== 'all') {
      filteredData = filteredData.filter((item) => item.product_type.toLowerCase() === vehicleType.toLowerCase());
    }

    if (vehicleMake !== 'all') {
      filteredData = filteredData.filter((item) => item.brand.toLowerCase() === vehicleMake.toLowerCase());
    }

    if (duration !== 'all') {
      const currentDate = new Date();
      const filterDate = new Date();

      if (duration === 'lastMonth') {
        filterDate.setMonth(currentDate.getMonth() - 1);
      } else if (duration === 'thisMonth') {
        filterDate.setMonth(currentDate.getMonth());
      } else if (duration === 'last3Months') {
        filterDate.setMonth(currentDate.getMonth() - 3);
      } else if (duration === 'last6Months') {
        filterDate.setMonth(currentDate.getMonth() - 6);
      } else if (duration === 'thisYear') {
        filterDate.setFullYear(currentDate.getFullYear());
      } else if (duration === 'lastYear') {
        filterDate.setFullYear(currentDate.getFullYear() - 1);
      }

      filteredData = filteredData.filter((item) => new Date(item.timestamp) >= filterDate);
    }

    setFilteredInventory(filteredData);
  }, [vehicleType, vehicleMake, duration, inventory]);

  // Extract unique makes for dropdown
  const uniqueMakes = [...new Set(inventory.map((item) => item.brand))];

  // Inventory counts by brand
  const countsByBrand = filteredInventory.reduce((acc, item) => {
    const brand = item.brand;
    if (!acc[brand]) {
      acc[brand] = { brand, count: 0 };
    }
    acc[brand].count += 1;
    return acc;
  }, {});
  const chartData = Object.values(countsByBrand).map((brandData) => ({
    brand: brandData.brand,
    count: brandData.count,
    averageMSRP: brandData.count > 0 ? (brandData.totalMSRP / brandData.count).toFixed(2) : 0,
  }));

  if (status === 'loading') return <p>Loading inventory data...</p>;
  if (status === 'failed') return <p>Error loading inventory data: {error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Filters Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Dashboard</h1>
        <div>
          <select onChange={(e) => setVehicleType(e.target.value)} value={vehicleType} style={{ marginRight: '10px' }}>
            <option value="all">All Vehicle Types</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="cpo">CPO</option>
          </select>

          <select onChange={(e) => setVehicleMake(e.target.value)} value={vehicleMake} style={{ marginRight: '10px' }}>
            <option value="all">All Makes</option>
            {uniqueMakes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>

          <select onChange={(e) => setDuration(e.target.value)} value={duration}>
            <option value="all">All Time</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisMonth">This Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="last6Months">Last 6 Months</option>
            <option value="thisYear">This Year</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
      </div>

      {/* Inventory Count Section
      <div style={{ marginBottom: '20px' }}>
        <h2>Inventory Count</h2>
        <BarChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="brand" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div> */}

      {/* Inventory and Average MSRP Charts Section */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Inventory Count and Average MSRP</h2>

        {/* Inventory Count Bar Chart */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Inventory Count by Brand</h3>
          <BarChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Inventory Count" />
          </BarChart>
        </div>

        {/* Average MSRP Bar Chart */}
        <div>
          <h3>Average MSRP by Brand</h3>
          <BarChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageMSRP" fill="#82ca9d" name="Average MSRP" />
          </BarChart>
        </div>
      </div>

      {/* History Log Section */}
      <div style={{ marginTop: '20px' }}>
        <h2>History Log</h2>
        {historyLog.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>New Count</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Used Count</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>CPO Count</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total MSRP</th>
              </tr>
            </thead>
            <tbody>
              {historyLog.map((log, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.date}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.newCount}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.usedCount}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.cpoCount}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${log.totalMSRP.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No history log available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;