import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">BeautyShop</Link>

        <div className="menu">

          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          {user && (
            <>
              <Link to="/wishlist">❤️ Wishlist</Link>
              <Link to="/cart">🛒 Cart</Link>
              <Link to="/orders">📦 Orders</Link>
            </>
          )}

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
