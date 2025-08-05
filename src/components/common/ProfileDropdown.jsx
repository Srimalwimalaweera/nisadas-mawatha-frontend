import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import './ProfileDropdown.css';

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      console.error("Failed to log out");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (!currentUser) return null;

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="profile-icon-btn">
        {currentUser.photoURL ? (
          <img 
            src={currentUser.photoURL} 
            alt="Profile" 
            className="profile-image" 
            referrerPolicy="no-referrer" // <-- අලුතෙන් එකතු කළ කොටස
          />
        ) : (
          <FaUserCircle className="profile-image-default" />
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <strong>{currentUser.displayName || 'User'}</strong>
            <p>{currentUser.email}</p>
          </div>
          <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>My Profile</Link>
          <Link to="/my-library" className="dropdown-item" onClick={() => setIsOpen(false)}>My Library</Link>
          <button onClick={handleLogout} className="dropdown-item logout-item">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;