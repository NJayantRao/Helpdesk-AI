"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { AuthUser } from "@/types";

// Dead-simple context — just a shared user state.
// No API calls, no bootstrap, no effects.
// Each page is responsible for its own data fetching with axios directly.

interface AuthContextValue {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
