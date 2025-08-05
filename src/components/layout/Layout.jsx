import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './Layout.css';
import { useTheme } from '../../context/ThemeContext.jsx'; // <-- Theme context එක import කරනවා

function Layout({ children }) {
  const { theme } = useTheme(); // <-- effectiveTheme එක ගන්නවා

  return (
    <div className={`app-layout ${theme}`}>
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}
export default Layout;