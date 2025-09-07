import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import SidePanel from '../ui/SidePanel.jsx';
import Footer from './Footer.jsx';
import BottomNav from '../common/BottomNav.jsx';
import LoadingScreen from '../common/LoadingScreen.jsx';
import FloatingActionButton from '../ui/FloatingActionButton.jsx';
import LoginPromptPopup from '../common/LoginPromptPopup.jsx';
import MobileDynamicSearchPanel from '../common/MobileDynamicSearchPanel';
import './Layout.css';

// Custom hook to detect window size
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};

function Layout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, loading: initialAuthLoading } = useAuth();
  const location = useLocation();
  const [width] = useWindowSize();
  const isDesktop = width >= 768;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false); // <-- 1. Search Panel State එක නිර්මාණය කිරීම
  const [isRouting, setIsRouting] = useState(false);
  const currentPath = useRef(location.pathname);

  useEffect(() => {
    if (currentPath.current !== location.pathname) {
      setIsRouting(true);
      currentPath.current = location.pathname;
      const timer = setTimeout(() => setIsRouting(false), 700);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const authPaths = [
    '/auth', '/login', '/signup', '/terms', '/privacy-policy', '/about',
    '/Auth', '/Login', '/Signup', '/Terms', '/Privacy-policy', '/About'
  ];
  const isAuthPage = authPaths.includes(location.pathname);
  const isReaderPage = location.pathname.startsWith('/read/');

  const navLinks = [
    { to: "/", text: "Home" }, { to: "/trending", text: "Trending" },
    { to: "/books", text: "Books" }, { to: "/writers", text: "Writers" },
    ...(currentUser ? [{ to: "/my-library", text: "My Library" }] : []),
    ...(currentUser && currentUser.role === 'admin' 
        ? [{ to: "/admin", text: "Admin Panel", className: "admin-link" }] 
        : [])
  ];

  if (isReaderPage) return <>{children}</>;

  const showLoadingScreen = initialAuthLoading || isRouting;
  const isDarkMode = theme === 'dark';

  return (
    <div className={`app-layout ${theme}`}>
      {isDesktop ? (
        <DesktopHeader 
          navLinks={navLinks} 
          isAuthPage={isAuthPage} 
          showSearchBox={!showLoadingScreen}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      ) : (
        <MobileHeader 
          isAuthPage={isAuthPage} 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen}
          isSearchPanelOpen={isSearchPanelOpen}       // <-- 2. Prop එක MobileHeader එකට ලබා දීම
          setIsSearchPanelOpen={setIsSearchPanelOpen} // <-- 2. Prop එක MobileHeader එකට ලබා දීම
        />
      )}
      
      {!isDesktop && (
          <MobileDynamicSearchPanel 
            isOpen={isSearchPanelOpen}
            onClose={() => setIsSearchPanelOpen(false)}
            onSearch={(query) => console.log("Searching for:", query)}
          />
      )}

      <>
        {isMenuOpen && <div className="side-panel-backdrop" onClick={() => setIsMenuOpen(false)}></div>}
        <SidePanel 
          isOpen={isMenuOpen} isDarkMode={isDarkMode} toggleTheme={toggleTheme}
          navLinks={navLinks} onClose={() => setIsMenuOpen(false)}
        />
      </>

      <LoginPromptPopup />
      <main className={`main-content ${showLoadingScreen ? 'loading' : ''}`}>
        {showLoadingScreen ? <LoadingScreen /> : children}
      </main>
      <Footer />
      <BottomNav />
      <FloatingActionButton />
    </div>
  );
}

export default Layout;