import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SocketProvider } from './context/SocketContext';

const fallbackServerUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001';
const socketUrl = process.env.REACT_APP_SERVER_URL || fallbackServerUrl;

// Ensure all requests like axios.post('/api/...') go to the configured backend.
axios.defaults.baseURL = socketUrl;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider serverUrl={socketUrl}>
      <App />
    </SocketProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
