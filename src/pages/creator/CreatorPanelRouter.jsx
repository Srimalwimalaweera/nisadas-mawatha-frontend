// src/pages/creator/CreatorPanelRouter.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../../components/common/LoadingScreen';

// This component's only job is to redirect from the generic '/creator' path
// to the user's specific panel.
function CreatorPanelRouter() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return; // Wait until user data is loaded
    }

    if (!currentUser) {
      navigate('/auth'); // If not logged in, go to auth page
      return;
    }

    // Redirect based on the user's role
    const { role } = currentUser;

    if (role === 'admin') {
      navigate('/admin'); // Admins can go to their main panel
    } else if (role === 'writer') {
      navigate('/creator/writer');
    } else if (role === 'photographer') {
      navigate('/creator/photographer');
    } else if (role === 'student') {
      navigate('/creator/student');
    } else if (role === 'reader') {
      navigate('/creator/reader');
    } else {
      navigate('/'); // If role is undefined or something else, go home
    }
  }, [currentUser, loading, navigate]);

  // Show a loading screen while the redirect logic runs
  return <LoadingScreen />;
}

export default CreatorPanelRouter;