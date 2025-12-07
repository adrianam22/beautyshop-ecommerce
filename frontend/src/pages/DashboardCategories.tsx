import React, { useEffect, useState } from "react";
import "../styles.css";

export default function DashboardCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);

  const token = localStorage.getItem("access");

  function loadCategories() {
    fetch("http://127.0.0.1:8000/api/products/categories/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function addCategory(e: any) {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/api/products/categories/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    }).then(() => {
      setName("");
      loadCategories();
    });
  }

  function deleteCategory(id: number) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    fetch(`http://127.0.0.1:8000/api/products/categories/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then(() => loadCategories());
  }

  function startEdit(cat: any) {
    setEditForm({ ...cat });
    setEditing(true);
  }

  function saveEdit() {
    fetch(`http://127.0.0.1:8000/api/products/categories/${editForm.id}/`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editForm),
    }).then(() => {
      setEditing(false);
      loadCategories();
    });
  }

  return (
    <div className="categories-dashboard-container">
      <div className="categories-header">
        <h1 className="categories-title">🏷️ Category Management</h1>
        <p className="categories-subtitle">Organize your products with categories</p>
      </div>
      <div className="add-category-card">
        <div className="card-header">
          <h2>➕ Add New Category</h2>
          <p>Create a new category to organize your products</p>
        </div>

        <form onSubmit={addCategory} className="category-add-form">
          <div className="form-group">
            <label htmlFor="category-name">Category Name *</label>
            <input
              id="category-name"
              type="text"
              placeholder="e.g., Makeup, Perfume, Skin Care..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button className="submit-btn" type="submit">
            ✨ Add Category
          </button>
        </form>
      </div>
      <div className="categories-list-card">
        <div className="card-header">
          <h2>📋 Categories List</h2>
          <span className="category-count">{categories.length} categories</span>
        </div>
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="empty-state">
                    🏷️ No categories yet. Add your first category above!
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="category-name-cell">
                      <strong>{cat.name}</strong>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => startEdit(cat)}
                        title="Edit category"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => deleteCategory(cat.id)}
                        title="Delete category"
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
              <h2>✏️ Edit Category</h2>
              <button
                className="close-modal-btn"
                onClick={() => setEditing(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Enter category name"
                />
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