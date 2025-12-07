import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles.css";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/categories/")
      .then((r) => r.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <div className="categories-page-container">
      <div className="categories-page-header">
        <h1 className="categories-page-title">🏷️ Shop by Category</h1>
        <p className="categories-page-subtitle">Explore our product categories</p>
      </div>
      <div className="modern-category-grid">
        {categories.length === 0 ? (
          <div className="empty-categories-state">
            <div className="empty-icon">🏷️</div>
            <h3>No categories available</h3>
            <p>Categories will appear here soon</p>
          </div>
        ) : (
          categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="modern-category-card"
            >
              <div className="category-icon">🏷️</div>
              <h3 className="category-name">{cat.name}</h3>
              <span className="category-arrow">→</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}