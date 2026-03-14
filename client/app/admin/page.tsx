"use client";
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, Card, Badge, Avatar } from "@/components/ui";
import {
  mockAdminUser,
  mockDocuments,
  mockUsers,
  mockNotifications,
} from "@/lib/utils";
import {
  Users,
  FileText,
  GraduationCap,
  Bell,
  Upload,
  ChevronRight,
  TrendingUp,
  Activity,
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
  { dept: "CS", students: 180 },
  { dept: "ECE", students: 140 },
  { dept: "ME", students: 120 },
  { dept: "Civil", students: 95 },
  { dept: "Chem", students: 70 },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout user={mockAdminUser}>
      <div className="space-y-6 animate-fade-in">
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
            subtitle="+124 this sem"
            icon={<GraduationCap size={18} />}
            color="indigo"
            trend="up"
          />
          <StatCard
            title="Total Users"
            value={mockUsers.length}
            subtitle="All roles"
            icon={<Users size={18} />}
            color="sky"
          />
          <StatCard
            title="Documents"
            value={mockDocuments.length}
            subtitle="Indexed in RAG"
            icon={<FileText size={18} />}
            color="emerald"
          />
          <StatCard
            title="Active Notices"
            value="3"
            subtitle="This month"
            icon={<Bell size={18} />}
            color="amber"
          />
        </div>

        {/* Charts + Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Students by Department
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enrollment distribution
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <TrendingUp size={13} /> +8% YoY
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={deptData}
                margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
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
                <Bar dataKey="students" radius={[6, 6, 0, 0]} name="Students">
                  {deptData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#4f46e5" : "#e0e7ff"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                {
                  href: "/admin/users",
                  icon: Users,
                  label: "Manage Users",
                  sub: `${mockUsers.length} total`,
                  color: "indigo",
                },
                {
                  href: "/admin/documents",
                  icon: Upload,
                  label: "Upload Documents",
                  sub: "Add to RAG store",
                  color: "emerald",
                },
                {
                  href: "/admin/results",
                  icon: GraduationCap,
                  label: "Upload Results",
                  sub: "Batch import",
                  color: "amber",
                },
                {
                  href: "/admin/departments",
                  icon: Activity,
                  label: "Departments",
                  sub: "5 departments",
                  color: "sky",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 group transition-all"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${item.color}-50 text-${item.color}-600 shrink-0`}
                  >
                    <item.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-400">{item.sub}</div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 group-hover:text-slate-500"
                  />
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Users + Recent Documents */}
        <div className="grid lg:grid-cols-2 gap-5">
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
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
                >
                  <Avatar name={u.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">
                      {u.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {u.email}
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
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
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
                    label={d.type}
                    variant={
                      d.type === "result"
                        ? "danger"
                        : d.type === "circular"
                          ? "warning"
                          : "success"
                    }
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
