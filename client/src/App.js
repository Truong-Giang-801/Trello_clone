import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import PublicBoards from './pages/PublicBoards';
import UserBoards from './pages/UserBoards';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import { getAuth } from 'firebase/auth';
import BoardPage from './pages/BoardPage';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectRoute from './components/RedirectRoute';
import AdminPage from './pages/AdminPage';
import WorkspacePage from './pages/WorkspacePage';

function App () {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user data from the backend to get the role
          const response = await fetch(`http://localhost:5277/api/users/uid/${firebaseUser.uid}`);
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
        <Route path="/">
          <Route index element={ <HomePage /> } />
          <Route path="public" element={ <PublicBoards /> } />
          <Route
            path="private"
            element={
              <ProtectedRoute user={ user } requiredRole="User">
                <UserBoards />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute user={ user } requiredRole="Admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="board/:boardId"
            element={
              <ProtectedRoute user={ user } requiredRole="User">
                <BoardPage />
              </ProtectedRoute>
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
          <Route
            path="login"
            element={
              <RedirectRoute user={ user }>
                <Login />
              </RedirectRoute>
            }
          />
          <Route
            path="register"
            element={
              <RedirectRoute user={ user }>
                <Register />
              </RedirectRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;