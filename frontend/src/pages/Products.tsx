import React, { useEffect, useState } from "react";
import "../styles.css";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  function loadCategories() {
    fetch("http://127.0.0.1:8000/api/products/categories/")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
        else setCategories([]);
      });
  }

  function loadProducts() {
    const token = localStorage.getItem("access");

    const url = selectedCategory
      ? `http://127.0.0.1:8000/api/products/?category=${selectedCategory}`
      : "http://127.0.0.1:8000/api/products/";

    fetch(url, {
      headers: {
        Authorization: token ? "Bearer " + token : "",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
        else setProducts([]);
      });
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  return (
    <div className="products-page-container">
      <div className="products-page-header">
        <h1 className="products-page-title">🛍️ Our Products</h1>
        <p className="products-page-subtitle">Discover our amazing collection</p>
      </div>

      <div className="products-layout">
        {/* Sidebar */}
        <aside className="products-sidebar">
          <div className="sidebar-header">
            <h3>🏷️ Categories</h3>
            <span className="category-badge-count">{categories.length}</span>
          </div>

          <button
            className={`category-filter-btn ${selectedCategory === null ? "active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            <span className="btn-icon">📦</span>
            All Products
            <span className="count-badge">{products.length}</span>
          </button>

          <div className="category-divider"></div>

          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-filter-btn ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="btn-icon">🏷️</span>
              {cat.name}
            </button>
          ))}
        </aside>
        <main className="products-main">
          {selectedCategory && (
            <div className="filter-info">
              <span>Showing products in: <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong></span>
              <button className="clear-filter" onClick={() => setSelectedCategory(null)}>
                ✕ Clear filter
              </button>
            </div>
          )}

          {products.length === 0 ? (
            <div className="empty-products-state">
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>Try selecting a different category or check back later</p>
            </div>
          ) : (
            <div className="modern-products-grid">
              {products.map((p) => (
                <div className="modern-product-card" key={p.id}>
                  <div className="product-image-wrapper">
                    <img
                      src={p.image.startsWith("http") ? p.image : `http://127.0.0.1:8000/${p.image.replace(/^\/+/, "")}`}
                      alt={p.name}
                      className="modern-product-image"
                    />
                    <div className="product-overlay">
                      <button className="quick-view-btn">👁️ Quick View</button>
                    </div>
                  </div>

                  <div className="product-info">
                    <span className="product-category-tag">{p.category_name}</span>
                    <h3 className="product-name">{p.name}</h3>
                    <div className="product-footer">
                      <span className="product-price">{p.price} RON</span>
                      <button className="add-to-cart-btn">🛒 Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}