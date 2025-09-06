import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { FilterProvider } from './context/FilterContext.jsx';
import { PopupProvider } from './context/PopupContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* --- 1. ThemeProvider එක පිටතට ගෙන ඒම --- */}
      <ThemeProvider>
        <AuthProvider>
          <FilterProvider>
            <PopupProvider> 
              <App />
            </PopupProvider>
          </FilterProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);