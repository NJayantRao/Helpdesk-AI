"use client";
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, Card, Badge } from "@/components/ui";
import { mockAdminUser, mockUsers, mockDocuments } from "@/lib/utils";
import { AdminDashboardSkeleton } from "@/components/Skeleton";
import {
  Users,
  FileText,
  Upload,
  Building2,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const deptData = [
  { dept: "CS", students: 312 },
  { dept: "ECE", students: 289 },
  { dept: "ME", students: 203 },
  { dept: "Civil", students: 178 },
  { dept: "Chem", students: 142 },
];

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#f97316", "#ef4444"];

const quickActions = [
  {
    href: "/admin/users",
    icon: Users,
    label: "User Management",
    sub: "View all users",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    href: "/admin/results",
    icon: Upload,
    label: "Upload Results",
    sub: "CSV / Excel upload",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    href: "/admin/documents",
    icon: FileText,
    label: "Documents",
    sub: "Manage files",
    color: "text-amber-600 bg-amber-50",
  },
  {
    href: "/admin/departments",
    icon: Building2,
    label: "Departments",
    sub: "Manage departments",
    color: "text-sky-600 bg-sky-50",
  },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <DashboardLayout user={mockAdminUser}>
        <AdminDashboardSkeleton />
      </DashboardLayout>
    );
  }

  const students = mockUsers.filter((u) => u.role === "student");
  const admins = mockUsers.filter((u) => u.role === "admin");

  return (
    <DashboardLayout user={mockAdminUser}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Admin Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            University management overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value="5,248"
            subtitle="Across all departments"
            icon={<Users size={18} />}
            color="indigo"
          />
          <StatCard
            title="Total Users"
            value={mockUsers.length}
            subtitle={`${students.length} students · ${admins.length} admins`}
            icon={<BookOpen size={18} />}
            color="emerald"
          />
          <StatCard
            title="Documents"
            value={mockDocuments.length}
            subtitle="All departments"
            icon={<FileText size={18} />}
            color="amber"
          />
          <StatCard
            title="Active Notices"
            value={12}
            subtitle="This month"
            icon={<Upload size={18} />}
            color="sky"
          />
        </div>

        {/* Chart + Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Students by Department
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={deptData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="dept"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="students" name="Students" radius={[4, 4, 0, 0]}>
                  {deptData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Quick Actions */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group"
                >
                  <div
                    className={`w-9 h-9 ${a.color} rounded-xl flex items-center justify-center`}
                  >
                    <a.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800">
                      {a.label}
                    </div>
                    <div className="text-xs text-slate-400">{a.sub}</div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 group-hover:text-slate-500 transition-colors"
                  />
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Users + Recent Documents */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Recent Users */}
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Recent Users
              </h3>
              <Link
                href="/admin/users"
                className="text-xs text-indigo-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {mockUsers.slice(0, 4).map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-xs font-bold text-indigo-700">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">
                      {u.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {u.email}
                      {u.role === "student" && u.semester
                        ? ` · Sem ${u.semester}`
                        : ""}
                    </div>
                  </div>
                  <Badge
                    label={u.role}
                    variant={u.role === "admin" ? "warning" : "primary"}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Documents */}
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Recent Documents
              </h3>
              <Link
                href="/admin/documents"
                className="text-xs text-indigo-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {mockDocuments.slice(0, 4).map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                    <FileText size={14} className="text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">
                      {d.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {d.department} · {d.fileSize}
                    </div>
                  </div>
                  <Badge
                    label={d.type.charAt(0).toUpperCase() + d.type.slice(1)}
                    variant="neutral"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
