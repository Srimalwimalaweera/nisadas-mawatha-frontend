
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../../context/PopupContext';
import Logo from './Logo'; // අපේ Logo component එක
import './LoginPromptPopup.css';

// Icons
import { IoClose } from 'react-icons/io5';
import { FaReact, FaCommentDots, FaBook, FaPenSquare, FaChartLine, FaShoppingBag, FaGift } from 'react-icons/fa';

const features = [
  { name: 'Reaction', icon: <FaReact /> },
  { name: 'Comment', icon: <FaCommentDots /> },
  { name: 'My Library', icon: <FaBook /> },
  { name: 'Create Notebook', icon: <FaPenSquare /> },
  { name: 'User Activity', icon: <FaChartLine /> },
  { name: 'Buy Books', icon: <FaShoppingBag /> },
  { name: 'Send Gift', icon: <FaGift /> },
];

function LoginPromptPopup() {
  const { isLoginPromptOpen, closeLoginPrompt } = usePopup();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      const onWheel = (e) => {
        if (e.deltaY === 0) return; // තිරස් scroll එකක් නම්, කිසිවක් නොකරන්න
        e.preventDefault(); // පිටුව vertical scroll වීම වැළැක්වීම
        element.scrollTo({
          left: element.scrollLeft + e.deltaY,
          behavior: 'smooth' // සිනිඳු scroll වීමක් සඳහා
        });
      };
      element.addEventListener('wheel', onWheel);
      return () => element.removeEventListener('wheel', onWheel);
    }
  }, [isLoginPromptOpen]);

  if (!isLoginPromptOpen) {
    return null;
  }

  const handleLogin = () => {
    closeLoginPrompt();
    navigate('/auth');
  }

  const handleSignup = () => {
    closeLoginPrompt();
    navigate('/auth');
  }

  return (
    <div className="popup-overlay" onClick={closeLoginPrompt}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={closeLoginPrompt}>
          <IoClose />
        </button>

        <div className="popup-logo">
          <Logo />
        </div>

        <h2>Log in to Use This Feature</h2>

        <p className="popup-subtitle">Unlock all features by creating an account</p>

        <div className="features-scroll-container" ref={scrollRef}>
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <span className="feature-name">{feature.name}</span>
            </div>
          ))}
        </div>

        <div className="popup-actions">
          <button className="popup-btn login" onClick={handleLogin}>Login</button>
          <button className="popup-btn signup" onClick={handleSignup}>Sign Up</button>
        </div>

        <div className="popup-links">
          <a href="/terms" onClick={closeLoginPrompt}>Terms & Conditions</a>
          <a href="/privacy-policy" onClick={closeLoginPrompt}>Privacy Policy</a>
          <a href="/about" onClick={closeLoginPrompt}>About Us</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPromptPopup;