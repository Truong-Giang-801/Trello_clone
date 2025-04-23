import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // Redirect to login if the user is not logged in
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;