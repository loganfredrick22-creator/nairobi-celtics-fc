import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1A1A1A', color: '#fff', border: '1px solid #00C853' },
          success: { iconTheme: { primary: '#00C853', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ff4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
