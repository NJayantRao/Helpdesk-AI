"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DEPARTMENTS, API_BASE_URL } from "@/lib/constants";
import { SystemDashboardSkeleton } from "@/components/Skeleton";
import {
  Users,
  Building2,
  GraduationCap,
  Shield,
  Terminal,
  Plus,
  Settings,
  LogOut,
  Activity,
  CheckCircle,
  AlertTriangle,
  Database,
  FileText,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Bell,
  Loader2,
  X,
  RefreshCw,
  Server,
} from "lucide-react";

const SYSTEM_STATS = [
  {
    label: "Total Students",
    value: "5,248",
    delta: "+124",
    color: "indigo",
    icon: GraduationCap,
  },
  {
    label: "Total Admins",
    value: "18",
    delta: "+2",
    color: "amber",
    icon: Shield,
  },
  {
    label: "Departments",
    value: "10",
    delta: "—",
    color: "emerald",
    icon: Building2,
  },
  {
    label: "Active Sessions",
    value: "342",
    delta: "Live",
    color: "sky",
    icon: Activity,
  },
];

const RECENT_REGISTRATIONS = [
  {
    name: "Priya Kumari",
    email: "priya.k@nist.edu",
    role: "STUDENT",
    time: "2 min ago",
    dept: "Computer Science",
  },
  {
    name: "Mr. Anand Verma",
    email: "anand.v@nist.edu",
    role: "ADMIN",
    time: "18 min ago",
    dept: "Electronics",
  },
  {
    name: "Sanya Mishra",
    email: "sanya.m@nist.edu",
    role: "STUDENT",
    time: "45 min ago",
    dept: "Mechanical",
  },
  {
    name: "Dr. Rekha Sharma",
    email: "rekha.s@nist.edu",
    role: "ADMIN",
    time: "1 hr ago",
    dept: "Civil",
  },
  {
    name: "Rohit Das",
    email: "rohit.d@nist.edu",
    role: "STUDENT",
    time: "2 hrs ago",
    dept: "Computer Science",
  },
];

const SYSTEM_HEALTH = [
  {
    service: "API Server",
    status: "healthy",
    uptime: "99.98%",
    latency: "12ms",
  },
  {
    service: "PostgreSQL DB",
    status: "healthy",
    uptime: "99.99%",
    latency: "3ms",
  },
  { service: "Redis Cache", status: "healthy", uptime: "100%", latency: "1ms" },
  {
    service: "Cloudinary CDN",
    status: "healthy",
    uptime: "99.95%",
    latency: "28ms",
  },
  {
    service: "Email Service",
    status: "warning",
    uptime: "97.2%",
    latency: "—",
  },
];

// ── Register Modal ──────────────────────────────────────────────────────────
interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  gender: string;
  branch: string;
  departmentId: string;
  isHostel: string;
  designation: string;
}

