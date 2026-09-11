"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "./api";
import { User } from "./types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role: "USER" | "ORGANIZER") => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data?.user || res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.data.user);
    return res.data.data.user as User;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "USER" | "ORGANIZER"
  ) => {
    const res = await api.post("/auth/register", { name, email, password, role });
    setUser(res.data.data.user);
    return res.data.data.user as User;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
