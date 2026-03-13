import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Checkout() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shipping_name: "",
    shipping_email: "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_postal_code: "",
    shipping_country: "Romania",
  });

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
        if (data.items.length === 0) {
          navigate("/cart");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadCart();

    // Load user data if available
    if (token) {
      fetch("http://127.0.0.1:8000/api/auth/me/", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((r) => r.json())
        .then((data) => {
          setForm({
            ...form,
            shipping_name: data.first_name + " " + (data.last_name || ""),
            shipping_email: data.email || "",
          });
        })
        .catch(() => {});
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      alert("Please login to place an order");
      return;
    }

    setSubmitting(true);

    fetch("http://127.0.0.1:8000/api/products/orders/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        return r.json().then((err) => {
          throw new Error(err.detail || "Error placing order");
        });
      })
      .then(() => {
        alert("Order placed successfully!");
        navigate("/orders");
      })
      .catch((err) => {
        alert("Error: " + err.message);
        setSubmitting(false);
      });
  }

  if (!token) {
    return (
      <div className="checkout-page-container">
        <div className="checkout-header">
          <h1 className="checkout-title">💳 Checkout</h1>
          <p className="checkout-subtitle">Please login to proceed</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="checkout-page-container">
        <div className="checkout-header">
          <h1 className="checkout-title">💳 Checkout</h1>
          <p className="checkout-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = cart?.total || 0;

  return (
    <div className="checkout-page-container">
      <div className="checkout-header">
        <h1 className="checkout-title">💳 Checkout</h1>
        <p className="checkout-subtitle">Complete your order</p>
      </div>

      <div className="checkout-content">
        <div className="checkout-form-section">
          <div className="checkout-form-card">
            <h2 className="form-section-title">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="shipping_name">Full Name *</label>
                <input
                  id="shipping_name"
                  type="text"
                  value={form.shipping_name}
                  onChange={(e) => setForm({ ...form, shipping_name: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="shipping_email">Email *</label>
                  <input
                    id="shipping_email"
                    type="email"
                    value={form.shipping_email}
                    onChange={(e) => setForm({ ...form, shipping_email: e.target.value })}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shipping_phone">Phone *</label>
                  <input
                    id="shipping_phone"
                    type="tel"
                    value={form.shipping_phone}
                    onChange={(e) => setForm({ ...form, shipping_phone: e.target.value })}
                    required
                    placeholder="+40 123 456 789"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="shipping_address">Address *</label>
                <input
                  id="shipping_address"
                  type="text"
                  value={form.shipping_address}
                  onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                  required
                  placeholder="Street name and number"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="shipping_city">City *</label>
                  <input
                    id="shipping_city"
                    type="text"
                    value={form.shipping_city}
                    onChange={(e) => setForm({ ...form, shipping_city: e.target.value })}
                    required
                    placeholder="Bucharest"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shipping_postal_code">Postal Code *</label>
                  <input
                    id="shipping_postal_code"
                    type="text"
                    value={form.shipping_postal_code}
                    onChange={(e) => setForm({ ...form, shipping_postal_code: e.target.value })}
                    required
                    placeholder="123456"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="shipping_country">Country *</label>
                <input
                  id="shipping_country"
                  type="text"
                  value={form.shipping_country}
                  onChange={(e) => setForm({ ...form, shipping_country: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-order-btn"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>

        <div className="checkout-summary-section">
          <div className="checkout-summary-card">
            <h2 className="summary-title">Order Summary</h2>
            <div className="order-items-list">
              {items.map((item: any) => (
                <div className="order-item-row" key={item.id}>
                  <div className="order-item-info">
                    <img
                      src={
                        item.product.image.startsWith("http")
                          ? item.product.image
                          : `http://127.0.0.1:8000/${item.product.image.replace(/^\/+/, "")}`
                      }
                      alt={item.product.name}
                      className="order-item-image"
                    />
                    <div>
                      <div className="order-item-name">{item.product.name}</div>
                      <div className="order-item-quantity">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="order-item-price">{item.subtotal} RON</div>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span>Subtotal</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
