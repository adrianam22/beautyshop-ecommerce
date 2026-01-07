import React, { useEffect, useState } from "react";
import "../styles.css";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  function loadOrders() {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/products/orders/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function getStatusBadgeClass(status: string) {
    switch (status) {
      case "pending":
        return "status-badge status-pending";
      case "processing":
        return "status-badge status-processing";
      case "shipped":
        return "status-badge status-shipped";
      case "delivered":
        return "status-badge status-delivered";
      case "cancelled":
        return "status-badge status-cancelled";
      default:
        return "status-badge";
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (!token) {
    return (
      <div className="orders-page-container">
        <div className="orders-header">
          <h1 className="orders-title">📦 Order History</h1>
          <p className="orders-subtitle">Please login to view your orders</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page-container">
        <div className="orders-header">
          <h1 className="orders-title">📦 Order History</h1>
          <p className="orders-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page-container">
      <div className="orders-header">
        <h1 className="orders-title">📦 Order History</h1>
        <p className="orders-subtitle">
          {orders.length} {orders.length === 1 ? "order" : "orders"} total
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Your order history will appear here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <div className="order-header-left">
                  <h3 className="order-number">Order #{order.id}</h3>
                  <span className="order-date">{formatDate(order.created_at)}</span>
                </div>
                <div className="order-header-right">
                  <span className={getStatusBadgeClass(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="order-total">{order.total} RON</span>
                </div>
              </div>

              <div className="order-shipping-info">
                <h4 className="shipping-title">Shipping Address</h4>
                <p className="shipping-details">
                  {order.shipping_name}
                  <br />
                  {order.shipping_address}
                  <br />
                  {order.shipping_city}, {order.shipping_postal_code}
                  <br />
                  {order.shipping_country}
                </p>
                <p className="shipping-contact">
                  📧 {order.shipping_email} | 📞 {order.shipping_phone}
                </p>
              </div>

              <div className="order-items-section">
                <h4 className="items-title">Items ({order.items.length})</h4>
                <div className="order-items-list">
                  {order.items.map((item: any) => (
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
                          <div className="order-item-details">
                            {item.quantity} × {item.price} RON
                          </div>
                        </div>
                      </div>
                      <div className="order-item-subtotal">
                        {item.subtotal} RON
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
