import React, { useState } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

const App: React.FC = () => {
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = () => {
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <header
        style={{
          backgroundColor: "#111827",
          color: "#ffffff",
          padding: "12px 20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Ecommerce Admin</h1>
          <span style={{ fontSize: "0.9rem", color: "#e5e7eb" }}>
            Manage products (create, edit, delete) with images
          </span>
        </div>
      </header>

      <main
        style={{
          maxWidth: "960px",
          margin: "20px auto",
          padding: "0 16px 24px",
        }}
      >
        <ProductForm onCreated={refresh} />
        <ProductList reloadKey={reloadKey} onChange={refresh} />
      </main>
    </div>
  );
};

export default App;
