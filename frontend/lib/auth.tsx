"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "./api";
import { User } from "./types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "USER" | "ORGANIZER",
    organizationName?: string,
    bio?: string
  ) => Promise<User>;
  applyForOrganizer: (organizationName?: string, bio?: string) => Promise<User>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user || res.data.data?.user || res.data.data);
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
    const userData = res.data.user || res.data.data?.user || res.data.data;
    setUser(userData);
    return userData as User;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "USER" | "ORGANIZER",
    organizationName?: string,
    bio?: string
  ) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
      organizationName,
      bio,
    });
    const userData = res.data.user || res.data.data?.user || res.data.data;
    setUser(userData);
    return userData as User;
  };

  const applyForOrganizer = async (organizationName?: string, bio?: string) => {
    const res = await api.post("/organizers/apply", {
      organizationName,
      bio,
    });
    const updated = res.data.data?.organizer || res.data.data || res.data.user;
    if (updated) {
      setUser((prev) => (prev ? { ...prev, ...updated } : updated));
    }
    await fetchMe();
    return updated as User;
  };

  const refreshUser = async () => {
    await fetchMe();
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
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        applyForOrganizer,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