function RegisterModal({
  type,
  onClose,
}: {
  type: "student" | "admin";
  onClose: () => void;
}) {
  const [form, setForm] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    gender: "MALE",
    branch: "",
    departmentId: "",
    isHostel: "false",
    designation: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function update(key: keyof RegisterFormData, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint =
        type === "student"
          ? `${API_BASE_URL}/auth/student/register`
          : `${API_BASE_URL}/auth/admin/register`;

      const payload =
        type === "student"
          ? {
              fullName: form.fullName,
              email: form.email,
              password: form.password,
              gender: form.gender,
              branch: form.branch,
              departmentId: form.departmentId,
              isHostel: form.isHostel === "true",
            }
          : {
              fullName: form.fullName,
              email: form.email,
              password: form.password,
              gender: form.gender,
              branch: form.branch,
              departmentId: form.departmentId,
              designation: form.designation,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Registration failed");
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center",
                type === "student" ? "bg-indigo-50" : "bg-amber-50"
              )}
            >
              {type === "student" ? (
                <GraduationCap size={16} className="text-indigo-600" />
              ) : (
                <Shield size={16} className="text-amber-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Register {type === "student" ? "Student" : "Admin"}
              </p>
              <p className="text-xs text-slate-400">
                System operator access required
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={26} className="text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {type === "student" ? "Student" : "Admin"} registered
              successfully!
            </p>
            <p className="text-xs text-slate-400 mt-1">Closing...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="px-3.5 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                {error}
              </div>
            )}
            {[
              {
                key: "fullName" as const,
                label: "Full Name",
                type: "text",
                placeholder: "e.g. Arjun Sharma",
              },
              {
                key: "email" as const,
                label: "University Email",
                type: "email",
                placeholder: "e.g. arjun@nist.edu",
              },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {f.label}
                </label>
                <input
                  required
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min 8 characters"
                  className={cn(inputClass, "pr-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
                className={inputClass}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHERS">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Department ID
              </label>
              <input
                required
                value={form.departmentId}
                onChange={(e) => update("departmentId", e.target.value)}
                placeholder="Paste department UUID from server"
                className={inputClass}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Get UUIDs from GET /department/ endpoint
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Branch
              </label>
              <input
                required
                value={form.branch}
                onChange={(e) => update("branch", e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className={inputClass}
              />
            </div>
            {type === "student" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Hostelite
                </label>
                <select
                  value={form.isHostel}
                  onChange={(e) => update("isHostel", e.target.value)}
                  className={inputClass}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            )}
            {type === "admin" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Designation
                </label>
                <input
                  required
                  value={form.designation}
                  onChange={(e) => update("designation", e.target.value)}
                  placeholder="e.g. HOD / Professor"
                  className={inputClass}
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Plus size={15} />
                  Register {type === "student" ? "Student" : "Admin"}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── System Dashboard ────────────────────────────────────────────────────────
export default function SystemDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"student" | "admin" | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  }

  function handleSignOut() {
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => router.push("/login"));
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
          <div className="px-5 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Terminal size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  UniERP System
                </div>
                <div className="text-[10px] text-slate-400">
                  Operator Console
                </div>
              </div>
            </div>
          </div>
        </aside>
        <div className="flex-1 overflow-y-auto p-5">
          <SystemDashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <>
      {modal && <RegisterModal type={modal} onClose={() => setModal(null)} />}
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
          <div className="px-5 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Terminal size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  UniERP System
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Operator Console
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
              <div className="w-9 h-9 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 text-sm font-bold shrink-0">
                SO
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">
                  System Operator
                </div>
                <div className="text-xs text-slate-400 truncate">
                  system@nist.edu
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-purple-100 text-purple-700">
                SYSTEM
              </span>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {[
              { icon: Activity, label: "Overview", active: true },
              { icon: Users, label: "Register Users", active: false },
              { icon: Building2, label: "Departments", active: false },
              { icon: Database, label: "System Health", active: false },
              { icon: FileText, label: "Audit Logs", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all",
                  item.active
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon size={17} />
                {item.label}
                {item.active && (
                  <ChevronRight size={14} className="ml-auto opacity-70" />
                )}
              </button>
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-slate-100 space-y-0.5">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 w-full transition-all">
              <Settings size={17} />
              Settings
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full"
            >
              <LogOut size={17} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                System Overview
              </h1>
              <p className="text-xs text-slate-400">NIST · Operator Console</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-all"
                title="Refresh"
              >
                <RefreshCw
                  size={16}
                  className={cn(refreshing && "animate-spin")}
                />
              </button>
              <div className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-xs font-bold">
                SO
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-5 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
              <AlertTriangle size={15} className="shrink-0" />
              <span>
                You are logged in as a <strong>System Operator</strong>. All
                actions are logged and audited.
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-xl font-bold text-slate-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  System Dashboard
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Platform-wide management and monitoring
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal("student")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-all"
                >
                  <Plus size={13} />
                  Register Student
                </button>
                <button
                  onClick={() => setModal("admin")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-600 transition-all"
                >
                  <Plus size={13} />
                  Register Admin
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {SYSTEM_STATS.map((s) => (
                <div
                  key={s.label}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-purple-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        s.color === "indigo"
                          ? "bg-indigo-50 text-indigo-600"
                          : s.color === "amber"
                            ? "bg-amber-50 text-amber-600"
                            : s.color === "emerald"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-sky-50 text-sky-600"
                      )}
                    >
                      <s.icon size={18} />
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {s.delta}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-0.5">
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              {/* Recent Registrations */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Recent Registrations
                  </h3>
                  <span className="text-xs text-slate-400">Last 24 hours</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {RECENT_REGISTRATIONS.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                          r.role === "STUDENT"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-amber-100 text-amber-700"
                        )}
                      >
                        {r.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate">
                          {r.name}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {r.email} · {r.dept}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                            r.role === "STUDENT"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-amber-100 text-amber-700"
                          )}
                        >
                          {r.role}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {r.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    System Health
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    4/5 Healthy
                  </div>
                </div>
                <div className="divide-y divide-slate-50">
                  {SYSTEM_HEALTH.map((s) => (
                    <div
                      key={s.service}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          s.status === "healthy"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800">
                          {s.service}
                        </div>
                        <div className="text-xs text-slate-400">
                          Uptime: {s.uptime}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={cn(
                            "text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full",
                            s.status === "healthy"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          )}
                        >
                          {s.status}
                        </span>
                        {s.latency !== "—" && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {s.latency}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Departments */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  Registered Departments
                </h3>
                <span className="text-xs text-indigo-600 font-medium">
                  {DEPARTMENTS.length} total
                </span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENTS.map((dept, i) => {
                    const colors = [
                      "bg-indigo-50 text-indigo-700 border-indigo-100",
                      "bg-emerald-50 text-emerald-700 border-emerald-100",
                      "bg-amber-50 text-amber-700 border-amber-100",
                      "bg-sky-50 text-sky-700 border-sky-100",
                      "bg-rose-50 text-rose-700 border-rose-100",
                    ];
                    return (
                      <span
                        key={dept}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-medium border",
                          colors[i % colors.length]
                        )}
                      >
                        {dept}
                      </span>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
                  <Lock size={11} />
                  Department creation requires system operator access.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    label: "Register Student",
                    icon: GraduationCap,
                    color: "indigo",
                    action: () => setModal("student"),
                  },
                  {
                    label: "Register Admin",
                    icon: Shield,
                    color: "amber",
                    action: () => setModal("admin"),
                  },
                  {
                    label: "View Audit Log",
                    icon: FileText,
                    color: "slate",
                    action: () => {},
                  },
                  {
                    label: "System Settings",
                    icon: Settings,
                    color: "purple",
                    action: () => {},
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-slate-200 hover:border-purple-200 hover:bg-purple-50/30 transition-all group"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        item.color === "indigo"
                          ? "bg-indigo-50 text-indigo-600"
                          : item.color === "amber"
                            ? "bg-amber-50 text-amber-600"
                            : item.color === "purple"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-slate-100 text-slate-600"
                      )}
                    >
                      <item.icon size={18} />
                    </div>
                    <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 text-center leading-tight">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
