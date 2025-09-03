import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './Layout.css';
import { useTheme } from '../../context/ThemeContext.jsx';
// --- 1. අලුතෙන් import කළ යුතු දේවල් ---
import { useLocation, Link } from 'react-router-dom';

function Layout({ children }) {
  const { theme } = useTheme();
  
  // --- 2. දැනට සිටින page path එක ලබාගැනීම ---
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  // --- 3. Auth Page එකට විශේෂිත Logo component එකක් ---
  const AuthHeader = () => (
    <header className="auth-header-logo-only">
      <Link to="/" className="logo-link">
        <img src="https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93" alt="Nisadas Mawatha Logo" className="header-logo" />
      </Link>
    </header>
  );

  return (
    // --- 4. Auth Page එකේදී Footer එකත් hide කිරීම ---
    <div className={`app-layout ${theme} ${isAuthPage ? 'auth-page-layout' : ''}`}>
      {isAuthPage ? <AuthHeader /> : <Header />}
      <main className="main-content">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default Layout;