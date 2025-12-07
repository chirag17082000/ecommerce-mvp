import React, { useState } from "react";
import { getAuthToken } from "../api/auth";

interface ProductFormProps {
  onCreated: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onCreated }) => {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const uploadImage = async (token: string): Promise<string | null> => {
  if (!imageFile) return null;

  const formData = new FormData();
  formData.append("file", imageFile);

  const res = await fetch("http://localhost:8080/api/products/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await res.text();
  const url = text.trim();

  // CASE 1: backend returns complete URL
  if (url.startsWith("http")) {
    return url;
  }

  // CASE 2: backend returns path like /uploads/abc.jpg
  return `http://localhost:8080${url}`;
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        setError("You must be logged in as admin to create products.");
        alert("Please login as admin.");
        window.location.href = "/login";
        return;
      }

      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage(token);
      }

      const res = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          price: price === "" ? 0 : Number(price),
          stock: stock === "" ? 0 : Number(stock),
          imageUrl: imageUrl || "",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create product");
      }

      // reset form
      setDescription("");
      setPrice("");
      setStock("");
      setImageFile(null);
      setImagePreview(null);

      onCreated();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        marginBottom: "20px",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "12px",
          fontSize: "1.1rem",
          color: "#111827",
        }}
      >
        Add / Edit Product
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
          alignItems: "flex-start",
        }}
      >
        <div>
          <label style={{ fontSize: "0.85rem", color: "#4b5563" }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              resize: "vertical",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            <div>
              <label style={{ fontSize: "0.85rem", color: "#4b5563" }}>
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === "" ? "" : Number(e.target.value))
                }
                required
                min={0}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "4px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", color: "#4b5563" }}>
                Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value === "" ? "" : Number(e.target.value))
                }
                min={0}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "4px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                marginTop: "10px",
                color: "#b91c1c",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "14px",
              padding: "10px 16px",
              borderRadius: "9999px",
              border: "none",
              backgroundColor: loading ? "#6b7280" : "#111827",
              color: "#ffffff",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 500,
              fontSize: "0.95rem",
            }}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>

        <div>
          <label style={{ fontSize: "0.85rem", color: "#4b5563" }}>
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              display: "block",
              marginTop: "4px",
              marginBottom: "8px",
              fontSize: "0.85rem",
            }}
          />
          <div
            style={{
              borderRadius: "12px",
              border: "1px dashed #d1d5db",
              padding: "8px",
              minHeight: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                imagePreview != null
                  ? "radial-gradient(circle at top, #eff6ff, #f9fafb)"
                  : "#f9fafb",
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "140px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "#9ca3af",
                  textAlign: "center",
                }}
              >
                No image selected. Choose a file to preview here.
              </span>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default ProductForm;
