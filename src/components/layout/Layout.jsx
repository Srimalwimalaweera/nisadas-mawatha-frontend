// src/components/layout/Layout.jsx (Corrected Version)

import React, { useState, useEffect, useRef } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './Layout.css';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingScreen from '../common/LoadingScreen.jsx';
import BottomNav from '../common/BottomNav.jsx';
import FloatingActionButton from '../ui/FloatingActionButton.jsx';

function Layout({ children }) {
  const { theme } = useTheme();
  const location = useLocation();
  const { loading: initialAuthLoading } = useAuth();

  const [isRouting, setIsRouting] = useState(false);
  const currentPath = useRef(location.pathname);

  useEffect(() => {
    if (currentPath.current !== location.pathname) {
      setIsRouting(true);
      currentPath.current = location.pathname;
      const timer = setTimeout(() => {
        setIsRouting(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // --- Define paths that need a special or minimal layout ---
  const authPaths = [
    '/auth', '/login', '/signup', '/terms', '/privacy-policy', '/about',
    '/Auth', '/Login', '/Signup', '/Terms', '/Privacy-policy', '/About'
  ];
  const isAuthPage = authPaths.includes(location.pathname);
  const isReaderPage = location.pathname.startsWith('/read/');

  const AuthHeader = () => (
    <header className="auth-special-header">
      <Link to="/" className="logo-link">
        <img src="https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93" alt="Nisadas Mawatha Logo" className="header-logo" />
      </Link>
    </header>
  );

  // --- Logic to handle special layouts ---

  // If it's the reader page, render ONLY the children (the page itself)
  if (isReaderPage) {
    return <>{children}</>;
  }

  // If it's an authentication page, render the special auth layout
  if (isAuthPage) {
    return (
      <div className={`app-layout ${theme} auth-page-layout`}>
        <AuthHeader />
        <main className="main-content">{children}</main>
      </div>
    );
  }

  // --- Default layout for all other pages ---
  const showLoadingScreen = initialAuthLoading || isRouting;

  return (
    <div className={`app-layout ${theme}`}>
      <Header showSearchBox={!showLoadingScreen} />
      <main className="main-content">
        {showLoadingScreen ? <LoadingScreen /> : children}
      </main>
      <Footer />
      <BottomNav />
      <FloatingActionButton />
    </div>
  );
}

export default Layout;