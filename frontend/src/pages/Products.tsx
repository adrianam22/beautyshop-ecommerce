import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
};

type Category = {
  id: number;
  name: string;
};

type AutocompleteSuggestion = {
  id: number;
  name: string;
  category_name: string;
  score: number;
};

const API_BASE = "http://127.0.0.1:8000/api/products";

function getImageUrl(image: string | null) {
  if (!image) {
    return "https://via.placeholder.com/600x600?text=BeautyShop";
  }

  return image.startsWith("http")
    ? image
    : `http://127.0.0.1:8000/${image.replace(/^\/+/, "")}`;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlistProductIds, setWishlistProductIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [autocomplete, setAutocomplete] = useState<AutocompleteSuggestion[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category")
    ? Number(searchParams.get("category"))
    : null;

  function loadCategories() {
    fetch(`${API_BASE}/categories/`)
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }

  function loadProducts(categoryId?: number | null) {
    const token = localStorage.getItem("access");
    const activeCategory = categoryId === undefined ? selectedCategory : categoryId;
    const url = activeCategory
      ? `${API_BASE}/?category=${activeCategory}`
      : `${API_BASE}/`;

    fetch(url, {
      headers: {
        Authorization: token ? "Bearer " + token : "",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => setProducts([]));
  }

  function loadWishlist() {
    const token = localStorage.getItem("access");
    if (!token) return;

    fetch(`${API_BASE}/wishlist/`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((data) => {
        const ids = data.products?.map((product: Product) => product.id) || [];
        setWishlistProductIds(ids);
      })
      .catch(() => {});
  }

  function handleSearch() {
    const query = search.trim();

    if (!query) {
      loadProducts();
      setAutocomplete([]);
      return;
    }

    fetch(`${API_BASE}/search/?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => setProducts([]));
  }

  function loadAutocomplete(query: string) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setAutocomplete([]);
      return;
    }

    fetch(`${API_BASE}/autocomplete/?q=${encodeURIComponent(trimmedQuery)}`)
      .then((r) => r.json())
      .then((data) => setAutocomplete(Array.isArray(data) ? data : []))
      .catch(() => setAutocomplete([]));
  }

  function selectCategory(categoryId: number | null) {
    if (categoryId === null) {
      setSearchParams({});
      return;
    }

    setSearchParams({ category: String(categoryId) });
  }

  function addToWishlist(productId: number) {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login to add products to wishlist");
      return;
    }

    fetch(`${API_BASE}/wishlist/`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId }),
    })
      .then((r) => r.json())
      .then(() => {
        setWishlistProductIds((current) => [...new Set([...current, productId])]);
      })
      .catch(() => {
        alert("Unable to update wishlist");
      });
  }

  function removeFromWishlist(productId: number) {
    const token = localStorage.getItem("access");
    if (!token) return;

    fetch(`${API_BASE}/wishlist/`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId }),
    })
      .then(() => {
        setWishlistProductIds((current) => current.filter((id) => id !== productId));
      })
      .catch(() => {});
  }

  function addToCart(productId: number) {
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
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    })
      .then((r) => r.json())
      .then(() => {
        alert("Product added to cart!");
      })
      .catch(() => {
        alert("Unable to add the product to cart");
      });
  }

  useEffect(() => {
    loadCategories();
    loadWishlist();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      loadProducts();
    }
  }, [selectedCategory]);

  useEffect(() => {
    const debounceId = window.setTimeout(() => {
      loadAutocomplete(search);

      if (search.trim()) {
        handleSearch();
        return;
      }

      loadProducts();
    }, 300);

    return () => window.clearTimeout(debounceId);
  }, [search]);

  return (
    <div className="products-page-container">
      <div className="products-page-header">
        <h1 className="products-page-title">Our Products</h1>
        <p className="products-page-subtitle">Find the products you want faster.</p>
      </div>

      <div className="products-layout">
        <aside className="products-sidebar">
          <div className="sidebar-header">
            <h3>Categories</h3>
            <span className="category-badge-count">{categories.length}</span>
          </div>

          <button
            className={`category-filter-btn ${selectedCategory === null ? "active" : ""}`}
            onClick={() => selectCategory(null)}
          >
            All Products
          </button>

          <div className="category-divider"></div>

          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-filter-btn ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => selectCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </aside>

        <main className="products-main">
          <div className="products-search-shell">
            <div className="products-search-bar predictive-search products-search-bar-wide">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={() => setShowAutocomplete(true)}
                onBlur={() => {
                  window.setTimeout(() => setShowAutocomplete(false), 150);
                }}
                className="form-input-modern"
              />

              {showAutocomplete && autocomplete.length > 0 && (
                <div className="autocomplete-dropdown">
                  {autocomplete.map((suggestion) => (
                    <Link
                      key={suggestion.id}
                      to={`/products/${suggestion.id}`}
                      className="autocomplete-item"
                    >
                      <span className="autocomplete-name">{suggestion.name}</span>
                      <span className="autocomplete-meta">{suggestion.category_name || "Product"}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="empty-products-state">
              <div className="empty-icon">No results</div>
              <h3>No products found</h3>
              <p>Try another title or a different category.</p>
            </div>
          ) : (
            <div className="modern-products-grid">
              {products.map((product) => (
                <div className="modern-product-card" key={product.id}>
                  <div className="product-image-wrapper">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="modern-product-image"
                    />

                    <div className="product-overlay">
                      <div className="product-overlay-buttons">
                        <button className="quick-view-btn" onClick={() => addToCart(product.id)}>
                          Add to Cart
                        </button>
                        <Link to={`/products/${product.id}`} className="quick-view-btn">
                          View Product
                        </Link>
                        {wishlistProductIds.includes(product.id) ? (
                          <button
                            className="quick-view-btn active"
                            onClick={() => removeFromWishlist(product.id)}
                          >
                            Remove Wishlist
                          </button>
                        ) : (
                          <button className="quick-view-btn" onClick={() => addToWishlist(product.id)}>
                            Add to Wishlist
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="product-info">
                    <span className="product-category-tag">{product.category_name}</span>
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-footer">
                      <span className="product-price">{product.price} RON</span>
                      <button className="add-to-cart-btn" onClick={() => addToCart(product.id)}>
                        Add
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
