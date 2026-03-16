"use client";

import { API_BASE_URL } from "./constants";
import type {
  ResultsResponse,
  DocumentItem,
  UploadResultResponse,
  Company,
} from "@/types";

async function apiFetch(
  path: string,
  options?: RequestInit
): Promise<Response | undefined> {
  const headers: HeadersInit = {
    ...options?.headers,
  };

  // Only set Content-Type to JSON if not FormData
  const isFormData = options?.body instanceof FormData;
  if (!isFormData) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (res.status === 403) {
    // Try to refresh token
    await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      credentials: "include",
    });
    // Retry once
    const retryRes = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers,
    });
    if (retryRes.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return undefined;
    }
    return retryRes;
  }

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return undefined;
  }

  return res;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path, { method: "GET" });
  if (!res) throw new Error("Unauthorized");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Request failed: ${res.status}`);
  }
  const json = await res.json();
  // Unwrap common { data: ... } or { success, data: ... } patterns
  return (json?.data ?? json) as T;
}

async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res) throw new Error("Unauthorized");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Request failed: ${res.status}`);
  }
  const json = await res.json();
  return (json?.data ?? json) as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function decodeJWT(token: string): {
  id: string;
  email: string;
  role: string;
} {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return { id: "", email: "", role: "STUDENT" };
  }
}

export async function loginAPI(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Login failed");
  return json as { accessToken: string; refreshToken: string };
}

export async function logoutAPI() {
  await apiFetch("/auth/logout", { method: "POST" });
}

export async function forgotPasswordAPI(email: string) {
  await apiPost("/auth/forgot-password", { email });
}

export async function resetPasswordAPI(
  email: string,
  otp: string,
  newPassword: string
) {
  await apiPost("/auth/reset-password", { email, otp, newPassword });
}

// ─── Student ─────────────────────────────────────────────────────────────────

export async function getStudentDashboard() {
  return apiGet<{
    student: {
      fullName: string;
      avatarUrl: string | null;
      rollNumber: number;
      semester: number;
      branch: string;
      department: string;
      cgpa: number;
    };
    stats: {
      cgpa: number;
      semester: number;
      activeSubjects: number;
      eligibleCompanies: number;
      backlogs: number;
    };
    latestSemesterSummary: {
      semester: number | null;
      sgpa: number | null;
      subjects: {
        subjectName: string;
        subjectCode: string;
        credits: number;
        marks: number;
        grade: string;
        status: "PASS" | "FAILED";
      }[];
    };
  }>("/student/dashboard");
}

export async function getStudentProfile() {
  return apiGet<{
    fullName: string;
    email: string;
    avatarUrl: string | null;
    gender: string;
    departmentId: string;
    department: { name: string };
    student: {
      id: string;
      rollNumber: number;
      branch: string;
      semester: number;
      admissionYear: number;
      isHostelite: boolean;
      cgpa: number;
    };
  }>("/student/profile");
}

export async function getStudentResults(): Promise<ResultsResponse> {
  return apiGet<ResultsResponse>("/student/results");
}

export async function getStudentDocuments(params?: {
  category?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.category && params.category !== "All") {
    query.set("category", params.category);
  }
  if (params?.search) {
    query.set("search", params.search);
  }
  const qs = query.toString();
  return apiGet<{ documents: DocumentItem[]; total: number }>(
    `/student/documents${qs ? `?${qs}` : ""}`
  );
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAdminProfile() {
  return apiGet<{
    fullName: string;
    email: string;
    avatarUrl: string | null;
    gender: string;
    departmentId: string;
    admin: { branch: string; designation: string };
  }>("/admin/profile");
}

export async function getSubjects(page = 1, limit = 10) {
  return apiGet<{ subjects: unknown[]; total: number; totalPages: number }>(
    `/subject/?page=${page}&limit=${limit}`
  );
}

export async function getCompanies(page = 1, limit = 10) {
  return apiGet<{ companies: Company[]; total: number; totalPages: number }>(
    `/company/?page=${page}&limit=${limit}`
  );
}

export async function uploadResults(file: File): Promise<UploadResultResponse> {
  const formData = new FormData();
  formData.append("results-file", file);
  const res = await apiFetch("/result/upload", {
    method: "POST",
    body: formData,
  });
  if (!res) throw new Error("Unauthorized");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Upload failed");
  }
  const json = await res.json();
  return (json?.data ?? json) as UploadResultResponse;
}

export async function uploadDocument(formData: FormData): Promise<void> {
  const res = await apiFetch("/document/", {
    method: "POST",
    body: formData,
  });
  if (!res) throw new Error("Unauthorized");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Upload failed");
  }
}

export async function deleteDocument(documentId: string): Promise<void> {
  const res = await apiFetch(`/document/${documentId}`, {
    method: "DELETE",
  });
  if (!res) throw new Error("Unauthorized");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Delete failed");
  }
}

export { apiFetch };
