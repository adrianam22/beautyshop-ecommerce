import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles.css";
import { UserContext } from "../context/UserContext";

const Layout = () => {
  const { user, setUser } = useContext(UserContext);

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  }

  return (
    <div className="layout-wrapper">
      <nav>
        <div className="nav-container">
          <Link to="/" className="logo">
            BeautyShop
          </Link>

          <div className="menu">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>

            {user ? (
              <>
                {user.is_admin && <Link to="/dashboard">Dashboard</Link>}

                <div className="dropdown">
                  <span className="dropdown-title">Hi, {user.email}</span>
                  <div className="dropdown-content">
                    <Link to="/profile">Profile</Link>
                    <a onClick={handleLogout}>Logout</a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>

      <footer>
        <p>© {new Date().getFullYear()} BeautyShop — Elegance Redefined.</p>
      </footer>
    </div>
  );
};

export default Layout;
