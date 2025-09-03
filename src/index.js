import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { FilterProvider } from './context/FilterContext.jsx'; // <-- 1. අලුතෙන් import කරන්න

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <FilterProvider> {/* <-- 2. App එක මෙයින් wrap කරන්න */}
            <App />
          </FilterProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);