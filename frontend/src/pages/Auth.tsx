import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

 try {
  const response = await fetch("http://127.0.0.1:8000/api/auth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email,
      password: password,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    alert("Logged in successfully!");
    window.location.href = "/";
  } else {
    setError(data.detail || "Invalid email or password. Please try again.");
      }
    } catch (error) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        first_name: name,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setName("");
        setEmail("");
        setPassword("");
        setError("");
        setIsLogin(true);
        alert("Account created successfully! Please login.");
      } else {
      const errorMessage =
          data.detail ||
          data.username?.[0] ||
          data.email?.[0] ||
          data.password?.[0] ||
          "Error creating account. Please try again.";
        setError(errorMessage);
        console.error("Registration error:", data);
      }
    } catch (error) {
      setError("Connection error. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  rreturn (
    <div className="auth-page-container">
      <div className="auth-wrapper">
        <div className="auth-card-modern">
          {/* Header with Logo */}
          <div className="auth-header">
            <h1 className="auth-logo">✨ BeautyShop</h1>
            <p className="auth-subtitle">
              {isLogin ? "Welcome back! Sign in to continue." : "Create your account and start shopping"}
            </p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs-modern">
            <button
              className={`auth-tab ${isLogin ? "active" : ""}`}
              onClick={() => {
                setIsLogin(true);
                setError("");
                setName("");
                setEmail("");
                setPassword("");
              }}
            >
              🔐 Login
            </button>
            <button
              className={`auth-tab ${!isLogin ? "active" : ""}`}
              onClick={() => {
                setIsLogin(false);
                setError("");
                setName("");
                setEmail("");
                setPassword("");
              }}
            >
              ✨ Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="auth-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Forms */}
          {isLogin ? (
            <form className="auth-form-modern" onSubmit={handleLogin}>
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-input-modern"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group-modern">
                <label className="form-label-modern">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <input
                  type="password"
                  className="form-input-modern"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="auth-btn-modern"
                disabled={loading}
              >
                {loading ? "⏳ Signing in..." : "🚀 Sign In"}
              </button>
            </form>
          ) : (
            <form className="auth-form-modern" onSubmit={handleRegister}>
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <span className="label-icon">👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-input-modern"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group-modern">
                <label className="form-label-modern">
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-input-modern"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group-modern">
                <label className="form-label-modern">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <input
                  type="password"
                  className="form-input-modern"
                  placeholder="Choose a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={loading}
                />
                <small className="form-hint">Minimum 8 characters</small>
              </div>

              <button
                type="submit"
                className="auth-btn-modern"
                disabled={loading}
              >
                {loading ? "⏳ Creating account..." : "✨ Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
