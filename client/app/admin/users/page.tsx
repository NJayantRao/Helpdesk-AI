"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Badge, Avatar, EmptyState, Button } from "@/components/ui";
import { mockAdminUser, mockUsers, DEPARTMENTS } from "@/lib/utils";
import { Users, Search, Plus, Edit2, Trash2, X, UserCheck } from "lucide-react";
import type { User } from "@/types";

interface UserFormData {
  name: string;
  email: string;
  role: string;
  department: string;
  rollNumber: string;
}
const EMPTY_FORM: UserFormData = {
  name: "",
  email: "",
  role: "student",
  department: "",
  rollNumber: "",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<UserFormData>(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowModal(true);
  }
  function openEdit(u: User) {
    setForm({
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department || "",
      rollNumber: u.rollNumber || "",
    });
    setEditId(u.id);
    setShowModal(true);
  }
  function deleteUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (editId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editId
            ? { ...u, ...form, role: form.role as User["role"] }
            : u
        )
      );
    } else {
      setUsers((prev) => [
        ...prev,
        { id: Date.now().toString(), ...form, role: form.role as User["role"] },
      ]);
    }
    setLoading(false);
    setShowModal(false);
  }

  return (
    <DashboardLayout user={mockAdminUser}>
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              User Management
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {users.length} total users
            </p>
          </div>
          <Button onClick={openCreate} size="md">
            <Plus size={15} /> Add User
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {["all", "student", "admin", "system"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${roleFilter === r ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Users size={22} />}
              title="No users found"
              description="Try adjusting your search or filter."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400 font-medium">
                    <th className="text-left px-5 py-3.5">User</th>
                    <th className="text-left px-5 py-3.5 hidden md:table-cell">
                      Department
                    </th>
                    <th className="text-left px-5 py-3.5 hidden lg:table-cell">
                      Roll No.
                    </th>
                    <th className="text-left px-5 py-3.5">Role</th>
                    <th className="text-right px-5 py-3.5">Actions</th>
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
                          <Avatar name={u.name} size="sm" />
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
                      <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">
                        {u.department || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs hidden lg:table-cell">
                        {u.rollNumber || "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          label={u.role}
                          variant={
                            u.role === "admin"
                              ? "warning"
                              : u.role === "system"
                                ? "danger"
                                : "primary"
                          }
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(u)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck size={16} className="text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  {editId ? "Edit User" : "Create New User"}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Dr. Jane Smith"
                  className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  University Email *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="jane.smith@nist.edu"
                  className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Role *
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, role: e.target.value }))
                    }
                    className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {form.role === "student" && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Roll Number
                    </label>
                    <input
                      value={form.rollNumber}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, rollNumber: e.target.value }))
                      }
                      placeholder="2204xxx"
                      className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Department
                </label>
                <select
                  value={form.department}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, department: e.target.value }))
                  }
                  className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : null}
                  {editId ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
