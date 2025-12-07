import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import "../styles.css";
export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats({
          totalProducts: 127,
          totalCategories: 12,
          totalOrders: 345,
          totalRevenue: 45890
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);
  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="welcome-section">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }
  if (!user.is_admin) {
    return (
      <div className="dashboard-container">
        <div className="welcome-section">
          <h2>❌ Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, {user.email || "Admin"}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-number">{stats.totalProducts}</div>
          <span className="stat-trend trend-up">↑ 12% this month</span>
        </div>

        <div className="stat-card">
          <h3>Categories</h3>
          <div className="stat-number">{stats.totalCategories}</div>
          <span className="stat-trend trend-up">↑ 3 new</span>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-number">{stats.totalOrders}</div>
          <span className="stat-trend trend-up">↑ 8% this week</span>
        </div>

        <div className="stat-card">
          <h3>Revenue</h3>
          <div className="stat-number">{stats.totalRevenue.toLocaleString()} RON</div>
          <span className="stat-trend trend-up">↑ 15% this month</span>
        </div>
      </div>
      <div className="admin-panel-card">
        <h2>Admin Panel</h2>
        <div className="admin-menu-buttons">
          <Link to="/dashboard/categories" className="admin-menu-btn">
            Manage Categories
          </Link>
          <Link to="/dashboard/products" className="admin-menu-btn">
            Manage Products
          </Link>
        </div>
      </div>
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <Link to="/dashboard/products" className="action-card">
            <div className="action-icon">📦</div>
            <h4>Add Product</h4>
            <p>Create a new product</p>
          </Link>

          <Link to="/dashboard/categories" className="action-card">
            <div className="action-icon">🏷️</div>
            <h4>Add Category</h4>
            <p>Create a new category</p>
          </Link>

          <div className="action-card">
            <div className="action-icon">📊</div>
            <h4>View Reports</h4>
            <p>Analytics & insights</p>
          </div>

          <div className="action-card">
            <div className="action-icon">⚙️</div>
            <h4>Settings</h4>
            <p>Configure your store</p>
          </div>

          <div className="action-card">
            <div className="action-icon">👥</div>
            <h4>Customers</h4>
            <p>Manage customers</p>
          </div>

          <div className="action-card">
            <div className="action-icon">🎨</div>
            <h4>Customize</h4>
            <p>Edit site appearance</p>
          </div>
        </div>
      </div>
      <div className="welcome-section" style={{ marginTop: '40px' }}>
        <h2>Ready to manage your store? 🚀</h2>
        <p>Choose a section from above to get started with managing your e-commerce platform.</p>
      </div>
    </div>
  );
}