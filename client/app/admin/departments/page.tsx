"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Badge } from "@/components/ui";
import { mockAdminUser } from "@/lib/utils";
import {
  Building2,
  Users,
  FileText,
  GraduationCap,
  Plus,
  Edit2,
} from "lucide-react";

const DEPT_DATA = [
  {
    name: "Computer Science",
    code: "CS",
    students: 180,
    faculty: 18,
    head: "Dr. Priya Nair",
    established: "2000",
    docs: 12,
  },
  {
    name: "Electronics",
    code: "ECE",
    students: 140,
    faculty: 15,
    head: "Dr. Ramesh Kumar",
    established: "2000",
    docs: 9,
  },
  {
    name: "Mechanical",
    code: "ME",
    students: 120,
    faculty: 14,
    head: "Dr. Suresh Patel",
    established: "2000",
    docs: 8,
  },
  {
    name: "Civil",
    code: "CE",
    students: 95,
    faculty: 12,
    head: "Dr. Anjali Singh",
    established: "2005",
    docs: 7,
  },
  {
    name: "Chemical",
    code: "ChE",
    students: 70,
    faculty: 10,
    head: "Dr. Vikram Reddy",
    established: "2010",
    docs: 5,
  },
];

export default function AdminDepartmentsPage() {
  const [selected, setSelected] = useState(DEPT_DATA[0]);

  return (
    <DashboardLayout user={mockAdminUser}>
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Departments
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {DEPT_DATA.length} departments
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm">
            <Plus size={15} /> Add Department
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Department List */}
          <div className="space-y-2">
            {DEPT_DATA.map((dept) => (
              <button
                key={dept.code}
                onClick={() => setSelected(dept)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${selected.code === dept.code ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${selected.code === dept.code ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700"}`}
                  >
                    {dept.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-semibold truncate ${selected.code === dept.code ? "text-white" : "text-slate-800"}`}
                    >
                      {dept.name}
                    </div>
                    <div
                      className={`text-xs ${selected.code === dept.code ? "text-indigo-200" : "text-slate-400"}`}
                    >
                      {dept.students} students
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Department Detail */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 size={18} className="text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    {selected.name}
                  </h3>
                  <Badge label={selected.code} variant="primary" />
                </div>
                <p className="text-sm text-slate-500">
                  Established {selected.established} · {selected.faculty}{" "}
                  Faculty Members
                </p>
              </div>
              <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                <Edit2 size={15} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                {
                  icon: Users,
                  label: "Students",
                  value: selected.students,
                  color: "indigo",
                },
                {
                  icon: GraduationCap,
                  label: "Faculty",
                  value: selected.faculty,
                  color: "emerald",
                },
                {
                  icon: FileText,
                  label: "Documents",
                  value: selected.docs,
                  color: "amber",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`p-4 bg-${stat.color}-50 rounded-xl text-center`}
                >
                  <stat.icon
                    size={16}
                    className={`text-${stat.color}-600 mx-auto mb-1.5`}
                  />
                  <div className={`text-xl font-bold text-${stat.color}-700`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs text-${stat.color}-500`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Department Head</span>
                <span className="text-sm font-semibold text-slate-800">
                  {selected.head}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Department Code</span>
                <span className="text-sm font-mono font-semibold text-indigo-700">
                  {selected.code}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Established</span>
                <span className="text-sm font-semibold text-slate-800">
                  {selected.established}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">
                  Avg. Department CGPA
                </span>
                <Badge label="8.2" variant="success" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
