import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectRoute = ({ user, children }) => {
  if (user) {
    // Redirect logged-in users to the private boards page
    return <Navigate to="/private" replace />;
  }

  return children;
};

export default RedirectRoute;