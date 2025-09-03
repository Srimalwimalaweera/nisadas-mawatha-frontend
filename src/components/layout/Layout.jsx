import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './Layout.css';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingScreen from '../common/LoadingScreen.jsx';

function Layout({ children }) {
  const { theme } = useTheme();
  
  // --- 2. දැනට සිටින page path එක ලබාගැනීම ---
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
const { loading } = useAuth();
  // --- 3. Auth Page එකට විශේෂිත Logo component එකක් ---
  const AuthHeader = () => (
    <header className="auth-header-logo-only">
      <Link to="/" className="logo-link">
        <img src="https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93" alt="Nisadas Mawatha Logo" className="header-logo" />
      </Link>
    </header>
  );

  if (isAuthPage) {
    return (
      <div className={`app-layout ${theme} auth-page-layout`}>
        <AuthHeader />
        <main className="main-content">{children}</main>
      </div>
    );
}
return (
    <div className={`app-layout ${theme}`}>
      {/* loading වෙද්දී showSearchBox={false} ලෙස යෙදීම */}
      <Header showSearchBox={!loading} />
      <main className="main-content">
        {/* loading නම් LoadingScreen එකත්, නැත්නම් page content එකත් පෙන්වීම */}
        {loading ? <LoadingScreen /> : children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;