import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import PublicBoards from './pages/PublicBoards';
import UserBoards from './pages/UserBoards';
import Project from './pages/Project';
import Login from './pages/Login';
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
          <Route path="public-boards" element={ <PublicBoards /> } />
          <Route path="user-boards" element={ <UserBoards /> } />
          <Route path="board" element={ <BoardPage /> } />
          <Route path="projects" element={ <Project /> } />
          <Route path="login" element={ <Login /> } />

          {/* <Route path="*" element={<NoPage />} /> */ }
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
