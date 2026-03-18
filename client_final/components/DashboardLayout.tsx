"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import FloatingHelpdesk from "@/components/FloatingHelpdesk";
import { API_BASE_URL } from "@/lib/constants";
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Users,
  Upload,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BookOpen,
  BarChart3,
  Building2,
  ChevronDown,
} from "lucide-react";

const studentNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/results", icon: GraduationCap, label: "Results & CGPA" },
  { href: "/dashboard/documents", icon: FileText, label: "Documents" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
];

const adminNav = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "User Management" },
  { href: "/admin/documents", icon: Upload, label: "Documents" },
  { href: "/admin/results", icon: BarChart3, label: "Upload Results" },
  { href: "/admin/departments", icon: Building2, label: "Departments" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SYSTEM";
  const nav = isAdmin ? adminNav : studentNav;
  const currentNav = nav.find(
    (n) =>
      pathname === n.href ||
      (n.href !== "/dashboard" &&
        n.href !== "/admin" &&
        pathname.startsWith(n.href))
  );

  async function handleLogout() {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      // ignore — clear state regardless
    }
    setUser(null);
    router.push("/login");
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">UniERP</div>
            <div className="text-[10px] text-slate-400 font-medium">
              Intelligent Platform
            </div>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <Avatar name={user?.fullName || "U"} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">
              {user?.fullName || "—"}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {user?.role === "STUDENT"
                ? `Roll: ${user.rollNumber}`
                : user?.department || "—"}
            </div>
          </div>
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase",
              isAdmin
                ? "bg-amber-100 text-amber-700"
                : "bg-indigo-100 text-indigo-700"
            )}
          >
            {isAdmin ? "admin" : "student"}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon size={17} />
                {item.label}
                {active && (
                  <ChevronRight size={14} className="ml-auto opacity-70" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-100 space-y-0.5">
        <Link
          href={isAdmin ? "/admin/settings" : "/dashboard/settings"}
          onClick={() => setSidebarOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full",
            pathname.includes("/settings")
              ? "bg-indigo-600 text-white"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          )}
        >
          <Settings size={17} />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex flex-col w-72 bg-white shadow-2xl">
            <button
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} className="text-slate-600" />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                {currentNav?.label || "Dashboard"}
              </h1>
              <p className="text-xs text-slate-400">
                {user?.department}
                {user?.semester ? ` · Semester ${user.semester}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={isAdmin ? "/admin" : "/dashboard/notifications"}
              className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <Bell size={18} />
            </Link>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
              >
                <Avatar name={user?.fullName || "U"} size="sm" />
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="text-sm font-medium text-slate-800">
                      {user?.fullName}
                    </div>
                    <div className="text-xs text-slate-400">{user?.email}</div>
                  </div>
                  <Link
                    href={isAdmin ? "/admin/settings" : "/dashboard/settings"}
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings size={14} />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>

      {user?.role === "STUDENT" && <FloatingHelpdesk />}
    </div>
  );
}
