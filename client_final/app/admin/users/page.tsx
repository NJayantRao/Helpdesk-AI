"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Badge, StatCard, EmptyState } from "@/components/ui";
import { mockAdminUser, mockUsers } from "@/lib/utils";
import { Users, GraduationCap, ShieldCheck, Eye, Search } from "lucide-react";

type RoleFilter = "all" | "student" | "admin";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const filtered = mockUsers.filter((u) => {
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const students = mockUsers.filter((u) => u.role === "student");
  const admins = mockUsers.filter((u) => u.role === "admin");

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div>
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            User Management
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            View all registered users
          </p>
        </div>

        {/* Info badge */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <ShieldCheck size={15} className="shrink-0" />
          User registration is managed by the system administrator. Contact IT
          to add or remove users.
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            title="Total Users"
            value={mockUsers.length}
            subtitle="All roles"
            icon={<Users size={18} />}
            color="indigo"
          />
          <StatCard
            title="Students"
            value={students.length}
            subtitle="Active students"
            icon={<GraduationCap size={18} />}
            color="emerald"
          />
          <StatCard
            title="Admins"
            value={admins.length}
            subtitle="Staff & faculty"
            icon={<ShieldCheck size={18} />}
            color="amber"
          />
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "student", "admin"] as RoleFilter[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                    roleFilter === r
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* User Table */}
        <Card className="overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={<Users size={22} />}
                title="No users found"
                description="Try adjusting search or filter."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {[
                      "User",
                      "Role",
                      "Department",
                      "Semester",
                      "Roll No",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-semibold text-slate-500 px-5 py-3"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center text-xs font-bold shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">
                              {u.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          label={u.role}
                          variant={u.role === "admin" ? "warning" : "primary"}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">
                        {u.department || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">
                        {u.role === "student" && u.semester
                          ? `Sem ${u.semester}`
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        {u.rollNumber ? (
                          <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">
                            {u.rollNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => alert(`Viewing profile for ${u.name}`)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
