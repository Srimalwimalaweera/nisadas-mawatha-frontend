import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function CreatorPanelRouter() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      // User login වෙලා නැත්නම්, login page එකට යවනවා
      navigate('/auth');
      return;
    }

    // Userගේ role එක අනුව අදාළ page එකට යවනවා
    switch (currentUser.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'writer':
        navigate('/creator/writer');
        break;
      case 'photographer':
        navigate('/creator/photographer');
        break;
      case 'student':
        navigate('/creator/student');
        break;
      case 'reader':
        navigate('/creator/reader');
        break;
      default:
        // Role එකක් නැති user කෙනෙක් නම්, homepage එකට යවනවා
        navigate('/');
        break;
    }
  }, [currentUser, navigate]);

  // Redirect වෙනකම් loading පණිවිඩයක් පෙන්වීම
  return <div style={{ padding: '2rem' }}>Redirecting to your panel...</div>;
}

export default CreatorPanelRouter;