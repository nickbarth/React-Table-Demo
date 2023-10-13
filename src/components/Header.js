import React from "react";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  const handleLogin = () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
    };
    login(user, "JWT");
  };

  return (
    <nav className="navbar navbar-dark bg-dark justify-content-between mb-2">
      <div className="container">
        <a className="navbar-brand" href="#">
          CRM
        </a>
        <ul className="navbar-nav mr-auto">
          {isAuthenticated ? (
            <>
              <span className="text-white">{user.email}</span>
              <a href="#" className="nav-link btn btn-danger" onClick={logout}>
                &nbsp; Logout &nbsp;
              </a>
            </>
          ) : (
            <li className="nav-item active">
              <a
                href="#"
                className="nav-link btn btn-primary"
                role="button"
                onClick={handleLogin}
              >
                &nbsp; Login &nbsp;
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
