"use client";
import React, { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Button } from "@/components/ui";
import { mockAdminUser } from "@/lib/utils";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadResult {
  totalRows: number;
  inserted: number;
  skipped: number;
  failed: number;
  errors: { row: number; reason: string }[];
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadTemplate() {
  const csv = "studentId,subjectCode,semester,marks\n";
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "results_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminResultsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [errorsOpen, setErrorsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.name.match(/\.(csv|xlsx)$/i)) {
      alert("Only .csv and .xlsx files are supported.");
      return;
    }
    setFile(f);
    setUploadResult(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <DashboardLayout user={mockAdminUser}>
      <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
        {/* Header */}
        <div>
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Upload Results
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload a CSV or Excel file to bulk import student results
          </p>
        </div>

        {/* Template Download */}
        <Card className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                <FileText size={17} className="text-indigo-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  Download CSV Template
                </div>
                <div className="text-xs text-slate-400">
                  Required columns: studentId, subjectCode, semester, marks
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={downloadTemplate}>
              Download Template
            </Button>
          </div>
        </Card>

        {/* Upload Zone */}
        <Card className="p-8">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {file ? (
            /* File Selected */
            <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={18} className="text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">
                  {file.name}
                </div>
                <div className="text-xs text-slate-400">
                  {formatBytes(file.size)}
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X size={15} className="text-slate-500" />
              </button>
            </div>
          ) : (
            /* Drop Zone */
            <div
              className={cn(
                "border-2 border-dashed rounded-2xl py-12 flex flex-col items-center justify-center cursor-pointer text-center transition-all",
                dragging
                  ? "border-indigo-400 bg-indigo-50/50"
                  : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={32} className="text-slate-300 mb-4" />
              <p className="text-sm font-medium text-slate-700">
                Drag &amp; drop your file here
              </p>
              <p className="text-xs text-slate-400 my-2">or</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                Browse file
              </Button>
              <p className="text-xs text-slate-400 mt-3">
                Supports: .csv, .xlsx
              </p>
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-6">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center"
              disabled={!file || uploading}
              loading={uploading}
              onClick={() => {
                // TODO: call POST /api/v1/result/upload
              }}
            >
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload Results"}
            </Button>
          </div>
        </Card>

        {/* Simulate button for testing */}
        <div className="flex justify-end">
          <button
            onClick={() =>
              setUploadResult({
                totalRows: 30,
                inserted: 27,
                skipped: 1,
                failed: 2,
                errors: [
                  { row: 5, reason: "Subject 'CS999' not found" },
                  {
                    row: 12,
                    reason: "Student not enrolled in 'CS301'",
                  },
                ],
              })
            }
            className="text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Simulate Upload Response
          </button>
        </div>

        {/* Upload Summary */}
        {uploadResult && (
          <Card className="p-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle size={18} className="text-emerald-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Upload Summary
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                {
                  label: "Total",
                  value: uploadResult.totalRows,
                  bg: "bg-slate-100",
                  text: "text-slate-800",
                },
                {
                  label: "Inserted",
                  value: uploadResult.inserted,
                  bg: "bg-emerald-50",
                  text: "text-emerald-700",
                },
                {
                  label: "Skipped",
                  value: uploadResult.skipped,
                  bg: "bg-amber-50",
                  text: "text-amber-700",
                },
                {
                  label: "Failed",
                  value: uploadResult.failed,
                  bg: "bg-red-50",
                  text: "text-red-700",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`${s.bg} rounded-xl px-4 py-2.5 text-center`}
                >
                  <div className={`text-2xl font-bold ${s.text}`}>
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {uploadResult.errors.length > 0 && (
              <div>
                <button
                  onClick={() => setErrorsOpen(!errorsOpen)}
                  className="flex items-center gap-1.5 text-sm text-red-600 font-medium mb-3"
                >
                  {errorsOpen ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                  {errorsOpen ? "Hide" : "Show"} {uploadResult.errors.length}{" "}
                  failed rows
                </button>
                {errorsOpen && (
                  <div className="overflow-hidden rounded-xl border border-red-100">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-red-50">
                          <th className="text-left px-4 py-2.5 font-semibold text-red-700">
                            Row
                          </th>
                          <th className="text-left px-4 py-2.5 font-semibold text-red-700">
                            Reason
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadResult.errors.map((err, i) => (
                          <tr
                            key={i}
                            className={i % 2 === 0 ? "bg-red-50/50" : ""}
                          >
                            <td className="px-4 py-2.5 font-mono text-red-600">
                              #{err.row}
                            </td>
                            <td className="px-4 py-2.5 text-red-700">
                              {err.reason}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
