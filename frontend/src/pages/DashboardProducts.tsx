import React, { useEffect, useState } from "react";

export default function DashboardProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    specifications: "",
    price: "",
    stock: "",
    supplier: "",
    delivery_method: "",
    category: "",
    image: null as File | null,
  });

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);

  const token = localStorage.getItem("access");

  function loadProducts() {
    fetch("http://127.0.0.1:8000/api/products/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((data) => setProducts(data));
  }

  function loadCategories() {
    fetch("http://127.0.0.1:8000/api/products/categories/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((data) => setCategories(data));
  }

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  function addProduct(e: any) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("specifications", form.specifications);
    formData.append("price", Number(form.price).toString());
    formData.append("stock", Number(form.stock).toString());
    formData.append("supplier", form.supplier);
    formData.append("delivery_method", form.delivery_method);
    formData.append("category", Number(form.category).toString());

    if (form.image) {
      formData.append("image", form.image);
    }

    fetch("http://127.0.0.1:8000/api/products/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    }).then(() => {
      setForm({
        name: "",
        description: "",
        specifications: "",
        price: "",
        stock: "",
        supplier: "",
        delivery_method: "",
        category: "",
        image: null,
      });
      loadProducts();
    });
  }

  function deleteProduct(id: number) {
    if (!confirm("Delete this product?")) return;

    fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    }).then(() => loadProducts());
  }

  function startEdit(product: any) {
    setEditForm({ ...product });
    setEditing(true);
  }

  function saveEdit() {
    const formData = new FormData();

    for (const key in editForm) {
      formData.append(key, editForm[key]);
    }

    fetch(`http://127.0.0.1:8000/api/products/${editForm.id}/`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
      body: formData,
    }).then(() => {
      setEditing(false);
      loadProducts();
    });
  }

  return (
    <div className="products-dashboard-container">
      {/* Header Section */}
      <div className="products-header">
        <h1 className="products-title">📦 Product Management</h1>
        <p className="products-subtitle">Add, edit, and manage your products</p>
      </div>

      <div className="add-product-card">
        <div className="card-header">
          <h2>➕ Add New Product</h2>
          <p>Fill in the details to create a new product</p>
        </div>
        <form onSubmit={addProduct} className="modern-product-form">
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>

            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                id="name"
                type="text"
                placeholder="e.g., Lancome L'Absolu Rouge"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Describe your product..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="specifications">Specifications</label>
              <textarea
                id="specifications"
                placeholder="Product specifications and details..."
                value={form.specifications}
                onChange={(e) =>
                  setForm({ ...form, specifications: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <div className="form-section">
            <h3 className="section-title">Pricing & Inventory</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (RON) *</label>
                <input
                  id="price"
                  type="number"
                  placeholder="150.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  id="stock"
                  type="number"
                  placeholder="50"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3 className="section-title">Supplier & Delivery</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="supplier">Supplier</label>
                <input
                  id="supplier"
                  type="text"
                  placeholder="Supplier name"
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="delivery">Delivery Method</label>
                <input
                  id="delivery"
                  type="text"
                  placeholder="e.g., Standard shipping"
                  value={form.delivery_method}
                  onChange={(e) =>
                    setForm({ ...form, delivery_method: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3 className="section-title">Category & Image</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image">Product Image</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files?.[0] || null })
                  }
                  className="file-input"
                />
                {form.image && (
                  <span className="file-name">📎 {form.image.name}</span>
                )}
              </div>
            </div>
          </div>

          <button className="submit-btn" type="submit">
            ✨ Add Product
          </button>
        </form>
      </div>

      {/* Products List */}
      <div className="products-list-card">
        <div className="card-header">
          <h2>📋 Products List</h2>
          <span className="product-count">{products.length} products</span>
        </div>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    📦 No products yet. Add your first product above!
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td className="product-name-cell">
                      <strong>{p.name}</strong>
                    </td>
                    <td className="price-cell">{p.price} RON</td>
                    <td>
                      <span className={`stock-badge ${p.stock < 10 ? 'low-stock' : ''}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      <span className="category-badge">{p.category_name}</span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => startEdit(p)}
                        title="Edit product"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => deleteProduct(p.id)}
                        title="Delete product"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editing && (
        <div className="modal-overlay">
          <div className="modern-modal">
            <div className="modal-header">
              <h2>✏️ Edit Product</h2>
              <button
                className="close-modal-btn"
                onClick={() => setEditing(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (RON)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={editForm.stock}
                    onChange={(e) =>
                      setEditForm({ ...editForm, stock: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button className="modal-btn save-btn" onClick={saveEdit}>
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
