// src/pages/Login.tsx
import React, { useState } from "react";
import { loginUser } from "../api/auth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("admin@example.com"); // default for testing
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser(email, password);
      alert("Login successful");
      window.location.href = "/"; // go to admin dashboard
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          width: "320px",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "16px", textAlign: "center" }}>
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: "0.9rem" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              margin: "4px 0 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
            }}
          />

          <label style={{ fontSize: "0.9rem" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              margin: "4px 0 16px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
            }}
          />

          {error && (
            <div style={{ color: "red", marginBottom: "8px" }}>{error}</div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#111827",
              color: "white",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: "12px", fontSize: "0.85rem", textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <a href="/register" style={{ color: "#2563eb" }}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
