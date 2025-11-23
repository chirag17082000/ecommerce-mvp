import React, { useEffect, useState } from "react";
import type { Product } from "../types/product";

type ProductListProps = {
  reloadKey: number;
  onChange: () => void; // called after delete or update
};

const ProductList: React.FC<ProductListProps> = ({ reloadKey, onChange }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<{
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      });
  }, [reloadKey]);

  const handleDelete = async (productId: number) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete product #${productId}?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 404) {
        const body = await res.text();
        console.error("Delete failed:", body);
        alert("Failed to delete product");
        return;
      }

      onChange();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product");
    }
  };

  const startEdit = (product: Product) => {
    setEditing(product);
    setEditForm({
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl ?? "",
      stock: product.stock ?? 0,
    });
    setError(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editForm) return;
    const { name, value } = e.target;

    setEditForm((prev) =>
      !prev
        ? prev
        : {
            ...prev,
            [name]:
              name === "price" || name === "stock"
                ? Number(value)
                : value,
          }
    );
  };

  const saveEdit = async () => {
    if (!editing || !editForm) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        console.error("Update failed:", body);
        setError(
          body ? JSON.stringify(body) : "Failed to update product"
        );
        return;
      }

      setEditing(null);
      setEditForm(null);
      onChange();
    } catch (err: any) {
      console.error("Error updating product:", err);
      setError(err.message ?? "Error updating product");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditForm(null);
    setError(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <ul>
        {products.map((p) => (
          <li key={p.id} style={{ marginBottom: "10px" }}>
            <div>
              <strong>{p.description}</strong> — ₹{p.price} — stock:{" "}
              {p.stock ?? 0}
              {"  "}
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => startEdit(p)}
              >
                Edit
              </button>
              <button
                style={{ marginLeft: "5px" }}
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>

            {editing && editForm && editing.id === p.id && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "10px",
                  border: "1px solid #ccc",
                }}
              >
                <div style={{ marginBottom: "6px" }}>
                  <label>Description</label>
                  <br />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows={2}
                    style={{ width: "300px" }}
                  />
                </div>

                <div style={{ marginBottom: "6px" }}>
                  <label>Price (₹)</label>
                  <br />
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                  />
                </div>

                <div style={{ marginBottom: "6px" }}>
                  <label>Image URL</label>
                  <br />
                  <input
                    type="text"
                    name="imageUrl"
                    value={editForm.imageUrl}
                    onChange={handleEditChange}
                    style={{ width: "300px" }}
                  />
                </div>

                <div style={{ marginBottom: "6px" }}>
                  <label>Stock</label>
                  <br />
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock}
                    onChange={handleEditChange}
                  />
                </div>

                <button onClick={saveEdit} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  style={{ marginLeft: "8px" }}
                >
                  Cancel
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
