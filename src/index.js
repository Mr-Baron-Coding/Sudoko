import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import stopwatchSlice from './Sudoko/features/stopwatchSlice.js';
import messageSlice from './Sudoko/features/messageSlice';
import tableSlice from './Sudoko/features/tableSlice';
import mobileSlice from './Sudoko/features/mobileSlice';

const root = ReactDOM.createRoot(document.getElementById('root'));

const store = configureStore({
  reducer: {
      stopwatch: stopwatchSlice,
      messages: messageSlice,
      table: tableSlice,
      mobile: mobileSlice
      // scoreboard: scoreboardSlice,
  }
});

root.render(
  <React.StrictMode>
    <Provider store={ store }>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
