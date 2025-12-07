import React, { useEffect, useState } from "react";
import { getAuthToken } from "../api/auth";

interface Product {
  id: number;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

interface ProductListProps {
  reloadKey: number;
  onChange: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ reloadKey, onChange }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState<number | "">("");
  const [editStock, setEditStock] = useState<number | "">("");
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/products");
      if (!res.ok) {
        throw new Error("Failed to load products");
      }
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditDescription(p.description);
    setEditPrice(p.price);
    setEditStock(p.stock);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDescription("");
    setEditPrice("");
    setEditStock("");
  };

  const saveEdit = async (id: number) => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login as admin.");
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: editDescription,
          price: editPrice === "" ? 0 : Number(editPrice),
          stock: editStock === "" ? 0 : Number(editStock),
          // keep existing imageUrl on backend; we don't change it here
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      cancelEdit();
      onChange();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update product");
    }
  };

  const deleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login as admin.");
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      onChange();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete product");
    }
  };

  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "8px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.1rem",
            color: "#111827",
          }}
        >
          Products
        </h2>

        {loading && (
          <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            Loading...
          </span>
        )}
      </div>

      {error && (
        <div
          style={{
            marginBottom: "10px",
            color: "#b91c1c",
            fontSize: "0.85rem",
          }}
        >
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#f9fafb",
            border: "1px dashed #e5e7eb",
            fontSize: "0.9rem",
            color: "#6b7280",
          }}
        >
          No products found. Add some using the form above.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {products.map((p) => {
            const isEditing = editingId === p.id;
            return (
              <div
                key={p.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {p.imageUrl ? (
                  <div style={{ width: "100%", height: "150px" }}>
                    <img
                      src={p.imageUrl}
                      alt={p.description}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "150px",
                      background:
                        "repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 10px, #e5e7eb 10px, #e5e7eb 20px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9ca3af",
                      fontSize: "0.8rem",
                    }}
                  >
                    No image
                  </div>
                )}

                <div style={{ padding: "12px 14px", flexGrow: 1 }}>
                  {isEditing ? (
                    <>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #d1d5db",
                          marginBottom: "8px",
                          fontSize: "0.9rem",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) =>
                            setEditPrice(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                          style={{
                            flex: 1,
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            fontSize: "0.85rem",
                          }}
                          placeholder="Price"
                        />
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) =>
                            setEditStock(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                          style={{
                            flex: 1,
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            fontSize: "0.85rem",
                          }}
                          placeholder="Stock"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: "0.95rem",
                          color: "#111827",
                        }}
                      >
                        {p.description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.85rem",
                          color: "#4b5563",
                        }}
                      >
                        <span>₹{p.price}</span>
                        <span>Stock: {p.stock}</span>
                      </div>
                    </>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 10px 10px",
                    borderTop: "1px solid #f3f4f6",
                    gap: "8px",
                  }}
                >
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(p.id)}
                        style={{
                          flex: 1,
                          padding: "6px 0",
                          borderRadius: "9999px",
                          border: "none",
                          backgroundColor: "#16a34a",
                          color: "#ffffff",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          flex: 1,
                          padding: "6px 0",
                          borderRadius: "9999px",
                          border: "1px solid #9ca3af",
                          backgroundColor: "#ffffff",
                          color: "#4b5563",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(p)}
                        style={{
                          flex: 1,
                          padding: "6px 0",
                          borderRadius: "9999px",
                          border: "none",
                          backgroundColor: "#111827",
                          color: "#ffffff",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        style={{
                          flex: 1,
                          padding: "6px 0",
                          borderRadius: "9999px",
                          border: "none",
                          backgroundColor: "#b91c1c",
                          color: "#ffffff",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductList;
