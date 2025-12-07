import React, { useState } from "react";
import "../styles.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

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
    alert("Invalid credentials!");
  }
};
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        email: email,
        password: password,
        first_name: name,
      }),
    });

    if (response.ok) {
      alert("Account created successfully!");
      setIsLogin(true);
    } else {
      alert("Error creating account.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={isLogin ? "tab active" : "tab"}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={!isLogin ? "tab active" : "tab"}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Welcome Back</h2>

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="auth-btn">Login</button>
          </form>
        ) : (

          <form className="auth-form" onSubmit={handleRegister}>
            <h2>Create Your Account</h2>

            <label>Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="auth-btn">Register</button>
          </form>
        )}
      </div>
    </div>
  );
}
