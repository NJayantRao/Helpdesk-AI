"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Button, Badge, EmptyState } from "@/components/ui";
import { mockAdminUser, mockDocuments, DEPARTMENTS } from "@/lib/utils";
import type { Document } from "@/types";
import {
  Upload,
  FileText,
  Search,
  ExternalLink,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

const CATEGORIES = ["Notice", "Circular", "Syllabus", "Result"];

const TYPE_BADGE: Record<
  string,
  "primary" | "warning" | "success" | "danger" | "neutral"
> = {
  notice: "danger",
  circular: "warning",
  syllabus: "primary",
  result: "success",
};

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<Document[]>(mockDocuments);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Notice");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = docs.filter(
    (d) =>
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase())
  );

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadFile(files[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !uploadFile) return;
    // TODO: call POST /api/v1/document/
    alert(`Uploading "${title}" — API not connected yet.`);
    setTitle("");
    setCategory("Notice");
    setDepartment(DEPARTMENTS[0]);
    setUploadFile(null);
  }

  function handleDelete(id: string) {
    // TODO: call DELETE /api/v1/document/:id
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setDeletingId(null);
  }

  return (
    <DashboardLayout user={mockAdminUser}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
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

        {/* Upload Form */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            Upload Document
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title — full width */}
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

              {/* Category */}
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

              {/* Department */}
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

              {/* File — full width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  File
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
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
                      handleFiles(e.dataTransfer.files);
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

              {/* Submit — full width */}
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  disabled={!title || !uploadFile}
                >
                  <Upload size={15} /> Upload Document
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Existing Documents Table */}
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
                placeholder="Search..."
                className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
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
                      "Department",
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
                  {filtered.map((d) => (
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
                          label={
                            d.type.charAt(0).toUpperCase() + d.type.slice(1)
                          }
                          variant={TYPE_BADGE[d.type] || "neutral"}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">
                        {d.department}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">
                        {d.uploadedBy}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-400">
                        {new Date(d.uploadedAt).toLocaleDateString("en-IN", {
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
                                window.open(d.url || "#", "_blank")
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
