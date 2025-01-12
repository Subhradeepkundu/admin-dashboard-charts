import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch inventory data
export const fetchInventory = createAsyncThunk('inventory/fetchInventory', async () => {
  try {
    console.log("Fetching inventory data...");
    const response = await axios.get('http://localhost:5000/api/inventory');
    console.log("Data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error; // This will trigger the rejected case in extraReducers
  }
});

export const fetchHistoryLog = createAsyncThunk('inventory/fetchHistoryLog', async () => {
  try {
    console.log("Fetching history log...");
    const response = await axios.get('http://localhost:5000/api/history-log');
    console.log("History Log fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching history log:", error);
    throw error;
  }
});

export const fetchUniqueMakes = createAsyncThunk('inventory/fetchUniqueMakes', async () => {
  try {
    console.log("Fetching UniqueMakes...");
    const response = await axios.get('http://localhost:5000/api/makes');
    console.log("UniqueMakes fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching UniqueMakes:", error);
    throw error;
  }
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
    filters: { make: '', duration: '' }, // Add filters state
  },
  reducers: {
    updateFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value; // Update the selected filter
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchHistoryLog.fulfilled, (state, action) => {
        state.historyLog = action.payload;
      })
      .addCase(fetchUniqueMakes.fulfilled, (state, action) => {
        state.uniqueMakes = action.payload;
      });
  },
});


export const { updateFilter } = inventorySlice.actions;

export default inventorySlice.reducer;