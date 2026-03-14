"use client";
import React, { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Badge, EmptyState } from "@/components/ui";
import { mockAdminUser, mockDocuments, DEPARTMENTS } from "@/lib/utils";
import {
  FileText,
  Upload,
  Search,
  Trash2,
  RefreshCw,
  CheckCircle,
  X,
  CloudUpload,
  Bell,
  BookOpen,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import type { Document } from "@/types/index";

const TYPE_ICONS = {
  notice: Bell,
  circular: ClipboardList,
  syllabus: BookOpen,
  result: GraduationCap,
};
const TYPE_COLORS = {
  notice: "primary",
  circular: "warning",
  syllabus: "success",
  result: "danger",
} as const;

type UploadStatus = "idle" | "uploading" | "embedding" | "done" | "error";

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<Document[]>(mockDocuments);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [form, setForm] = useState({
    title: "",
    type: "notice",
    department: "",
  });
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = docs.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || d.type === typeFilter;
    return matchSearch && matchType;
  });

  function deleteDoc(id: string) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!fileName) return;
    setUploadStatus("uploading");
    await new Promise((r) => setTimeout(r, 1000));
    setUploadStatus("embedding");
    await new Promise((r) => setTimeout(r, 1200));
    setUploadStatus("done");
    const newDoc: Document = {
      id: Date.now().toString(),
      title: form.title,
      type: form.type as Document["type"],
      department: form.department,
      uploadedBy: mockAdminUser.name,
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: "1.0 MB",
    };
    setDocs((prev) => [newDoc, ...prev]);
    setTimeout(() => {
      setShowUpload(false);
      setUploadStatus("idle");
      setForm({ title: "", type: "notice", department: "" });
      setFileName("");
    }, 1500);
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
              Document Management
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {docs.length} documents indexed in RAG
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
          >
            <Upload size={15} /> Upload Document
          </button>
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
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "notice", "circular", "syllabus", "result"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${typeFilter === t ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        {/* Documents Table */}
        <Card className="overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<FileText size={22} />}
              title="No documents found"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400 font-medium">
                    <th className="text-left px-5 py-3.5">Document</th>
                    <th className="text-left px-5 py-3.5 hidden md:table-cell">
                      Department
                    </th>
                    <th className="text-left px-5 py-3.5">Type</th>
                    <th className="text-left px-5 py-3.5 hidden lg:table-cell">
                      Uploaded
                    </th>
                    <th className="text-left px-5 py-3.5 hidden lg:table-cell">
                      Size
                    </th>
                    <th className="text-right px-5 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((d: Document) => {
                    const Icon = TYPE_ICONS[d.type];
                    return (
                      <tr
                        key={d.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                              <Icon size={14} className="text-indigo-600" />
                            </div>
                            <span className="font-medium text-slate-800 line-clamp-1">
                              {d.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">
                          {d.department}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge label={d.type} variant={TYPE_COLORS[d.type]} />
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs hidden lg:table-cell">
                          {new Date(d.uploadedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs hidden lg:table-cell">
                          {d.fileSize}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              title="Re-index"
                            >
                              <RefreshCw size={13} />
                            </button>
                            <button
                              onClick={() => deleteDoc(d.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => uploadStatus === "idle" && setShowUpload(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CloudUpload size={16} className="text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Upload Document
                </h3>
              </div>
              {uploadStatus === "idle" && (
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {uploadStatus === "done" ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-emerald-600" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">
                  Upload Complete!
                </h4>
                <p className="text-xs text-slate-500">
                  Document chunked, embedded, and indexed in Qdrant.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="p-5 space-y-4">
                {/* Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const f = e.dataTransfer.files[0];
                    if (f) setFileName(f.name);
                  }}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragOver ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"}`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && setFileName(e.target.files[0].name)
                    }
                  />
                  <Upload size={22} className="text-slate-400 mx-auto mb-2" />
                  {fileName ? (
                    <div>
                      <p className="text-sm font-medium text-indigo-700">
                        {fileName}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        File selected
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">
                        Drop PDF here or click to browse
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        PDF, DOC, DOCX — up to 50MB
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Document Title *
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="e.g. CS Sem 4 Syllabus 2026"
                    className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Type *
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, type: e.target.value }))
                      }
                      className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="notice">Notice</option>
                      <option value="circular">Circular</option>
                      <option value="syllabus">Syllabus</option>
                      <option value="result">Result</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Department *
                    </label>
                    <select
                      required
                      value={form.department}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, department: e.target.value }))
                      }
                      className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="">Select</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {(uploadStatus === "uploading" ||
                  uploadStatus === "embedding") && (
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-medium text-indigo-700 mb-2">
                      <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-indigo-600 rounded-full animate-spin" />
                      {uploadStatus === "uploading"
                        ? "Uploading document..."
                        : "Chunking & embedding into Qdrant..."}
                    </div>
                    <div className="w-full bg-indigo-200 rounded-full h-1">
                      <div
                        className="bg-indigo-600 h-1 rounded-full transition-all duration-500"
                        style={{
                          width: uploadStatus === "uploading" ? "40%" : "85%",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUpload(false)}
                    className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!fileName || uploadStatus !== "idle"}
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Upload size={14} /> Upload & Index
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
