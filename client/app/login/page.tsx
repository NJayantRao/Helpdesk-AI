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
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<"student" | "admin">(
    params.get("role") === "admin" ? "admin" : "student"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const DEMO = {
    student: { email: "arjun.sharma@nist.edu", password: "student123" },
    admin: { email: "priya.nair@nist.edu", password: "admin123" },
  };

  function fillDemo() {
    setEmail(DEMO[role].email);
    setPassword(DEMO[role].password);
    setError("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (email === DEMO[role].email && password === DEMO[role].password) {
      router.push(role === "admin" ? "/admin" : "/dashboard");
    } else {
      setError("Invalid email or password. Use the demo credentials below.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex items-center justify-center px-5">
      <div className="w-full max-w-md animate-slide-up">
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
            Welcome back
          </h1>
          <p className="text-sm text-slate-500">
            Sign in to your university portal
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Role Tabs */}
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

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                University Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`e.g. ${DEMO[role].email}`}
                className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full py-2.5 pl-3.5 pr-10 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow-indigo-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Demo credentials */}
            <div className="border border-dashed border-slate-200 rounded-xl p-3.5 bg-slate-50">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Demo Credentials ({role})
              </p>
              <p className="text-xs text-slate-500 font-mono">
                {DEMO[role].email}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                {DEMO[role].password}
              </p>
              <button
                type="button"
                onClick={fillDemo}
                className="mt-2 text-xs text-indigo-600 font-medium hover:underline"
              >
                Auto-fill credentials →
              </button>
            </div>
          </form>
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
          <Loader2 className="animate-spin text-indigo-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
