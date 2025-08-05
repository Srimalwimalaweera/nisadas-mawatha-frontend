import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  // user log වෙලා නැත්නම්, login page එකට යවනවා
  if (!currentUser) {
    // අපි userට කියනවා, log වුණාට පස්සේ ආපහු එන්න ඕන තැන මෙතන කියලා
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // user log වෙලා නම්, ඇතුළට යන්න දෙනවා
  return children;
}

export default ProtectedRoute;