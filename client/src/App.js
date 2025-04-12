import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import PublicBoards from './pages/PublicBoards';
import UserBoards from './pages/UserBoards';
import Project from './pages/Project';
import Login from './pages/Login';
const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" >
          <Route index element={<HomePage />} />
          <Route path="public-boards" element={<PublicBoards />} />
          <Route path="user-boards" element={<UserBoards />} />
          <Route path="project" element={<Project />} />
          <Route path="login" element={<Login />} />

          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
