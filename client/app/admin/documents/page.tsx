"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Button, Badge, EmptyState } from "@/components/ui";
import { API_BASE_URL, DEPARTMENTS } from "@/lib/constants";
import {
  Upload,
  FileText,
  Search,
  ExternalLink,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Notice", "Circular", "Syllabus", "Result"];
const TYPE_BADGE: Record<string, any> = {
  notice: "danger",
  circular: "warning",
  syllabus: "primary",
  result: "success",
};
function formatBytes(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminDocumentsPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Notice");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchDocs = () => {
    setLoading(true);
    const qs = search ? `?search=${encodeURIComponent(search)}` : "";
    axios
      .get(`${API_BASE_URL}/student/documents${qs}`, { withCredentials: true })
      .then((res) => setDocs((res.data?.data ?? res.data)?.documents || []))
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403)
          router.push("/login");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocs();
  }, [search]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !uploadFile) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append("document", uploadFile);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("departmentId", "cb4db1f5-398a-4b47-9020-4bb6691d1d33");
      await axios.post(`${API_BASE_URL}/document/`, formData, {
        withCredentials: true,
      });
      setTitle("");
      setCategory("Notice");
      setDepartment(DEPARTMENTS[0]);
      setUploadFile(null);
      fetchDocs();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await axios.delete(`${API_BASE_URL}/document/${id}`, {
        withCredentials: true,
      });
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch {
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Document Management
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload and manage university documents
          </p>
        </div>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            Upload Document
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Document Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CS Semester 4 Syllabus"
                  required
                  className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  File
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && setUploadFile(e.target.files[0])
                  }
                />
                {uploadFile ? (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <FileText size={16} className="text-indigo-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">
                        {uploadFile.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatBytes(uploadFile.size)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadFile(null)}
                      className="p-1 hover:bg-slate-200 rounded-lg"
                    >
                      <X size={13} className="text-slate-400" />
                    </button>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-xl py-6 flex flex-col items-center justify-center cursor-pointer text-center transition-all",
                      dragging
                        ? "border-indigo-400 bg-indigo-50/50"
                        : "border-slate-200 hover:border-indigo-300"
                    )}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      e.dataTransfer.files[0] &&
                        setUploadFile(e.dataTransfer.files[0]);
                    }}
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload size={20} className="text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">
                      Drag & drop or{" "}
                      <span className="text-indigo-600 font-medium">
                        browse
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports: PDF, DOC, DOCX, PPT, XLSX
                    </p>
                  </div>
                )}
              </div>
              {submitError && (
                <div className="md:col-span-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                  {submitError}
                </div>
              )}
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  disabled={!title || !uploadFile || submitting}
                  loading={submitting}
                >
                  <Upload size={15} />
                  Upload Document
                </Button>
              </div>
            </div>
          </form>
        </Card>
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-slate-900">Documents</h3>
            <div className="relative w-64">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 transition-all"
              />
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 size={22} className="animate-spin text-indigo-600" />
            </div>
          ) : docs.length === 0 ? (
            <div className="p-10">
              <EmptyState
                icon={<FileText size={22} />}
                title="No documents found"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {[
                      "Title",
                      "Category",
                      "Uploaded By",
                      "Date",
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
                  {docs.map((d: any) => (
                    <tr
                      key={d.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-slate-800">
                          {d.title}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          label={d.category || "—"}
                          variant={
                            TYPE_BADGE[d.category?.toLowerCase()] || "neutral"
                          }
                        />
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">
                        {d.uploadedBy?.user?.fullName || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-400">
                        {new Date(d.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        {deletingId === d.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                              Sure?
                            </span>
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg transition-colors"
                            >
                              Yes, delete
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 border border-slate-200 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                window.open(d.fileUrl || "#", "_blank")
                              }
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <ExternalLink size={14} />
                            </button>
                            <button
                              onClick={() => setDeletingId(d.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-red-300 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
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
