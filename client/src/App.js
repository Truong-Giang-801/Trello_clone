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
import RedirectRoute from './components/RedirectRoute'; // Import RedirectRoute

function App () {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
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
              <ProtectedRoute user={user}>
                <UserBoards />
              </ProtectedRoute>
            }
          />
          <Route
            path="board/:boardId"
            element={
              <ProtectedRoute user={user}>
                <BoardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="login"
            element={
              <RedirectRoute user={user}>
                <Login />
              </RedirectRoute>
            }
          />
          <Route
            path="register"
            element={
              <RedirectRoute user={user}>
                <Register />
              </RedirectRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;