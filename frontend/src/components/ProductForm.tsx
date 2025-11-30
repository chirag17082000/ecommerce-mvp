import React, { useState } from "react";

type ProductFormProps = {
  onCreated: () => void; // callback to refresh list
};

type ProductFormState = {
  description: string;
  price: number;
  imageUrl: string; // manual URL fallback
  stock: number;
};

const ProductForm: React.FC<ProductFormProps> = ({ onCreated }) => {
  const [form, setForm] = useState<ProductFormState>({
    description: "",
    price: 0,
    imageUrl: "",
    stock: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let finalImageUrl = form.imageUrl.trim();

      // 1) If user selected a file, upload it first
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/products/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const text = await uploadRes.text().catch(() => "");
          setError(
            text || "Image upload failed. Please try again."
          );
          setLoading(false);
          return;
        }

        let uploadedUrl = await uploadRes.text();

        // In case backend returns quoted string (e.g. "\"/uploads/xyz.jpg\"")
        uploadedUrl = uploadedUrl.replace(/^"|"$/g, "");

        finalImageUrl = uploadedUrl;
      }

      // 2) Create the product using finalImageUrl (from file upload or manual input)
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description,
          price: form.price,
          imageUrl: finalImageUrl,
          stock: form.stock,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        setError(
          errBody
            ? JSON.stringify(errBody)
            : "Failed to create product"
        );
        return;
      }

      // success: clear form + file and tell parent to reload
      setForm({
        description: "",
        price: 0,
        imageUrl: "",
        stock: 0,
      });
      setSelectedFile(null);

      onCreated();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        padding: "16px 20px",
        marginBottom: "20px",
      }}
    >
      <h2 style={{ marginBottom: "12px" }}>Create Product</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: 500 }}>Description</label>
          <br />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", maxWidth: "500px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: 500 }}>Price (₹)</label>
          <br />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min={0}
            required
          />
        </div>

        {/* OPTIONAL manual URL field (fallback if no file upload) */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: 500 }}>Image URL (optional)</label>
          <br />
          <input
            type="text"
            name="imageUrl"
            placeholder="https://example.com/image.jpg"
            value={form.imageUrl}
            onChange={handleChange}
            style={{ width: "100%", maxWidth: "500px" }}
          />
          <div style={{ fontSize: "0.8rem", color: "#555" }}>
            If you also upload a file, the uploaded image will be used.
          </div>
        </div>

        {/* FILE UPLOAD */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: 500 }}>Upload Image (optional)</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* Preview of selected file */}
          {selectedFile && (
            <div style={{ marginTop: "10px" }}>
              <div style={{ fontSize: "0.85rem", marginBottom: "4px" }}>
                Preview:
              </div>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                style={{
                  width: "140px",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: 500 }}>Stock</label>
          <br />
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            min={0}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Product"}
        </button>

        {error && (
          <div style={{ color: "red", marginTop: "10px", maxWidth: "500px" }}>
            {error}
          </div>
        )}
      </form>
    </section>
  );
};

export default ProductForm;
