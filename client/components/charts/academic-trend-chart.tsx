"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SemesterProgress } from "@/lib/contracts";

type AcademicTrendChartProps = {
  data: SemesterProgress[];
};

export function AcademicTrendChart({ data }: AcademicTrendChartProps) {
  const minValue = Math.min(...data.flatMap((item) => [item.sgpa, item.cgpa]));
  const maxValue = Math.max(...data.flatMap((item) => [item.sgpa, item.cgpa]));
  const lowerBound = Math.max(0, Math.floor(minValue - 0.5));
  const upperBound = Math.min(10, Math.ceil(maxValue + 0.5));

  return (
    <div className="surface-card p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">Performance chart</span>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            SGPA and CGPA trend
          </h3>
        </div>
        <p className="text-sm text-slate-500">
          Mock academic performance across recent semesters.
        </p>
      </div>
      <div className="mt-8 h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 12, left: -16, bottom: 8 }}
          >
            <CartesianGrid stroke="rgba(148,163,184,0.18)" vertical={false} />
            <XAxis
              dataKey="term"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              domain={[lowerBound, upperBound]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 20,
                border: "1px solid rgba(226,232,240,0.9)",
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 24px 40px -24px rgba(15,23,42,0.38)",
              }}
            />
            <Line
              type="monotone"
              dataKey="sgpa"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ fill: "#2563eb", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="cgpa"
              stroke="#0f172a"
              strokeWidth={3}
              dot={{ fill: "#0f172a", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
