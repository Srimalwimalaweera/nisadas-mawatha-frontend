import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const { currentUser } = useAuth();

  // user ඉන්නවද සහ එයාගේ role එක 'admin' ද කියලා බලනවා
  if (currentUser && currentUser.role === 'admin') {
    return children; // admin නම්, ඇතුළට යන්න දෙනවා
  }

  // admin නැත්නම්, homepage එකට redirect කරනවා
  return <Navigate to="/" />;
}

export default AdminRoute;