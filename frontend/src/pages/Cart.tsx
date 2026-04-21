import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  function loadCart() {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/products/cart/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((data) => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadCart();
  }, []);

  function updateQuantity(itemId: number, newQuantity: number) {
    if (!token) return;

    fetch(`http://127.0.0.1:8000/api/products/cart/items/${itemId}/`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    }).then(() => {
      loadCart();
    });
  }

  function removeItem(itemId: number) {
    if (!token) return;

    fetch(`http://127.0.0.1:8000/api/products/cart/items/${itemId}/`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    }).then(() => {
      loadCart();
    });
  }

  if (!token) {
    return (
      <div className="cart-page-container">
        <div className="cart-header">
          <h1 className="cart-title">🛒 Shopping Cart</h1>
          <p className="cart-subtitle">Please login to view your cart</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-page-container">
        <div className="cart-header">
          <h1 className="cart-title">🛒 Shopping Cart</h1>
          <p className="cart-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = cart?.total || 0;

  return (
    <div className="cart-page-container">
      <div className="cart-header">
        <h1 className="cart-title">🛒 Shopping Cart</h1>
        <p className="cart-subtitle">
          {items.length} {items.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Start adding products to your cart!</p>
          <button
            className="btn-gold"
            onClick={() => navigate("/products")}
            style={{ marginTop: "20px" }}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            {items.map((item: any) => (
              <div className="cart-item-card" key={item.id}>
                <div className="cart-item-image">
                  <img
                    src={
                      item.product.image.startsWith("http")
                        ? item.product.image
                        : `http://127.0.0.1:8000/${item.product.image.replace(/^\/+/, "")}`
                    }
                    alt={item.product.name}
                  />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  <p className="cart-item-category">{item.product.category_name}</p>
                  <div className="cart-item-price">{item.product.price} RON</div>
                </div>
                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-subtotal">
                  <div className="subtotal-label">Subtotal</div>
                  <div className="subtotal-value">{item.subtotal} RON</div>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => removeItem(item.id)}
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary-section">
            <div className="cart-summary-card">
              <h2 className="summary-title">Order Summary</h2>
              <div className="summary-row">
                <span>Items ({items.length})</span>
                <span>{total.toFixed(2)} RON</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-amount">{total.toFixed(2)} RON</span>
              </div>
              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
