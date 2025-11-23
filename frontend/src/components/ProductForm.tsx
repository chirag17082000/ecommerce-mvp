import React, { useState } from "react";

type ProductFormProps = {
  onCreated: () => void; // callback to refresh list
};

type ProductFormState = {
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
};

const ProductForm: React.FC<ProductFormProps> = ({ onCreated }) => {
  const [form, setForm] = useState<ProductFormState>({
    description: "",
    price: 0,
    imageUrl: "",
    stock: 0,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

      // success: clear form and tell parent to reload
      setForm({
        description: "",
        price: 0,
        imageUrl: "",
        stock: 0,
      });

      onCreated();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "20px",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px",
      }}
    >
      <h2>Create Product</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Description</label>
        <br />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          style={{ width: "300px" }}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Price (₹)</label>
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

      <div style={{ marginBottom: "10px" }}>
        <label>Image URL</label>
        <br />
        <input
          type="text"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          style={{ width: "300px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Stock</label>
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
        <div style={{ color: "red", marginTop: "10px" }}>
          {error}
        </div>
      )}
    </form>
  );
};

export default ProductForm;
