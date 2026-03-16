"use client";
import React, { useState, Suspense } from "react";
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

// ── Demo credentials ────────────────────────────────────────────────────────

const DEMO_CREDENTIALS = [
  {
    role: "Student" as const,
    email: "arjun.sharma@nist.edu",
    password: "student123",
    name: "Arjun Sharma",
  },
  {
    role: "Admin" as const,
    email: "priya.nair@nist.edu",
    password: "admin123",
    name: "Dr. Priya Nair",
  },
  {
    role: "System" as const,
    email: "system@nist.edu",
    password: "system@2026",
    name: "System Operator",
  },
] as const;

// ── Login form ──────────────────────────────────────────────────────────────

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [role, setRole] = useState<"student" | "admin">(
    params.get("role") === "admin" ? "admin" : "student"
  );
  // System user toggle — shown as a checkbox, not a tab
  const [isSystemUser, setIsSystemUser] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password flow
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // ── Auth ──────────────────────────────────────────────────────────────────

  function handleSystemToggle(checked: boolean) {
    setIsSystemUser(checked);
    setError("");
    setEmail("");
    setPassword("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    // System user check
    if (isSystemUser) {
      if (
        email === DEMO_CREDENTIALS[2].email &&
        password === DEMO_CREDENTIALS[2].password
      ) {
        router.push("/system");
        return;
      }
      setError("Invalid system credentials.");
      setLoading(false);
      return;
    }

    // Student check
    if (
      email === DEMO_CREDENTIALS[0].email &&
      password === DEMO_CREDENTIALS[0].password
    ) {
      router.push("/dashboard");
      return;
    }
    // Admin check
    if (
      email === DEMO_CREDENTIALS[1].email &&
      password === DEMO_CREDENTIALS[1].password
    ) {
      router.push("/admin");
      return;
    }

    // TODO: Replace with real API call when backend is connected
    setError("Invalid email or password. Please try again.");
    setLoading(false);
  }

  function fillCredentials(cred: (typeof DEMO_CREDENTIALS)[number]) {
    if (cred.role === "System") {
      setIsSystemUser(true);
    } else {
      setIsSystemUser(false);
      setRole(cred.role.toLowerCase() as "student" | "admin");
    }
    setEmail(cred.email);
    setPassword(cred.password);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setForgotLoading(false);
    setOtpSent(true);
    // TODO: call POST /auth/forgot-password
  }

  function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    // TODO: call POST /auth/reset-password with otp + newPassword
    setForgotMode(false);
    setOtpSent(false);
    setOtp("");
    setNewPassword("");
    setForgotEmail("");
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">UniERP</span>
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
                ? "Restricted access — system operators only"
                : "Sign in to your university portal"}
          </p>
        </div>

        {/* Main card */}
        <div
          className={cn(
            "bg-white border rounded-2xl shadow-sm overflow-visible transition-all",
            isSystemUser
              ? "border-purple-200 shadow-purple-50"
              : "border-slate-200"
          )}
        >
          {/* Role Tabs — hidden when system user or forgot mode */}
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
                  className={`flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${
                    role === r
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
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

          {/* System user banner */}
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
            /* ── Forgot Password ── */
            <div className="p-6 space-y-4">
              <button
                onClick={() => {
                  setForgotMode(false);
                  setOtpSent(false);
                  setOtp("");
                  setNewPassword("");
                }}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors mb-2"
              >
                <ArrowLeft size={13} /> Back to login
              </button>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Reset password
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your university email to receive an OTP
                </p>
              </div>

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
                        <Loader2 size={15} className="animate-spin" /> Sending
                        OTP...
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
                      placeholder="New password (min 8 chars)"
                      className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock size={14} /> Reset Password
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* ── Login Form ── */
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" /> {error}
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

              {/* ── System User Checkbox ── */}
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
                    "w-4.5 h-4.5 mt-0.5 rounded flex items-center justify-center border-2 shrink-0 transition-all",
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
                    For system administrators only. Grants full platform access.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-3 px-4 text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                  isSystemUser
                    ? "bg-purple-600 hover:bg-purple-700 hover:shadow-purple-200"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Signing in...
                  </>
                ) : isSystemUser ? (
                  <>
                    <Terminal size={15} /> System Login
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Below card */}
        <p className="text-center text-xs text-slate-400 mt-5">
          Accounts are created by university admin only.{" "}
          <Link href="/" className="text-indigo-600 hover:underline">
            Back to home
          </Link>
        </p>

        {/* ── Demo Credentials ── */}
        {!forgotMode && (
          <div className="mt-4 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <FlaskConical size={14} className="text-amber-500" />
                <span className="text-xs font-semibold text-slate-700">
                  Demo Credentials
                </span>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wide bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
                Testing Only
              </span>
            </div>

            {DEMO_CREDENTIALS.map((cred) => (
              <div
                key={cred.role}
                onClick={() => fillCredentials(cred)}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      cred.role === "Student"
                        ? "bg-indigo-100 text-indigo-700"
                        : cred.role === "Admin"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-purple-100 text-purple-700"
                    )}
                  >
                    {cred.role}
                  </span>
                  <div>
                    <p className="text-xs text-slate-600 font-mono">
                      {cred.email}
                    </p>
                    <p className="text-xs text-slate-300 font-mono group-hover:text-slate-400 transition-colors">
                      {cred.password}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-indigo-400 font-medium group-hover:text-indigo-700 transition-colors">
                  Use →
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page wrapper ────────────────────────────────────────────────────────────

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
