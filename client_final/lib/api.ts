"use client";

import { API_BASE_URL } from "./constants";
import type {
  ResultsResponse,
  DocumentItem,
  UploadResultResponse,
  Company,
} from "@/types";

// ─── Core fetch wrapper ────────────────────────────────────────────────────

async function apiFetch(
  path: string,
  options?: RequestInit
): Promise<Response | undefined> {
  const isFormData = options?.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };
  if (!isFormData) headers["Content-Type"] = "application/json";

  const doFetch = () =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers,
    });

  let res = await doFetch();

  // On 401/403 attempt one token refresh then retry
  if (res.status === 401 || res.status === 403) {
    try {
      await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        credentials: "include",
      });
    } catch {
      // refresh failed — fall through to redirect
    }
    res = await doFetch();
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== "undefined") window.location.href = "/login";
      return undefined;
    }
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

async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "PUT",
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

async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "PATCH",
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

async function apiDelete(path: string): Promise<void> {
  const res = await apiFetch(path, { method: "DELETE" });
  if (!res) throw new Error("Unauthorized");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Request failed: ${res.status}`);
  }
}

// ─── JWT ────────────────────────────────────────────────────────────────────

export function decodeJWT(token: string): {
  id: string;
  email: string;
  role: string;
} {
  try {
    const payload = token.split(".")[1];
    if (!payload) return { id: "", email: "", role: "STUDENT" };
    return JSON.parse(atob(payload));
  } catch {
    return { id: "", email: "", role: "STUDENT" };
  }
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginAPI(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Login failed");
  // Server returns { statusCode, message, data: { accessToken, refreshToken } }
  const payload = json?.data ?? json;
  if (!payload?.accessToken) throw new Error("No access token returned");
  return payload as { accessToken: string; refreshToken: string };
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

// ─── Student Profile ──────────────────────────────────────────────────────────

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

// ─── Student Dashboard ────────────────────────────────────────────────────────
// Exact server shape from getStudentDashboard controller

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

// ─── Student Results ───────────────────────────────────────────────────────────

export async function getStudentResults(): Promise<ResultsResponse> {
  return apiGet<ResultsResponse>("/student/results");
}

// ─── Student Documents ────────────────────────────────────────────────────────
// Route: GET /student/documents?category=&search=

export async function getStudentDocuments(params?: {
  category?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.category && params.category !== "All")
    query.set("category", params.category);
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  return apiGet<{ documents: DocumentItem[]; total: number }>(
    `/student/documents${qs ? `?${qs}` : ""}`
  );
}

// ─── Notifications ─────────────────────────────────────────────────────────────
// Server returns: { notifications: [...], unreadCount: number }
// Each notification: { id, title, body, source, type, createdAt, read, readAt }

export async function getStudentNotifications() {
  return apiGet<{
    notifications: {
      id: string;
      title: string;
      body: string; // NOTE: server uses "body" not "message"
      source: string;
      type: string;
      createdAt: string;
      read: boolean;
      readAt: string | null;
    }[];
    unreadCount: number;
  }>("/student/notifications");
}

// Route: PATCH /student/notifications/unread-count
export async function getUnreadNotificationCount() {
  return apiGet<{ unreadCount: number }>("/student/notifications/unread-count");
}

// Route: PATCH /student/notifications/:notificationId/read
export async function markNotificationRead(notificationId: string) {
  await apiPatch(`/student/notifications/${notificationId}/read`);
}

// Route: PATCH /student/notifications/mark-all-read
export async function markAllNotificationsRead() {
  await apiPatch("/student/notifications/mark-all-read");
}

// ─── Change Password ───────────────────────────────────────────────────────────
// Route: PUT /student/change-password  body: { oldPassword, newPassword }

export async function changeStudentPassword(
  oldPassword: string,
  newPassword: string
) {
  await apiPut("/student/change-password", { oldPassword, newPassword });
}

// ─── Admin ─────────────────────────────────────────────────────────────────────

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

// Route: PUT /admin/change-password  body: { oldPassword, newPassword }
export async function changeAdminPassword(
  oldPassword: string,
  newPassword: string
) {
  await apiPut("/admin/change-password", { oldPassword, newPassword });
}

// ─── Documents (admin) ─────────────────────────────────────────────────────────
// multer field: "document"  — POST /document/
// body fields: title, category, departmentId  (NOT department name — ID!)

export async function uploadDocument(formData: FormData): Promise<void> {
  const res = await apiFetch("/document/", { method: "POST", body: formData });
  if (!res) throw new Error("Unauthorized");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Upload failed");
  }
}

// Route: DELETE /document/:documentId
export async function deleteDocument(documentId: string): Promise<void> {
  await apiDelete(`/document/${documentId}`);
}

// ─── Results (admin) ───────────────────────────────────────────────────────────
// multer field: "results-file"  — POST /result/upload

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

// ─── Subjects ──────────────────────────────────────────────────────────────────

export async function getSubjects(page = 1, limit = 10) {
  return apiGet<{ subjects: unknown[]; total: number; totalPages: number }>(
    `/subject/?page=${page}&limit=${limit}`
  );
}

// ─── Companies ─────────────────────────────────────────────────────────────────

export async function getCompanies(page = 1, limit = 10) {
  return apiGet<{ companies: Company[]; total: number; totalPages: number }>(
    `/company/?page=${page}&limit=${limit}`
  );
}

// ─── Notifications (admin) ─────────────────────────────────────────────────────

export async function createNotification(data: {
  title: string;
  body: string;
  source: string;
  type: string;
  departmentId?: string;
}) {
  return apiPost("/notification/", data);
}

export async function getAllNotificationsAdmin() {
  return apiGet("/notification/");
}

export async function deleteNotification(notificationId: string) {
  await apiDelete(`/notification/${notificationId}`);
}

export { apiFetch };
