import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, requiredRole, children }) => {
  if (!user) {
    // Redirect to login if the user is not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on the user's role
    if (user.role === "Admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "User") {
      return <Navigate to="/private" replace />;
    } else {
      // Default fallback for unknown roles
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;