import React from 'react';
import { Link } from 'react-router-dom';
import './FloatingActionButton.css';
import { useAuth } from '../../context/AuthContext'; // AuthContext එක import කරගන්න

const FloatingActionButton = () => {
  const { currentUser } = useAuth();

  // User login වී ඇත්නම් සහ reader නොවන creator කෙනෙක් නම් පමණක් button එක පෙන්වන්න
  const isCreator = currentUser && ['writer', 'photographer', 'student', 'admin'].includes(currentUser.role);

  if (!isCreator) {
    return null; // Creator කෙනෙක් නොවේ නම්, කිසිවක් නොපෙන්වන්න
  }

  return (
    <Link to="/creator" className="fab-container" title="Creator Panel">
      <div className="fab-icon">+</div>
    </Link>
  );
};

export default FloatingActionButton;