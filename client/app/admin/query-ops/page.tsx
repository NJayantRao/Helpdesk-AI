import { Bot, MessageSquareWarning, ShieldCheck } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { escalationQueue } from "@/lib/admin-data";

export default function AdminQueryOpsPage() {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <span className="eyebrow">Query operations</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Monitor routing quality and escalation causes
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              "Track when answers should come from structured ERP records.",
              "Detect stale or unverifiable document-backed responses.",
              "Expose rate-limit and fallback states clearly to users.",
              "Keep public and authenticated helpdesk traffic logically separate.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-slate-200/80 bg-slate-50/88 px-4 py-4 text-sm leading-6 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="grid gap-4">
            <div className="rounded-[28px] bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-3">
                <MessageSquareWarning className="h-5 w-5" />
                <div>
                  <p className="text-lg font-semibold">Escalation model</p>
                  <p className="text-sm text-white/65">
                    If the source is missing, stale, or unclear, the UI should
                    say so.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/88 p-5">
              <div className="flex items-center gap-3 text-slate-900">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-semibold">Why this route exists</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Query ops deserves its own screen because retrieval quality,
                rate limits, and escalation handling are product-critical in
                this ERP, not hidden backend concerns.
              </p>
            </div>
          </div>
        </article>
      </section>

      <DataTable
        caption="Open escalations"
        rows={escalationQueue}
        columns={[
          { key: "title", header: "Issue" },
          { key: "owner", header: "Owner" },
          {
            key: "status",
            header: "Status",
            render: (value) => (
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
                {String(value)}
              </span>
            ),
          },
          { key: "eta", header: "Response window" },
        ]}
      />
    </>
  );
}
