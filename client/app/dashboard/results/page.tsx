"use client";
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, Card, Badge } from "@/components/ui";
import { mockUser, mockStats, mockResults } from "@/lib/utils";
import { ResultsSkeleton } from "@/components/Skeleton";
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

const chartData = mockResults
  .filter((r) => r.sgpa > 0)
  .map((r) => ({ name: `Sem ${r.semester}`, sgpa: r.sgpa, cgpa: r.cgpa }));

const lastTwo = chartData.slice(-2);
const computedTrend =
  lastTwo.length >= 2
    ? lastTwo[1].cgpa > lastTwo[0].cgpa
      ? "Improving"
      : lastTwo[1].cgpa < lastTwo[0].cgpa
        ? "Declining"
        : "Stable"
    : "Stable";

// Computed from data (not from mockStats)
const totalBacklogs = mockResults
  .flatMap((r) => r.subjects)
  .filter((s) => s.grade === "F").length;

const totalCredits = mockResults
  .filter((r) => r.sgpa > 0)
  .reduce(
    (sum, r) => sum + r.subjects.reduce((s2, sub) => s2 + sub.credits, 0),
    0
  );

// mockStats available in utils.ts for future API integration

const gradeDistData = Object.entries(
  mockResults
    .flatMap((r) => r.subjects)
    .reduce(
      (acc, s) => {
        acc[s.grade] = (acc[s.grade] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
).map(([grade, count]) => ({ grade, count }));

export default function ResultsPage() {
  const [expandedSem, setExpandedSem] = useState<number | null>(
    mockResults.filter((r) => r.sgpa > 0).at(-1)?.semester ?? null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <DashboardLayout user={mockUser}>
        <ResultsSkeleton />
      </DashboardLayout>
    );
  }

  const latestCompleted = chartData.at(-1);

  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
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

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Current CGPA"
            value={mockResults.filter((r) => r.sgpa > 0).at(-1)?.cgpa ?? "—"}
            subtitle="Cumulative"
            icon={<GraduationCap size={18} />}
            color="indigo"
            trend="up"
          />
          <StatCard
            title="Latest SGPA"
            value={latestCompleted?.sgpa ?? "—"}
            subtitle={`Semester ${latestCompleted?.name.replace("Sem ", "") || "—"}`}
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

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* SGPA vs CGPA */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                SGPA vs CGPA
              </h3>
              <Badge
                label={computedTrend}
                variant={
                  computedTrend === "Improving"
                    ? "success"
                    : computedTrend === "Declining"
                      ? "danger"
                      : "neutral"
                }
              />
            </div>
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
          </Card>

          {/* Grade Distribution */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Grade Distribution
            </h3>
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
                  {gradeDistData.map((entry) => (
                    <Cell
                      key={entry.grade}
                      fill={GRADE_COLORS[entry.grade] || "#4f46e5"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Semester Accordion */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Semester-wise Results
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {mockResults.map((sem) => (
              <div key={sem.semester}>
                <button
                  onClick={() =>
                    setExpandedSem(
                      expandedSem === sem.semester ? null : sem.semester
                    )
                  }
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-700">
                      S{sem.semester}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        Semester {sem.semester}
                      </div>
                      <div className="text-xs text-slate-400">{sem.year}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {sem.sgpa > 0 ? (
                      <>
                        <span className="text-xs text-slate-500">
                          SGPA:{" "}
                          <span className="font-semibold text-slate-800">
                            {sem.sgpa}
                          </span>
                        </span>
                        <span className="text-xs text-slate-500">
                          CGPA:{" "}
                          <span className="font-semibold text-slate-800">
                            {sem.cgpa}
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
                            <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">
                              Subject
                            </th>
                            <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3">
                              Credits
                            </th>
                            <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3">
                              Marks
                            </th>
                            <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3">
                              Grade
                            </th>
                            <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sem.subjects.map((s) => (
                            <tr
                              key={s.code}
                              className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <div className="font-medium text-slate-800">
                                  {s.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {s.code}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center text-slate-600">
                                {s.credits}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="font-semibold text-slate-800">
                                  {s.marks}
                                </span>
                                <span className="text-slate-400">
                                  /{s.maxMarks}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
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
                              <td className="px-4 py-3 text-center">
                                {s.grade === "F" ? (
                                  <Badge label="FAIL" variant="danger" />
                                ) : (
                                  <Badge label="PASS" variant="success" />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {expandedSem === sem.semester && sem.subjects.length === 0 && (
                  <div className="px-5 pb-4 text-center text-sm text-slate-400 py-6">
                    Results not yet available for this semester.
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
