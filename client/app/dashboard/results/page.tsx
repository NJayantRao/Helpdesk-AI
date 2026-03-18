"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, Card, Badge } from "@/components/ui";
import { ResultsSkeleton } from "@/components/Skeleton";
import { API_BASE_URL } from "@/lib/constants";
import { GraduationCap, TrendingUp, Award, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const GRADE_COLORS: Record<string, string> = {
  "A+": "#10b981",
  A: "#4f46e5",
  "B+": "#f59e0b",
  B: "#f97316",
  C: "#ef4444",
  D: "#dc2626",
  F: "#991b1b",
};

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSem, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/student/results`, { withCredentials: true })
      .then((res) => {
        const d = res.data?.data ?? res.data;
        setData(d);
        const completed = (d.semesters || []).filter((s: any) => s.sgpa > 0);
        setExpanded(completed.at(-1)?.semester ?? null);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403)
          router.push("/login");
        else setError(err.response?.data?.message || "Failed to load results");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <DashboardLayout>
        <ResultsSkeleton />
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

  const semesters = data?.semesters || [];
  const completed = semesters.filter((s: any) => s.sgpa > 0);
  const chartData = (data?.cgpaHistory || []).map((r: any) => ({
    name: `Sem ${r.semester}`,
    sgpa: r.sgpa,
    cgpa: r.cgpa,
  }));
  const lastTwo = chartData.slice(-2);
  const trend =
    lastTwo.length >= 2
      ? lastTwo[1].cgpa > lastTwo[0].cgpa
        ? "Improving"
        : lastTwo[1].cgpa < lastTwo[0].cgpa
          ? "Declining"
          : "Stable"
      : "Stable";
  const totalBacklogs = semesters
    .flatMap((s: any) => s.subjects)
    .filter((s: any) => s.status === "FAILED").length;
  const totalCredits = completed.reduce(
    (sum: number, s: any) => sum + s.totalCredits,
    0
  );
  const latestCompleted = completed.at(-1);
  const gradeDistData = Object.entries(
    semesters
      .flatMap((s: any) => s.subjects)
      .reduce((acc: any, s: any) => {
        acc[s.grade] = (acc[s.grade] || 0) + 1;
        return acc;
      }, {})
  ).map(([grade, count]) => ({ grade, count }));

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Results & CGPA
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Academic performance across all semesters
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Current CGPA"
            value={data?.cgpa?.toFixed(2) ?? "—"}
            subtitle="Cumulative"
            icon={<GraduationCap size={18} />}
            color="indigo"
            trend="up"
          />
          <StatCard
            title="Latest SGPA"
            value={latestCompleted?.sgpa?.toFixed(2) ?? "—"}
            subtitle={`Semester ${latestCompleted?.semester || "—"}`}
            icon={<TrendingUp size={18} />}
            color="emerald"
          />
          <StatCard
            title="Total Credits"
            value={totalCredits}
            subtitle="Completed"
            icon={<Award size={18} />}
            color="sky"
          />
          <StatCard
            title="Backlogs"
            value={totalBacklogs}
            subtitle={totalBacklogs === 0 ? "All cleared ✓" : "Pending"}
            icon={<AlertTriangle size={18} />}
            color={totalBacklogs === 0 ? "emerald" : "red"}
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                SGPA vs CGPA
              </h3>
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
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
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
                    dot={{ fill: "#4f46e5", r: 4 }}
                    name="CGPA"
                  />
                  <Line
                    type="monotone"
                    dataKey="sgpa"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#10b981", r: 3 }}
                    name="SGPA"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-slate-400">
                No results yet.
              </div>
            )}
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Grade Distribution
            </h3>
            {gradeDistData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={gradeDistData}
                  margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="grade"
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
                  <Bar dataKey="count" name="Subjects" radius={[4, 4, 0, 0]}>
                    {gradeDistData.map((entry: any) => (
                      <Cell
                        key={entry.grade}
                        fill={GRADE_COLORS[entry.grade] || "#4f46e5"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-slate-400">
                No grade data.
              </div>
            )}
          </Card>
        </div>
        {semesters.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-slate-400 text-sm">No results available yet.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Semester-wise Results
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {semesters.map((sem: any) => (
                <div key={sem.semester}>
                  <button
                    onClick={() =>
                      setExpanded(
                        expandedSem === sem.semester ? null : sem.semester
                      )
                    }
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-700">
                        S{sem.semester}
                      </div>
                      <div className="text-sm font-semibold text-slate-800">
                        Semester {sem.semester}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {sem.sgpa > 0 ? (
                        <>
                          <span className="text-xs text-slate-500">
                            SGPA:{" "}
                            <span className="font-semibold text-slate-800">
                              {sem.sgpa.toFixed(2)}
                            </span>
                          </span>
                          <span className="text-xs text-slate-500">
                            CGPA:{" "}
                            <span className="font-semibold text-slate-800">
                              {sem.cgpa.toFixed(2)}
                            </span>
                          </span>
                        </>
                      ) : (
                        <Badge label="Upcoming" variant="neutral" />
                      )}
                      <span
                        className={`text-slate-400 transition-transform duration-200 ${expandedSem === sem.semester ? "rotate-180" : ""}`}
                      >
                        ▾
                      </span>
                    </div>
                  </button>
                  {expandedSem === sem.semester && sem.subjects.length > 0 && (
                    <div className="px-5 pb-4">
                      <div className="overflow-x-auto rounded-xl border border-slate-100">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50">
                              {[
                                "Subject",
                                "Credits",
                                "Marks",
                                "Grade",
                                "Status",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="text-left text-xs font-semibold text-slate-500 px-4 py-3"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sem.subjects.map((s: any, i: number) => (
                              <tr
                                key={i}
                                className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="px-4 py-3">
                                  <div className="font-medium text-slate-800">
                                    {s.subjectName}
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    {s.subjectCode}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                  {s.credits}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="font-semibold text-slate-800">
                                    {s.marks}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
                                    style={{
                                      background: `${GRADE_COLORS[s.grade] || "#94a3b8"}20`,
                                      color: GRADE_COLORS[s.grade] || "#94a3b8",
                                    }}
                                  >
                                    {s.grade}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <Badge
                                    label={
                                      s.status === "FAILED" ? "FAIL" : "PASS"
                                    }
                                    variant={
                                      s.status === "FAILED"
                                        ? "danger"
                                        : "success"
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {expandedSem === sem.semester &&
                    sem.subjects.length === 0 && (
                      <div className="px-5 pb-4 text-center text-sm text-slate-400 py-6">
                        Results not yet available.
                      </div>
                    )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
