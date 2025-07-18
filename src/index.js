import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // <-- මේ අලුත් import එක

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>  {/* <-- අපේ App එක මේකෙන් wrap කරනවා */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);