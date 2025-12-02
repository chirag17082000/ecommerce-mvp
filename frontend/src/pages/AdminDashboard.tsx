// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import { getUserRole, getUserEmail, logout } from "../api/auth";

const AdminDashboard: React.FC = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const navigate = useNavigate();

  const refresh = () => {
    setReloadKey((prev) => prev + 1);
  };

  useEffect(() => {
    const role = getUserRole();
    if (role !== "ADMIN") {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const email = getUserEmail();

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
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Ecommerce Admin</h1>
            <span style={{ fontSize: "0.9rem", color: "#e5e7eb" }}>
              Manage products (create, edit, delete) with images
            </span>
          </div>

          <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
            <div>{email}</div>
            <button
              onClick={handleLogout}
              style={{
                marginTop: "4px",
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1px solid #4b5563",
                background: "transparent",
                color: "#e5e7eb",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Logout
            </button>
          </div>
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

export default AdminDashboard;
