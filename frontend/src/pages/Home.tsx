import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles.css";

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/categories/")
      .then((r) => r.json())
      .then((data) => setCategories(data.slice(0, 6)));

    fetch("http://127.0.0.1:8000/api/products/")
      .then((r) => r.json())
      .then((data) => setFeaturedProducts(data.slice(0, 4)));
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Discover Your <span>Perfect Beauty</span>
          </h1>
          <p>
            Premium fragrances, luxury makeup, and the finest skincare — curated with elegance.
          </p>
          <Link to="/products" className="btn-gold">
            Shop Now
          </Link>
        </div>
        <div className="scroll-indicator"></div>
      </section>
      <section className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>On orders over 200 RON</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Premium Quality</h3>
            <p>Authentic luxury brands</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payment</h3>
            <p>100% protected transactions</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎁</div>
            <h3>Special Offers</h3>
            <p>Exclusive deals & discounts</p>
          </div>
        </div>
      </section>
      <section className="home-categories-section">
        <div className="section-header">
          <h2 className="section-title">Popular Categories</h2>
          <p className="section-subtitle">Explore our curated collections</p>
        </div>

        <div className="home-categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="home-category-card"
            >
              <div className="category-content">
                <div className="category-icon-large">🏷️</div>
                <h3>{cat.name}</h3>
                <span className="category-link">Explore →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="view-all-categories">
          <Link to="/products" className="btn-outline">
            View All Products
          </Link>
        </div>
      </section>
      <section className="home-products-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Handpicked items just for you</p>
        </div>

        <div className="home-products-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="home-product-card">
              <div className="product-image-container">
                <img
                  src={
                    product.image.startsWith("http")
                      ? product.image
                      : `http://127.0.0.1:8000/${product.image.replace(/^\/+/, "")}`
                  }
                  alt={product.name}
                  className="product-image-home"
                />
                <div className="product-badge">New</div>
              </div>

              <div className="product-details">
                <span className="product-category-small">{product.category_name}</span>
                <h3 className="product-title-home">{product.name}</h3>
                <div className="product-price-home">{product.price} RON</div>
                <button className="btn-add-cart">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-products">
          <Link to="/products" className="btn-gold">
            Browse All Products
          </Link>
        </div>
      </section>
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for exclusive offers and beauty tips</p>

          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>
      </section>
      <section className="brand-section">
        <h2>Certified Premium Beauty</h2>
        <p>We work only with trusted suppliers and world-renowned cosmetic brands.</p>
      </section>
    </div>
  );
}
