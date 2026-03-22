"use client";
import React, { useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Building,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  FlaskConical,
  Lock,
  Shield,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { API_BASE_URL } from "@/lib/constants";

const DEMO_CREDENTIALS = [
  {
    role: "Student" as const,
    email: "arjun.sharma@nist.edu",
    password: "student123",
  },
  {
    role: "Admin" as const,
    email: "priya.nair@nist.edu",
    password: "admin123",
  },
  {
    role: "System" as const,
    email: "system@nist.edu",
    password: "system@2026",
  },
] as const;

function decodeJWT(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return { role: "STUDENT" };
  }
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useAuth();

  const [role, setRole] = useState<"student" | "admin">(
    params.get("role") === "admin" ? "admin" : "student"
  );
  const [isSystemUser, setIsSU] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  function handleSystemToggle(val: boolean) {
    setIsSU(val);
    setError("");
    setEmail("");
    setPassword("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      // Step 1 — login via real API (works for STUDENT, ADMIN, and SYSTEM)
      const loginRes = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const accessToken =
        loginRes.data?.data?.accessToken ?? loginRes.data?.accessToken;
      const decoded = decodeJWT(accessToken);
      const userRole = (decoded?.role || "STUDENT").toUpperCase();

      // Step 2 — fetch profile based on role
      if (userRole === "STUDENT") {
        const profileRes = await axios.get(`${API_BASE_URL}/student/profile`, {
          withCredentials: true,
        });
        const p = profileRes.data?.data ?? profileRes.data;
        setUser({
          id: p.student?.id ?? p.id ?? "",
          fullName: p.fullName ?? "",
          email: p.email ?? "",
          role: "STUDENT",
          avatarUrl: p.avatarUrl ?? null,
          rollNumber: p.student?.rollNumber,
          semester: p.student?.semester,
          branch: p.student?.branch,
          department: p.department?.name ?? "",
          cgpa: p.student?.cgpa,
          admissionYear: p.student?.admissionYear,
        });
        router.push("/dashboard");
      } else {
        // ADMIN or SYSTEM — both use the admin profile endpoint
        const profileRes = await axios.get(`${API_BASE_URL}/admin/profile`, {
          withCredentials: true,
        });
        const p = profileRes.data?.data ?? profileRes.data;
        setUser({
          id: p.id ?? "",
          fullName: p.fullName ?? "",
          email: p.email ?? "",
          role: userRole as "ADMIN" | "SYSTEM",
          avatarUrl: p.avatarUrl ?? null,
          department: p.admin?.branch ?? p.department?.name ?? "",
          designation: p.admin?.designation ?? "",
        });
        // SYSTEM goes to /system, ADMIN goes to /admin
        router.push(userRole === "SYSTEM" ? "/system" : "/admin");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Login failed. Check your credentials."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  }

  function fillCredentials(cred: (typeof DEMO_CREDENTIALS)[number]) {
    if (cred.role === "System") {
      setIsSU(true);
    } else {
      setIsSU(false);
      setRole(cred.role.toLowerCase() as "student" | "admin");
    }
    setEmail(cred.email);
    setPassword(cred.password);
    setError("");
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    setError("");
    try {
      await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        { email: forgotEmail },
        { withCredentials: true }
      );
      setOtpSent(true);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to send OTP."
          : "Failed to send OTP."
      );
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    setError("");
    try {
      await axios.post(
        `${API_BASE_URL}/auth/reset-password`,
        { email: forgotEmail, otp, newPassword },
        { withCredentials: true }
      );
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotMode(false);
        setOtpSent(false);
        setOtp("");
        setNewPassword("");
        setForgotEmail("");
        setForgotSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Reset failed."
          : "Reset failed."
      );
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">NIS</span>
          </Link>
          <h1
            className="text-2xl font-bold text-slate-900 mb-1.5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {forgotMode
              ? "Reset Password"
              : isSystemUser
                ? "System Access"
                : "Welcome back"}
          </h1>
          <p className="text-sm text-slate-500">
            {forgotMode
              ? "Enter your email to receive a reset OTP"
              : isSystemUser
                ? "Restricted — system operators only"
                : "Sign in to your university portal"}
          </p>
        </div>

        <div
          className={cn(
            "bg-white border rounded-2xl shadow-sm overflow-visible",
            isSystemUser ? "border-purple-200" : "border-slate-200"
          )}
        >
          {!forgotMode && !isSystemUser && (
            <div className="grid grid-cols-2 border-b border-slate-200">
              {(["student", "admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setError("");
                    setEmail("");
                    setPassword("");
                  }}
                  className={`flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${role === r ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {r === "student" ? (
                    <GraduationCap size={15} />
                  ) : (
                    <Building size={15} />
                  )}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          )}

          {isSystemUser && !forgotMode && (
            <div className="flex items-center gap-3 px-5 py-3.5 bg-purple-50 border-b border-purple-100">
              <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Terminal size={14} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-purple-800">
                  System Operator Mode
                </p>
                <p className="text-[11px] text-purple-500">
                  Full platform access · Use with caution
                </p>
              </div>
            </div>
          )}

          {forgotMode ? (
            <div className="p-6 space-y-4">
              <button
                onClick={() => {
                  setForgotMode(false);
                  setOtpSent(false);
                  setOtp("");
                  setNewPassword("");
                  setError("");
                }}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft size={13} />
                Back to login
              </button>
              {error && (
                <div className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {forgotSuccess && (
                <div className="flex items-center gap-2 px-3.5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700">
                  <CheckCircle size={13} />
                  Password reset successfully!
                </div>
              )}
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      University Email
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your university email"
                      className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <CheckCircle
                      size={16}
                      className="text-emerald-600 shrink-0"
                    />
                    <p className="text-xs text-emerald-700">
                      OTP sent to{" "}
                      <span className="font-semibold">{forgotEmail}</span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      pattern="[0-9]*"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit OTP"
                      className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm tracking-widest bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Lock size={14} />
                    )}
                    {forgotLoading ? "Resetting…" : "Reset Password"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {isSystemUser ? "System Email" : "University Email"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    isSystemUser
                      ? "e.g. system@nist.edu"
                      : role === "student"
                        ? "e.g. student@nist.edu"
                        : "e.g. admin@nist.edu"
                  }
                  className={cn(
                    "w-full py-2.5 px-3.5 border rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all",
                    isSystemUser
                      ? "border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  )}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  {!isSystemUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotMode(true);
                        setError("");
                      }}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={cn(
                      "w-full py-2.5 pl-3.5 pr-10 border rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all",
                      isSystemUser
                        ? "border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                  isSystemUser
                    ? "bg-purple-50 border-purple-200"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                )}
                onClick={() => handleSystemToggle(!isSystemUser)}
              >
                <div
                  className={cn(
                    "mt-0.5 rounded flex items-center justify-center border-2 shrink-0 transition-all",
                    isSystemUser
                      ? "bg-purple-600 border-purple-600"
                      : "bg-white border-slate-300"
                  )}
                  style={{ width: 18, height: 18 }}
                >
                  {isSystemUser && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Shield
                      size={12}
                      className={
                        isSystemUser ? "text-purple-600" : "text-slate-400"
                      }
                    />
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isSystemUser ? "text-purple-800" : "text-slate-600"
                      )}
                    >
                      Login as System User
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wide bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">
                      Restricted
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    For system administrators only.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-3 px-4 text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                  isSystemUser
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Signing in…
                  </>
                ) : isSystemUser ? (
                  <>
                    <Terminal size={15} />
                    System Login
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Accounts are created by university admin only.{" "}
          <Link href="/" className="text-indigo-600 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={24} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
