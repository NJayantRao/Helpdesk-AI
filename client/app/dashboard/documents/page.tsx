"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Badge, EmptyState } from "@/components/ui";
import { mockUser, mockDocuments } from "@/lib/utils";
import {
  FileText,
  Search,
  Download,
  ExternalLink,
  Filter,
  BookOpen,
  Bell,
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

const CATEGORIES = ["All", "notice", "circular", "syllabus", "result"];

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = mockDocuments.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || d.type === category;
    return matchSearch && matchCat;
  });

  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Documents
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Notices, circulars, syllabi, and result documents
          </p>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
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
              <Filter size={14} className="text-slate-400 self-center" />
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${category === c ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Document Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={24} />}
            title="No documents found"
            description="Try adjusting your search or filter."
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((doc: Document) => {
              const Icon = TYPE_ICONS[doc.type];
              return (
                <Card key={doc.id} className="p-5" hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Icon size={18} className="text-indigo-600" />
                    </div>
                    <Badge label={doc.type} variant={TYPE_COLORS[doc.type]} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1 line-clamp-2 leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    {doc.department}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-4 pt-3 border-t border-slate-100">
                    <span>
                      Uploaded{" "}
                      {new Date(doc.uploadedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>{doc.fileSize}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-all">
                      <Download size={12} /> Download
                    </button>
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-all">
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
