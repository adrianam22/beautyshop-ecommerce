import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles.css";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  function loadWishlist() {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/products/wishlist/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((data) => {
        setWishlist(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  function removeFromWishlist(productId: number) {
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/products/wishlist/", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId }),
    }).then(() => {
      loadWishlist();
    });
  }

  function addToCart(productId: number) {
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
        alert("Error adding to cart: " + (err.message || "Unknown error"));
      });
  }

  if (!token) {
    return (
      <div className="wishlist-page-container">
        <div className="wishlist-header">
          <h1 className="wishlist-title">❤️ My Wishlist</h1>
          <p className="wishlist-subtitle">Please login to view your wishlist</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-page-container">
        <div className="wishlist-header">
          <h1 className="wishlist-title">❤️ My Wishlist</h1>
          <p className="wishlist-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  const products = wishlist?.products || [];

  return (
    <div className="wishlist-page-container">
      <div className="wishlist-header">
        <h1 className="wishlist-title">❤️ My Wishlist</h1>
        <p className="wishlist-subtitle">
          {products.length} {products.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {products.length === 0 ? (
        <div className="empty-wishlist-state">
          <div className="empty-icon">💔</div>
          <h3>Your wishlist is empty</h3>
          <p>Start adding products you love to your wishlist!</p>
        </div>
      ) : (
        <div className="wishlist-products-grid">
          {products.map((product: any) => (
            <div className="wishlist-product-card" key={product.id}>
              <div className="product-image-wrapper">
                <img
                  src={
                    product.image?.startsWith("http")
                      ? product.image
                      : product.image
                        ? `http://127.0.0.1:8000/${product.image.replace(/^\/+/, "")}`
                        : "https://via.placeholder.com/600x600?text=BeautyShop"
                  }
                  alt={product.name}
                  className="modern-product-image"
                />
                <div className="product-overlay">
                  <button
                    className="quick-view-btn"
                    onClick={() => addToCart(product.id)}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>

              <div className="product-info">
                <span className="product-category-tag">{product.category_name}</span>
                <h3 className="product-name">{product.name}</h3>
                <Link to={`/products/${product.id}`} className="product-inline-link">
                  View product page
                </Link>
                <div className="product-footer">
                  <span className="product-price">{product.price} RON</span>
                  <button
                    className="remove-wishlist-btn"
                    onClick={() => removeFromWishlist(product.id)}
                    title="Remove from wishlist"
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
