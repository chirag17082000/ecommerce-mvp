// src/api/auth.ts

const AUTH_KEY = "auth";

const AUTH_BASE_URL = "http://localhost:8080/api/auth";

export type AuthData = {
  token: string;
  email: string;
  role: string;
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${AUTH_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data: AuthData = await res.json();
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  return data;
};

export const registerUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${AUTH_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password }),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  // backend returns plain text
  return res.text();
};

export const getAuth = (): AuthData | null => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthData;
  } catch {
    return null;
  }
};

export const getAuthToken = () => getAuth()?.token ?? null;

export const getUserRole = () => getAuth()?.role ?? null;

export const getUserEmail = () => getAuth()?.email ?? null;

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};
