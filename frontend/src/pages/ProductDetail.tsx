import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles.css";

type Product = {
  id: number;
  name: string;
  description: string;
  specifications: string;
  price: string;
  stock: number;
  supplier: string;
  delivery_method: string;
  category: number | null;
  category_name: string;
  image: string | null;
  similarity_score?: number;
};

const API_BASE = "http://127.0.0.1:8000/api/products";

function getImageUrl(image: string | null) {
  if (!image) {
    return "https://via.placeholder.com/800x800?text=BeautyShop";
  }

  return image.startsWith("http")
    ? image
    : `http://127.0.0.1:8000/${image.replace(/^\/+/, "")}`;
}

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  function addToCart(productIdValue: number) {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    fetch(`${API_BASE}/cart/`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productIdValue, quantity: 1 }),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Product added to cart!");
      })
      .catch(() => {
        alert("Unable to add the product to cart");
      });
  }

  useEffect(() => {
    if (!productId) {
      return;
    }

    setLoading(true);

    Promise.all([
      fetch(`${API_BASE}/${productId}/`).then((response) => response.json()),
      fetch(`${API_BASE}/${productId}/recommendations/`).then((response) => response.json()),
    ])
      .then(([productData, recommendationsData]) => {
        setProduct(productData);
        setRecommendations(Array.isArray(recommendationsData) ? recommendationsData : []);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-shell">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-shell">
          <h1>Product not found</h1>
          <Link to="/products" className="btn-outline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-shell">
        <div className="product-detail-card">
          <div className="product-detail-media">
            <img src={getImageUrl(product.image)} alt={product.name} className="product-detail-image" />
          </div>

          <div className="product-detail-content">
            <span className="product-detail-category">{product.category_name}</span>
            <h1 className="product-detail-title">{product.name}</h1>
            <p className="product-detail-price">{product.price} RON</p>

            <div className="product-detail-meta">
              <span>Stock: {product.stock}</span>
              <span>Supplier: {product.supplier || "BeautyShop Partner"}</span>
              <span>Delivery: {product.delivery_method || "Standard courier"}</span>
            </div>

            <section className="product-detail-section">
              <h2>Description</h2>
              <p>{product.description || "No description available."}</p>
            </section>

            <section className="product-detail-section">
              <h2>Specifications</h2>
              <p>{product.specifications || "No technical specifications available."}</p>
            </section>

            <div className="product-detail-actions">
              <button className="btn-gold" onClick={() => addToCart(product.id)}>
                Add to cart
              </button>
              <a
                href={`http://127.0.0.1:8000/api/products/${product.id}/pdf/`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Open PDF
              </a>
            </div>
          </div>
        </div>

        <section className="recommendations-section">
          <div className="section-header recommendations-header">
            <h2 className="section-title">Similar Products</h2>
            <p className="section-subtitle">You may also like these products.</p>
          </div>

          {recommendations.length === 0 ? (
            <div className="recommendations-empty">
              No similar products were found for this item.
            </div>
          ) : (
            <div className="recommendations-grid">
              {recommendations.map((recommended) => (
                <Link
                  key={recommended.id}
                  to={`/products/${recommended.id}`}
                  className="recommendation-card"
                >
                  <img
                    src={getImageUrl(recommended.image)}
                    alt={recommended.name}
                    className="recommendation-image"
                  />
                  <div className="recommendation-body">
                    <span className="recommendation-category">{recommended.category_name}</span>
                    <h3>{recommended.name}</h3>
                    <p>{recommended.price} RON</p>
                    <span className="recommendation-score">
                      Match: {((recommended.similarity_score || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
