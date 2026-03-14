"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Badge } from "@/components/ui";
import { mockAdminUser, DEPARTMENTS } from "@/lib/utils";
import {
  BarChart3,
  Upload,
  CheckCircle,
  AlertCircle,
  CloudUpload,
  Users,
} from "lucide-react";

type UploadStatus = "idle" | "processing" | "done" | "error";

interface ResultEntry {
  rollNumber: string;
  name: string;
  semester: number;
  sgpa: number;
  status: "ok" | "error";
}

const MOCK_PREVIEW: ResultEntry[] = [
  {
    rollNumber: "2204001",
    name: "Arjun Sharma",
    semester: 4,
    sgpa: 9.0,
    status: "ok",
  },
  {
    rollNumber: "2204002",
    name: "Priya Patel",
    semester: 4,
    sgpa: 8.6,
    status: "ok",
  },
  {
    rollNumber: "2204003",
    name: "Rohit Kumar",
    semester: 4,
    sgpa: 7.8,
    status: "ok",
  },
  {
    rollNumber: "2204999",
    name: "Unknown",
    semester: 4,
    sgpa: 0,
    status: "error",
  },
];

export default function AdminResultsPage() {
  const [form, setForm] = useState({
    department: "",
    semester: "4",
    year: "2026",
  });
  const [file, setFile] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [showPreview, setShowPreview] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setStatus("processing");
    await new Promise((r) => setTimeout(r, 2500));
    setStatus("done");
  }

  function handleFile(name: string) {
    setFile(name);
    setShowPreview(true);
    setStatus("idle");
  }

  return (
    <DashboardLayout user={mockAdminUser}>
      <div className="space-y-5 animate-fade-in max-w-4xl">
        <div>
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Upload Results
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Batch upload semester result data for students
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-5">
          {/* Upload Form */}
          <Card className="p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CloudUpload size={15} className="text-indigo-600" /> Upload
              Configuration
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <option value="">Select department</option>
                  {DEPARTMENTS.slice(0, 5).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Semester
                  </label>
                  <select
                    value={form.semester}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, semester: e.target.value }))
                    }
                    className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Year
                  </label>
                  <select
                    value={form.year}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, year: e.target.value }))
                    }
                    className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {["2024", "2025", "2026"].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drop Zone */}
              <div
                onClick={() => handleFile("results_sem4_cs_2026.csv")}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${file ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"}`}
              >
                {file ? (
                  <div>
                    <CheckCircle
                      size={20}
                      className="text-emerald-600 mx-auto mb-1.5"
                    />
                    <p className="text-sm font-medium text-emerald-700">
                      {file}
                    </p>
                    <p className="text-xs text-emerald-500 mt-0.5">
                      Ready to upload
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload
                      size={20}
                      className="text-slate-400 mx-auto mb-1.5"
                    />
                    <p className="text-sm text-slate-600 font-medium">
                      Click to select CSV/Excel
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      CSV format: Roll No, Name, Subject marks
                    </p>
                  </div>
                )}
              </div>

              {status === "processing" && (
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-medium text-indigo-700 mb-2">
                    <span className="w-3.5 h-3.5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                    Processing results...
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-1">
                    <div
                      className="bg-indigo-600 h-1 rounded-full animate-pulse"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
              )}

              {status === "done" && (
                <div className="flex items-start gap-2.5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700">
                  <CheckCircle size={14} className="shrink-0 mt-0.5" />
                  <span>
                    3 results uploaded successfully. 1 entry had errors (see
                    preview).
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={!file || status === "processing"}
                className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <BarChart3 size={14} /> Upload Results
              </button>
            </form>
          </Card>

          {/* Preview */}
          <Card className="p-5 lg:col-span-3">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Users size={15} className="text-indigo-600" /> Data Preview
              {showPreview && (
                <span className="ml-auto text-xs text-slate-400">
                  {MOCK_PREVIEW.length} rows
                </span>
              )}
            </h3>
            {showPreview ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-slate-400">
                      <th className="text-left py-2.5 font-medium">Roll No.</th>
                      <th className="text-left py-2.5 font-medium">Name</th>
                      <th className="text-center py-2.5 font-medium">Sem</th>
                      <th className="text-center py-2.5 font-medium">SGPA</th>
                      <th className="text-center py-2.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {MOCK_PREVIEW.map((r, i) => (
                      <tr
                        key={i}
                        className={`${r.status === "error" ? "bg-red-50" : "hover:bg-slate-50"} transition-colors`}
                      >
                        <td className="py-2.5 font-mono text-xs text-slate-600">
                          {r.rollNumber}
                        </td>
                        <td className="py-2.5 font-medium text-slate-800">
                          {r.name}
                        </td>
                        <td className="py-2.5 text-center text-slate-500">
                          {r.semester}
                        </td>
                        <td className="py-2.5 text-center">
                          {r.sgpa > 0 ? (
                            <span className="font-semibold text-indigo-700">
                              {r.sgpa}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-2.5 text-center">
                          {r.status === "ok" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                              <CheckCircle size={12} /> Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-red-600">
                              <AlertCircle size={12} /> Not found
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 flex gap-3">
                  <Badge
                    label={`${MOCK_PREVIEW.filter((r) => r.status === "ok").length} valid`}
                    variant="success"
                  />
                  <Badge
                    label={`${MOCK_PREVIEW.filter((r) => r.status === "error").length} error`}
                    variant="danger"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                <BarChart3 size={32} className="mb-3 opacity-40" />
                <p className="text-sm">Upload a CSV file to preview data</p>
                <p className="text-xs mt-1">
                  Required columns: Roll No., Name, Subject Marks
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
