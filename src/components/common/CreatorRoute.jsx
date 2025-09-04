// src/components/common/CreatorRoute.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

function CreatorRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    // If not logged in, redirect to the login page
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Admin users can access any route, so let them through.
  if (currentUser.role === 'admin') {
    return children;
  }

  // Define the correct, designated panel path for each role
  const correctPanelPath = {
    reader: '/creator/reader',
    writer: '/creator/writer',
    photographer: '/creator/photographer',
    student: '/creator/student',
  }[currentUser.role];

  // If the user's role doesn't have a designated panel, send them home.
  if (!correctPanelPath) {
    return <Navigate to="/" replace />;
  }

  // The main logic:
  // If the user is trying to access a path that is NOT their correct panel path,
  // redirect them to their own panel.
  if (location.pathname !== correctPanelPath) {
    return <Navigate to={correctPanelPath} replace />;
  }
  
  // If the user is accessing their own correct panel, allow them.
  return children;
}

export default CreatorRoute;