"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, Card, Badge } from "@/components/ui";
import { DashboardSkeleton } from "@/components/Skeleton";
import { API_BASE_URL } from "@/lib/constants";
import {
  GraduationCap,
  TrendingUp,
  BookOpen,
  Briefcase,
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

const gradeColors: Record<string, string> = {
  "A+": "#10b981",
  A: "#4f46e5",
  "B+": "#f59e0b",
  B: "#f97316",
  C: "#ef4444",
};
const notifBadge: Record<string, "danger" | "primary" | "warning" | "success"> =
  { urgent: "danger", info: "primary", warning: "warning", success: "success" };

export default function StudentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, notifRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/student/dashboard`, {
            withCredentials: true,
          }),
          axios.get(`${API_BASE_URL}/student/notifications`, {
            withCredentials: true,
          }),
        ]);

        console.log("Dashboard API:", dashRes.data);
        console.log("Notifications API:", notifRes.data);
        setDashboard(dashRes.data?.data ?? dashRes.data);
        setNotifications(
          (notifRes.data?.data ?? notifRes.data)?.notifications ?? []
        );
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          router.push("/login");
        } else {
          setError(err.response?.data?.message || "Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading)
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  if (error)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 flex-col gap-2">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-indigo-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );

  const stats = dashboard?.stats;
  const latest = dashboard?.latestSemesterSummary;
  const chartData =
    latest?.semester && latest?.sgpa != null
      ? [
          {
            sem: `Sem ${latest.semester}`,
            sgpa: latest.sgpa,
            cgpa: stats?.cgpa ?? 0,
          },
        ]
      : [];
  const trend =
    (stats?.cgpa ?? 0) >= 8
      ? "Improving"
      : (stats?.cgpa ?? 0) >= 6.5
        ? "Stable"
        : "Declining";

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="text-xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {greeting},{" "}
              {dashboard?.student?.fullName?.split(" ")[0] || "Student"} 👋
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Semester {stats?.semester} · {dashboard?.student?.department}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-sm text-indigo-700 font-medium">
            <Calendar size={14} />
            {new Date().toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Current CGPA"
            value={stats?.cgpa?.toFixed(2) ?? "—"}
            subtitle="Out of 10.0"
            icon={<GraduationCap size={18} />}
            color="indigo"
            trend="up"
          />
          <StatCard
            title="Semester"
            value={`Sem ${stats?.semester ?? "—"}`}
            subtitle={dashboard?.student?.branch ?? "B.Tech"}
            icon={<BookOpen size={18} />}
            color="sky"
          />
          <StatCard
            title="Active Subjects"
            value={stats?.activeSubjects ?? "—"}
            subtitle="This semester"
            icon={<BookOpen size={18} />}
            color="emerald"
          />
          <StatCard
            title="Eligible Companies"
            value={stats?.eligibleCompanies ?? "—"}
            subtitle="Placement drives"
            icon={<Briefcase size={18} />}
            color="sky"
          />
        </div>

        <Card className="p-5">
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
                label={trend}
                variant={
                  trend === "Improving"
                    ? "success"
                    : trend === "Declining"
                      ? "danger"
                      : "neutral"
                }
              />
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart
                data={chartData}
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
                  domain={[6, 10]}
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
          ) : (
            <div className="h-[180px] flex items-center justify-center text-sm text-slate-400">
              No results data yet.
            </div>
          )}
        </Card>

        <div className="grid lg:grid-cols-2 gap-5">
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
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">
                No notifications yet.
              </p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 3).map((n: any) => (
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
                          variant={notifBadge[n.type] ?? "primary"}
                        />
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {n.body}
                      </p>
                      <span className="text-[11px] text-slate-300 mt-0.5 block">
                        {new Date(n.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                {latest?.semester
                  ? `Semester ${latest.semester} Summary`
                  : "Latest Summary"}
              </h3>
              <Link
                href="/dashboard/results"
                className="text-xs text-indigo-600 hover:underline"
              >
                Full results
              </Link>
            </div>
            {latest?.subjects?.length > 0 ? (
              <>
                <div className="flex items-center gap-4 p-3 bg-indigo-50 rounded-xl mb-4">
                  <div className="text-center px-3">
                    <div className="text-2xl font-bold text-indigo-700">
                      {latest.sgpa?.toFixed(2) ?? "—"}
                    </div>
                    <div className="text-xs text-indigo-500">SGPA</div>
                  </div>
                  <div className="h-10 w-px bg-indigo-200" />
                  <div className="text-center px-3">
                    <div className="text-2xl font-bold text-indigo-700">
                      {stats?.cgpa?.toFixed(2) ?? "—"}
                    </div>
                    <div className="text-xs text-indigo-500">CGPA</div>
                  </div>
                  <div className="h-10 w-px bg-indigo-200" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-indigo-700">
                      Performance
                    </div>
                    <Badge
                      label={trend}
                      variant={
                        trend === "Improving"
                          ? "success"
                          : trend === "Declining"
                            ? "danger"
                            : "neutral"
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {latest.subjects.slice(0, 5).map((s: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-slate-700 block truncate">
                          {s.subjectName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {s.subjectCode} · {s.credits} credits
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-800">
                          {s.marks}
                        </span>
                        <span
                          className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded"
                          style={{
                            background: `${gradeColors[s.grade] || "#94a3b8"}20`,
                            color: gradeColors[s.grade] || "#94a3b8",
                          }}
                        >
                          {s.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">
                No semester results available yet.
              </p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
