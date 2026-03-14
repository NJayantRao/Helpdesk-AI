"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Badge } from "@/components/ui";
import { mockUser, mockResults, mockStats } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const gradeColors: Record<string, string> = {
  "A+": "#10b981",
  A: "#4f46e5",
  "B+": "#f59e0b",
  B: "#f97316",
  C: "#ef4444",
};

export default function ResultsPage() {
  const [expandedSem, setExpandedSem] = useState<number | null>(3);
  const chartData = mockResults
    .filter((r) => r.sgpa > 0)
    .map((r) => ({ name: `Sem ${r.semester}`, sgpa: r.sgpa, cgpa: r.cgpa }));

  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Results & CGPA
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Semester-wise academic performance and trend analysis
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Current CGPA",
              value: mockStats.currentCGPA,
              sub: "Out of 10.0",
              color: "text-indigo-700 bg-indigo-50",
            },
            {
              label: "Latest SGPA",
              value: "8.8",
              sub: "Semester 3",
              color: "text-emerald-700 bg-emerald-50",
            },
            {
              label: "Total Credits",
              value: mockStats.totalCredits,
              sub: "Earned",
              color: "text-amber-700 bg-amber-50",
            },
            {
              label: "Backlogs",
              value: mockStats.backlogs,
              sub: "Active",
              color: "text-slate-700 bg-slate-100",
            },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <div
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold mb-2 ${s.color}`}
              >
                {s.sub}
              </div>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-5">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-900">
                SGPA vs CGPA Trend
              </h3>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald-500" />
                <Badge label={mockStats.trend} variant="success" />
              </div>
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
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-5">
              SGPA by Semester
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
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
                  }}
                />
                <Bar dataKey="sgpa" radius={[6, 6, 0, 0]} name="SGPA">
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={i === chartData.length - 1 ? "#4f46e5" : "#c7d2fe"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Semester Results */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Semester Results
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {mockResults
              .filter((r) => r.sgpa > 0)
              .map((sem) => (
                <div key={sem.semester}>
                  <button
                    onClick={() =>
                      setExpandedSem(
                        expandedSem === sem.semester ? null : sem.semester
                      )
                    }
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center text-sm font-bold text-indigo-700">
                        {sem.semester}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-slate-800">
                          Semester {sem.semester}
                        </div>
                        <div className="text-xs text-slate-400">
                          {sem.year} · {sem.subjects.length} subjects
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">SGPA</div>
                        <div className="text-sm font-bold text-indigo-700">
                          {sem.sgpa}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">CGPA</div>
                        <div className="text-sm font-bold text-slate-800">
                          {sem.cgpa}
                        </div>
                      </div>
                      {expandedSem === sem.semester ? (
                        <ChevronUp size={16} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={16} className="text-slate-400" />
                      )}
                    </div>
                  </button>
                  {expandedSem === sem.semester && (
                    <div className="px-5 pb-4 animate-slide-up">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-slate-400 border-b border-slate-100">
                            <th className="text-left py-2 font-medium">
                              Subject
                            </th>
                            <th className="text-center py-2 font-medium">
                              Code
                            </th>
                            <th className="text-center py-2 font-medium">
                              Credits
                            </th>
                            <th className="text-center py-2 font-medium">
                              Marks
                            </th>
                            <th className="text-center py-2 font-medium">
                              Grade
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {sem.subjects.map((s) => (
                            <tr
                              key={s.code}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <td className="py-2.5 font-medium text-slate-800">
                                {s.name}
                              </td>
                              <td className="py-2.5 text-center text-slate-500 font-mono text-xs">
                                {s.code}
                              </td>
                              <td className="py-2.5 text-center text-slate-500">
                                {s.credits}
                              </td>
                              <td className="py-2.5 text-center">
                                <span className="text-slate-800 font-medium">
                                  {s.marks}
                                </span>
                                <span className="text-slate-400">
                                  /{s.maxMarks}
                                </span>
                              </td>
                              <td className="py-2.5 text-center">
                                <span
                                  className="px-2 py-0.5 rounded-md text-xs font-bold"
                                  style={{
                                    background: `${gradeColors[s.grade]}20`,
                                    color: gradeColors[s.grade],
                                  }}
                                >
                                  {s.grade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="flex gap-2 mt-3">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-lg">
                          <Award size={12} className="text-indigo-600" />
                          <span className="text-xs font-semibold text-indigo-700">
                            SGPA: {sem.sgpa}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg">
                          <span className="text-xs font-semibold text-slate-700">
                            CGPA: {sem.cgpa}
                          </span>
                        </div>
                      </div>
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
