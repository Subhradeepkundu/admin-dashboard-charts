import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './features/inventory/inventorySlice';
import counterReducer from './features/counter/counterSlice';

const store = configureStore({
    reducer: {
      inventory: inventoryReducer,
      counter: counterReducer,
    },
  });
  
  export default store;