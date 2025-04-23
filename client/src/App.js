import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import PublicBoards from './pages/PublicBoards';
import UserBoards from './pages/UserBoards';
import Project from './pages/Project';
import Login from './pages/Login';
import Register from './pages/Register'
import Header from './components/Header';
import { getAuth } from 'firebase/auth';
import BoardPage from './pages/BoardPage';

function App () {
  // eslint-disable-next-line
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
          <Route path="private" element={ <UserBoards /> } />
          <Route path="workspace" element={ <Project /> } />
          <Route path="board/:boardId" element={<BoardPage />} />
          <Route path="login" element={ <Login /> } />
          <Route path="register" element={ <Register /> } />

          {/* <Route path="*" element={<NoPage />} /> */ }
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
