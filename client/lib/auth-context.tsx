"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthUser, UserRole } from "@/types";
import {
  loginAPI,
  logoutAPI,
  getStudentProfile,
  getAdminProfile,
  decodeJWT,
} from "./api";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<"student" | "admin">;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const hydrateUser = useCallback(async (role: UserRole) => {
    try {
      if (role === "STUDENT") {
        const profile = await getStudentProfile();
        const hydrated: AuthUser = {
          id: profile.student.id,
          fullName: profile.fullName,
          email: profile.email,
          role: "STUDENT",
          avatarUrl: profile.avatarUrl,
          rollNumber: profile.student.rollNumber,
          semester: profile.student.semester,
          branch: profile.student.branch,
          department: profile.department.name,
          cgpa: profile.student.cgpa,
          admissionYear: profile.student.admissionYear,
        };
        setUser(hydrated);
      } else if (role === "ADMIN" || role === "SYSTEM") {
        const profile = await getAdminProfile();
        const hydrated: AuthUser = {
          id: "", // admin profile doesn't return id in current API shape
          fullName: profile.fullName,
          email: profile.email,
          role: role,
          avatarUrl: profile.avatarUrl,
          department: profile.admin?.branch,
          designation: profile.admin?.designation,
        };
        setUser(hydrated);
      }
    } catch {
      setUser(null);
    }
  }, []);

  // On mount: check session by attempting to load profile
  useEffect(() => {
    const bootstrapAuth = async () => {
      setLoading(true);
      try {
        // Try student profile first, fall back to admin
        try {
          const profile = await getStudentProfile();
          const hydrated: AuthUser = {
            id: profile.student.id,
            fullName: profile.fullName,
            email: profile.email,
            role: "STUDENT",
            avatarUrl: profile.avatarUrl,
            rollNumber: profile.student.rollNumber,
            semester: profile.student.semester,
            branch: profile.student.branch,
            department: profile.department.name,
            cgpa: profile.student.cgpa,
            admissionYear: profile.student.admissionYear,
          };
          setUser(hydrated);
        } catch {
          // Not a student, try admin
          const profile = await getAdminProfile();
          const hydrated: AuthUser = {
            id: "",
            fullName: profile.fullName,
            email: profile.email,
            role: "ADMIN",
            avatarUrl: profile.avatarUrl,
            department: profile.admin?.branch,
            designation: profile.admin?.designation,
          };
          setUser(hydrated);
        }
      } catch {
        // No valid session
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<"student" | "admin"> => {
      const result = await loginAPI(email, password);
      const decoded = decodeJWT(result.accessToken);
      const role = (decoded.role || "STUDENT").toUpperCase() as UserRole;

      await hydrateUser(role);

      if (role === "ADMIN" || role === "SYSTEM") {
        return "admin";
      }
      return "student";
    },
    [hydrateUser]
  );

  const logout = useCallback(async () => {
    try {
      await logoutAPI();
    } catch {
      // Ignore errors on logout
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
