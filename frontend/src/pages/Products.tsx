import React, { useEffect, useState } from "react";
import "../styles.css";

export default function ProductsPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [wishlistProductIds, setWishlistProductIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");

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

  function handleSearch() {

    if (!search.trim()) {
      loadProducts();
      return;
    }

    fetch(`http://127.0.0.1:8000/api/products/search/?q=${search}`)
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
    loadWishlist();
  }, [selectedCategory]);

  useEffect(() => {

  if (!search.trim()) {
    loadProducts()
    return
  }

  const delayDebounce = setTimeout(() => {
    handleSearch()
  }, 400)

  return () => clearTimeout(delayDebounce)

}, [search])


  function loadWishlist() {
    const token = localStorage.getItem("access");
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/products/wishlist/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((data) => {
        const ids = data.products?.map((p: any) => p.id) || [];
        setWishlistProductIds(ids);
      })
      .catch(() => {});
  }

  function addToWishlist(productId: number) {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login to add products to wishlist");
      return;
    }

    fetch("http://127.0.0.1:8000/api/products/wishlist/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId }),
    })
      .then((r) => r.json())
      .then(() => {
        setWishlistProductIds([...wishlistProductIds, productId]);
      })
      .catch((err) => {
        alert("Error: " + (err.detail || "Unknown error"));
      });
  }

  function removeFromWishlist(productId: number) {
    const token = localStorage.getItem("access");
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/products/wishlist/", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId }),
    })
      .then(() => {
        setWishlistProductIds(
          wishlistProductIds.filter((id) => id !== productId)
        );
      })
      .catch(() => {});
  }

  function addToCart(productId: number) {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    fetch("http://127.0.0.1:8000/api/products/cart/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    })
      .then((r) => r.json())
      .then(() => {
        alert("Product added to cart!");
      })
      .catch((err) => {
        alert("Error: " + (err.detail || "Unknown error"));
      });
  }

  return (
    <div className="products-page-container">
      <div className="products-page-header">
        <h1 className="products-page-title">🛍️ Our Products</h1>
        <p className="products-page-subtitle">
          Discover our amazing collection
        </p>
      </div>

      <div className="products-layout">

        {/* Sidebar */}
        <aside className="products-sidebar">
          <div className="sidebar-header">
            <h3>🏷️ Categories</h3>
            <span className="category-badge-count">{categories.length}</span>
          </div>

          <button
            className={`category-filter-btn ${
              selectedCategory === null ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            <span className="btn-icon">📦</span>
            All Products
          </button>

          <div className="category-divider"></div>

          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-filter-btn ${
                selectedCategory === cat.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="btn-icon">🏷️</span>
              {cat.name}
            </button>
          ))}
        </aside>

        {/* Main */}
        <main className="products-main">

          {/* Search bar */}
          <div className="products-search-bar">
            <input
              type="text"
              placeholder="🔍 Search products (TF-IDF)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input-modern"
            />
          </div>

          {products.length === 0 ? (
            <div className="empty-products-state">
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>Try another search or category</p>
            </div>
          ) : (
            <div className="modern-products-grid">

              {products.map((p) => (
                <div className="modern-product-card" key={p.id}>

                  <div className="product-image-wrapper">
                    <img
                      src={
                        p.image.startsWith("http")
                          ? p.image
                          : `http://127.0.0.1:8000/${p.image.replace(
                              /^\/+/,
                              ""
                            )}`
                      }
                      alt={p.name}
                      className="modern-product-image"
                    />

                    <div className="product-overlay">

                      <div className="product-overlay-buttons">

                        <button
                          className="quick-view-btn"
                          onClick={() => addToCart(p.id)}
                        >
                          🛒 Add to Cart
                        </button>

                        <a
                          href={`http://127.0.0.1:8000/api/products/${p.id}/pdf/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="quick-view-btn"
                        >
                          📄 View Details
                        </a>

                        {wishlistProductIds.includes(p.id) ? (
                          <button
                            className="quick-view-btn active"
                            onClick={() => removeFromWishlist(p.id)}
                          >
                            ❤️
                          </button>
                        ) : (
                          <button
                            className="quick-view-btn"
                            onClick={() => addToWishlist(p.id)}
                          >
                            🤍 Add to wishlist
                          </button>
                        )}

                      </div>
                    </div>
                  </div>

                  <div className="product-info">
                    <span className="product-category-tag">
                      {p.category_name}
                    </span>

                    <h3 className="product-name">{p.name}</h3>

                    <div className="product-footer">
                      <span className="product-price">{p.price} RON</span>

                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(p.id)}
                      >
                        🛒 Add
                      </button>
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