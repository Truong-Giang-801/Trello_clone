import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="layout">

      <header className="header">
        <Header />
      </header>

      <main className="layoutChildren">
        {children}
      </main>

      <footer className="footer">

      </footer>

    </div>
  );
};
export default Layout;