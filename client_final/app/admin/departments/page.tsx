"use client";
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui";
import { mockAdminUser, DEPARTMENTS, mockUsers } from "@/lib/utils";
import { Building2, ShieldCheck } from "lucide-react";

const DEPT_COLORS = [
  "bg-indigo-50 text-indigo-600",
  "bg-emerald-50 text-emerald-600",
  "bg-amber-50 text-amber-600",
  "bg-sky-50 text-sky-600",
  "bg-rose-50 text-rose-600",
];

export default function AdminDepartmentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div>
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Departments
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {DEPARTMENTS.length} departments · University overview
          </p>
        </div>

        {/* Info badge */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <ShieldCheck size={15} className="shrink-0" />
          Department creation and deletion is managed by the system
          administrator. Contact IT to make structural changes.
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENTS.map((dept, i) => {
            const colorClass = DEPT_COLORS[i % DEPT_COLORS.length];
            const studentCount = mockUsers.filter(
              (u) =>
                u.role === "student" &&
                u.department?.toLowerCase() === dept.toLowerCase()
            ).length;

            return (
              <Card key={dept} hover className="p-5">
                <div
                  className={`w-10 h-10 ${colorClass} rounded-xl flex items-center justify-center`}
                >
                  <Building2 size={18} />
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {dept}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Department</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    {studentCount > 0
                      ? `${studentCount} student${studentCount !== 1 ? "s" : ""}`
                      : "0 students"}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
