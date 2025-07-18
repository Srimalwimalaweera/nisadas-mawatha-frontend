import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // <-- අලුත් import එක

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* <-- අපේ App එක AuthProvider එකෙන් wrap කරනවා */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);