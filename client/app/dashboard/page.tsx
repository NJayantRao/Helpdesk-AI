"use client";
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, Card, Badge } from "@/components/ui";
import {
  mockUser,
  mockStats,
  mockNotifications,
  mockResults,
} from "@/lib/utils";
import {
  GraduationCap,
  TrendingUp,
  BookOpen,
  AlertTriangle,
  Bell,
  FileText,
  MessageSquare,
  BarChart3,
  ChevronRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const cgpaData = [
  { sem: "Sem 1", sgpa: 8.2, cgpa: 8.2 },
  { sem: "Sem 2", sgpa: 8.5, cgpa: 8.35 },
  { sem: "Sem 3", sgpa: 8.8, cgpa: 8.5 },
];

const notifType: Record<string, "danger" | "primary" | "warning" | "success"> =
  {
    urgent: "danger",
    info: "primary",
    warning: "warning",
    success: "success",
  };

export default function StudentDashboard() {
  const unread = mockNotifications.filter((n) => !n.read);

  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome */}
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="text-xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Good morning, {mockUser.name.split(" ")[0]} 👋
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Semester {mockUser.semester} · {mockUser.department}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-sm text-indigo-700 font-medium">
            <Calendar size={14} />
            March 2026
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Current CGPA"
            value={mockStats.currentCGPA}
            subtitle="Out of 10.0"
            icon={<GraduationCap size={18} />}
            color="indigo"
            trend="up"
          />
          <StatCard
            title="Semester"
            value={`Sem ${mockStats.currentSemester}`}
            subtitle="B.Tech CS"
            icon={<BookOpen size={18} />}
            color="sky"
          />
          <StatCard
            title="Total Credits"
            value={mockStats.totalCredits}
            subtitle="Earned so far"
            icon={<BarChart3 size={18} />}
            color="emerald"
          />
          <StatCard
            title="Attendance"
            value={`${mockStats.attendancePercent}%`}
            subtitle="This semester"
            icon={<AlertTriangle size={18} />}
            color={mockStats.attendancePercent >= 75 ? "emerald" : "amber"}
          />
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* CGPA Chart */}
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  CGPA Trend
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Semester-wise performance
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald-600" />
                <Badge
                  label={mockStats.trend}
                  variant={
                    mockStats.trend === "Improving"
                      ? "success"
                      : mockStats.trend === "Declining"
                        ? "danger"
                        : "neutral"
                  }
                />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart
                data={cgpaData}
                margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="sem"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[7.5, 10]}
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
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{ fontWeight: 600, color: "#0f172a" }}
                />
                <Line
                  type="monotone"
                  dataKey="cgpa"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={{ fill: "#4f46e5", r: 4, strokeWidth: 0 }}
                  name="CGPA"
                />
                <Line
                  type="monotone"
                  dataKey="sgpa"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#10b981", r: 3, strokeWidth: 0 }}
                  name="SGPA"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3">
              {[
                ["#4f46e5", "CGPA"],
                ["#10b981", "SGPA (dashed)"],
              ].map(([c, l]) => (
                <div
                  key={l}
                  className="flex items-center gap-1.5 text-xs text-slate-500"
                >
                  <span
                    className="w-3 h-0.5 rounded"
                    style={{ background: c }}
                  />
                  {l}
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Quick Access
            </h3>
            <div className="space-y-2">
              {[
                {
                  href: "/dashboard/results",
                  icon: GraduationCap,
                  label: "View Results",
                  sub: "Semester-wise marks",
                  color: "indigo",
                },
                {
                  href: "/dashboard/helpdesk",
                  icon: MessageSquare,
                  label: "AI Helpdesk",
                  sub: "Ask a question",
                  color: "emerald",
                },
                {
                  href: "/dashboard/documents",
                  icon: FileText,
                  label: "Documents",
                  sub: "Notices & circulars",
                  color: "amber",
                },
                {
                  href: "/dashboard/notifications",
                  icon: Bell,
                  label: "Notifications",
                  sub: `${unread.length} unread`,
                  color: "rose",
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
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-400">{item.sub}</div>
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

        {/* Notifications + Latest Results */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Recent Notifications */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Recent Notifications
              </h3>
              <Link
                href="/dashboard/notifications"
                className="text-xs text-indigo-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {mockNotifications.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-slate-200" : "bg-indigo-500"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <span className="text-sm font-medium text-slate-800 leading-tight">
                        {n.title}
                      </span>
                      <Badge
                        label={n.type === "urgent" ? "Urgent" : n.type}
                        variant={notifType[n.type]}
                      />
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {n.message}
                    </p>
                    <span className="text-[11px] text-slate-300 mt-0.5 block">
                      {n.department}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Last Semester Summary */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Semester 3 Summary
              </h3>
              <Link
                href="/dashboard/results"
                className="text-xs text-indigo-600 hover:underline"
              >
                Full results
              </Link>
            </div>
            <div className="flex items-center gap-4 p-3 bg-indigo-50 rounded-xl mb-4">
              <div className="text-center px-3">
                <div className="text-2xl font-bold text-indigo-700">8.8</div>
                <div className="text-xs text-indigo-500">SGPA</div>
              </div>
              <div className="h-10 w-px bg-indigo-200" />
              <div className="text-center px-3">
                <div className="text-2xl font-bold text-indigo-700">8.5</div>
                <div className="text-xs text-indigo-500">CGPA</div>
              </div>
              <div className="h-10 w-px bg-indigo-200" />
              <div className="flex-1">
                <div className="text-xs font-medium text-indigo-700">
                  Performance
                </div>
                <Badge label="Improving ↑" variant="success" />
              </div>
            </div>
            <div className="space-y-2">
              {mockResults[2].subjects.map((s) => (
                <div
                  key={s.code}
                  className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-slate-700 block truncate">
                      {s.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {s.code} · {s.credits} credits
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-800">
                      {s.marks}
                    </span>
                    <span className="text-xs text-slate-400">
                      /{s.maxMarks}
                    </span>
                    <span className="ml-2 text-xs font-semibold text-indigo-600">
                      {s.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
