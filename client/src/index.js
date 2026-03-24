import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SocketProvider } from './context/SocketContext';

const getBaseUrl = () => {
  if (process.env.REACT_APP_SERVER_URL) {
    return process.env.REACT_APP_SERVER_URL;
  }
  return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001';
};

const socketUrl = getBaseUrl();

// Global Axios Configuration
axios.defaults.baseURL = socketUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Performance monitoring (optional: could send to an endpoint)
const logVitals = (metric) => {
  // console.log(metric); 
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider serverUrl={socketUrl}>
      <App />
    </SocketProvider>
  </React.StrictMode>
);

reportWebVitals(logVitals);
