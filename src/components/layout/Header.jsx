import React from 'react';
import './Header.css'; // අපි මේ CSS file එක ඊළඟට හදනවා

function Header() {
  return (
    <header className="main-header">
      <div className="logo">නිසඳැස් මාවත</div>
      <nav className="main-nav">
        <a href="/">මුල් පිටුව</a>
        <a href="/books">පොත්</a>
        <a href="/writers">ලේඛකයින්</a>
      </nav>
      <div className="user-actions">
        <button className="login-btn">Login</button>
      </div>
    </header>
  );
}

export default Header;