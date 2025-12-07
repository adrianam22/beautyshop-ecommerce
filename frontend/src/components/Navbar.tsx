import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/categories/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
        else setCategories([]);
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">BeautyShop</Link>

        <div className="menu">

          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          {user?.is_admin && (
            <Link to="/dashboard">Dashboard</Link>
          )}

          {user ? (
            <>
              <span className="nav-username">Hi, {user.username}</span>
              <button
                className="nav-btn logout"
                onClick={() => {
                  localStorage.clear();
                  setUser(null);
                  window.location.reload();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="nav-btn login">Login</Link>
              <Link to="/auth" className="nav-btn signup">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
