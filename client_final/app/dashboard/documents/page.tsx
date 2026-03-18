"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, EmptyState } from "@/components/ui";
import { DocumentsSkeleton } from "@/components/Skeleton";
import { API_BASE_URL } from "@/lib/constants";
import {
  FileText,
  Search,
  Download,
  ExternalLink,
  BookOpen,
  AlertCircle,
  TrendingUp,
  BellRing,
} from "lucide-react";

const categoryLabels: Record<string, string> = {
  All: "All",
  notice: "Notice",
  circular: "Circular",
  syllabus: "Syllabus",
  result: "Result",
};
const TYPE_COLORS: Record<string, { bg: string; text: string; icon: any }> = {
  syllabus: { bg: "bg-indigo-50", text: "text-indigo-600", icon: BookOpen },
  circular: { bg: "bg-amber-50", text: "text-amber-600", icon: TrendingUp },
  result: { bg: "bg-emerald-50", text: "text-emerald-600", icon: FileText },
  notice: { bg: "bg-red-50", text: "text-red-600", icon: BellRing },
};
const CATEGORIES = ["All", "notice", "circular", "syllabus", "result"];

export default function DocumentsPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search) params.set("search", search);
    const qs = params.toString();

    setLoading(true);
    axios
      .get(`${API_BASE_URL}/student/documents${qs ? `?${qs}` : ""}`, {
        withCredentials: true,
      })
      .then((res) => {
        const d = res.data?.data ?? res.data;
        setDocs(d.documents || []);
        setTotal(d.total || 0);
        setError("");
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403)
          router.push("/login");
        else
          setError(err.response?.data?.message || "Failed to load documents");
      })
      .finally(() => setLoading(false));
  }, [category, search]);

  if (loading && docs.length === 0)
    return (
      <DashboardLayout>
        <DocumentsSkeleton />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Documents
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {error ? "—" : `${total} document${total !== 1 ? "s" : ""} found`}
          </p>
        </div>
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
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
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${category === c ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {categoryLabels[c] || c}
                </button>
              ))}
            </div>
          </div>
        </Card>
        {docs.length === 0 ? (
          <Card className="p-8">
            <EmptyState
              icon={<AlertCircle size={24} />}
              title="No documents found"
              description="Try adjusting your search or filter."
            />
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc: any) => {
              const style =
                TYPE_COLORS[doc.category?.toLowerCase()] || TYPE_COLORS.notice;
              const Icon = style.icon;
              return (
                <Card key={doc.id} hover className="p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center`}
                    >
                      <Icon size={18} className={style.text} />
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-1 rounded-lg ${style.bg} ${style.text}`}
                    >
                      {categoryLabels[doc.category?.toLowerCase()] ||
                        doc.category}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-1">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      By {doc.uploadedBy?.user?.fullName}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(doc.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        doc.fileUrl
                          ? window.open(doc.fileUrl, "_blank")
                          : (setToast("Download not available."),
                            setTimeout(() => setToast(null), 3000))
                      }
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-xl hover:bg-indigo-100 transition-colors"
                    >
                      <Download size={13} />
                      Download
                    </button>
                    <button
                      onClick={() =>
                        doc.fileUrl && window.open(doc.fileUrl, "_blank")
                      }
                      className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      <ExternalLink size={13} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </DashboardLayout>
  );
}
