import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, requiredRole, children }) => {
  if (!user) {
    // Redirect to login if the user is not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect if the user's role does not match the required role
    return <Navigate to={user.role === "Admin" ? "/admin" : "/private"} replace />;
  }

  return children;
};

export default ProtectedRoute;