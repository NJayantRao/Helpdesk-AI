"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import type { AuthUser } from "@/types";
import { API_BASE_URL } from "@/lib/constants";

interface AuthContextValue {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Try student profile first
        const res = await axios.get(`${API_BASE_URL}/student/profile`, {
          withCredentials: true,
        });
        const d = res.data?.data ?? res.data;
        setUser({
          id: d.student?.id ?? d.id ?? "",
          fullName: d.fullName ?? "",
          email: d.email ?? "",
          role: "STUDENT",
          avatarUrl: d.avatarUrl ?? null,
          rollNumber: d.student?.rollNumber,
          semester: d.student?.semester,
          branch: d.student?.branch,
          department: d.department?.name ?? d.department ?? "",
          cgpa: d.student?.cgpa,
          admissionYear: d.student?.admissionYear,
        });
      } catch {
        // Not a student — try admin/system profile
        try {
          const res = await axios.get(`${API_BASE_URL}/admin/profile`, {
            withCredentials: true,
          });
          const d = res.data?.data ?? res.data;

          // Decode role from accessToken cookie (set by server on login)
          let role: "ADMIN" | "SYSTEM" = "ADMIN";
          try {
            const cookies = document.cookie.split(";");
            const tokenCookie = cookies.find((c) =>
              c.trim().startsWith("accessToken=")
            );
            if (tokenCookie) {
              const token = tokenCookie.split("=")[1]?.trim();
              if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const rawRole = (payload?.role ?? "ADMIN")
                  .toString()
                  .toUpperCase();
                role = rawRole === "SYSTEM" ? "SYSTEM" : "ADMIN";
              }
            }
          } catch {
            role = "ADMIN";
          }

          setUser({
            id: d.id ?? "",
            fullName: d.fullName ?? "",
            email: d.email ?? "",
            role,
            avatarUrl: d.avatarUrl ?? null,
            department:
              d.admin?.branch ?? d.department?.name ?? d.department ?? "",
            designation: d.admin?.designation ?? "",
          });
        } catch {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
