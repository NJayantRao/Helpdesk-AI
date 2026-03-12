import { DatabaseZap, UploadCloud } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { resultBatches } from "@/lib/admin-data";

export default function AdminResultsPage() {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <UploadCloud className="h-5 w-5" />
            </span>
            <div>
              <span className="eyebrow">Result pipeline</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Upload and publish academic result batches
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              "Validate source schema before publishing marks.",
              "Associate the batch with semester and department.",
              "Publish student-safe summaries only after approval.",
              "Pair release states with examination circular visibility.",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-[22px] border border-slate-200/80 bg-slate-50/88 px-4 py-4 text-sm leading-6 text-slate-700"
              >
                <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="rounded-[28px] bg-slate-950 p-5 text-white">
            <div className="flex items-center gap-3">
              <DatabaseZap className="h-5 w-5" />
              <div>
                <p className="text-lg font-semibold">Backend fit</p>
                <p className="text-sm text-white/65">
                  This UI expects clear published, review, queued, and blocked
                  states.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/80">
              The student-facing results page and this admin result pipeline are
              intentionally separated so uploads and publications can move at
              different speeds without confusing the user experience.
            </p>
          </div>
        </article>
      </section>

      <DataTable
        caption="Recent result batches"
        rows={resultBatches}
        columns={[
          { key: "semester", header: "Semester" },
          { key: "department", header: "Department" },
          { key: "uploadedBy", header: "Uploaded by" },
          { key: "uploadedAt", header: "Uploaded at" },
          {
            key: "status",
            header: "Status",
            render: (value) => (
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                {String(value)}
              </span>
            ),
          },
          { key: "note", header: "Operational note" },
        ]}
      />
    </>
  );
}
