import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import PublicBoards from './pages/PublicBoards';
import UserBoards from './pages/UserBoards';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import { getAuth } from 'firebase/auth';
import BoardRouteWrapper from './pages/BoardRouteWrapper';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectRoute from './components/RedirectRoute';
import AdminPage from './pages/AdminPage';
import WorkspacePage from './pages/WorkspacePage';
import BoardPage from './pages/BoardPage';

function App () {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user data from the backend to get the role
          const response = await fetch(`http://localhost:5277/api/Users/uid/${firebaseUser.uid}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const userData = await response.json();
          setUser({ ...firebaseUser, role: userData.role });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null); // Reset user state in case of an error
        }
      } else {
        setUser(null); // Clear user state when no user is logged in
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Redirect logged-in users away from the homepage */ }
        <Route
          path="/"
          element={
            <RedirectRoute user={ user }>
              <HomePage />
            </RedirectRoute>
          }
        />

        {/* Public Boards */ }
        <Route
          path="public"
          element={ <PublicBoards /> }
        />

        {/* Private Boards (User Only) */ }
        <Route
          path="private"
          element={
            <ProtectedRoute user={ user } requiredRole="User">
              <UserBoards />
            </ProtectedRoute>
          }
        />

        {/* Admin Page (Admin Only) */ }
        <Route
          path="admin"
          element={
            <ProtectedRoute user={ user } requiredRole="Admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Board Page (User Only) */ }
        <Route
          path="board/:boardId"
          element={
              <BoardRouteWrapper />
          }
        />

        {/* Login */ }
        <Route
          path="login"
          element={
            <RedirectRoute user={ user }>
              <Login />
            </RedirectRoute>
          }
        />

        {/* Register */ }
        <Route
          path="register"
          element={
            <RedirectRoute user={ user }>
              <Register />
            </RedirectRoute>
          }
        />
        <Route
          path="workspace/:workspaceId"
          element={
            <ProtectedRoute user={ user } requiredRole="User">
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;