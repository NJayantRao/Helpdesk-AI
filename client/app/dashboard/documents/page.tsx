import { FileStack, Globe, ShieldCheck, UploadCloud } from "lucide-react";

import { DocumentExplorer } from "@/components/document-explorer";
import { studentDocuments } from "@/lib/student-data";

export default function DocumentsPage() {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
        <article className="surface-card p-6">
          <span className="eyebrow">Document hub</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Institutional documents that power grounded answers
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Students should be able to understand what content is available,
            what is authenticated, and what is still waiting for verification
            before trusting an AI answer.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[26px] border border-slate-200/80 bg-slate-50/85 p-5">
              <div className="flex items-center gap-3 text-slate-900">
                <FileStack className="h-5 w-5" />
                <span className="font-semibold">Searchable corpus</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Documents should be scannable before a user opens or queries
                them.
              </p>
            </div>
            <div className="rounded-[26px] border border-slate-200/80 bg-slate-50/85 p-5">
              <div className="flex items-center gap-3 text-slate-900">
                <Globe className="h-5 w-5" />
                <span className="font-semibold">Public vs private</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Visibility determines whether the content supports public or
                authenticated chatbot flows.
              </p>
            </div>
            <div className="rounded-[26px] border border-slate-200/80 bg-slate-50/85 p-5">
              <div className="flex items-center gap-3 text-slate-900">
                <UploadCloud className="h-5 w-5" />
                <span className="font-semibold">Freshness cues</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Verification and refresh states help prevent stale retrieval
                answers.
              </p>
            </div>
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-slate-950">
                What students should infer
              </p>
              <p className="text-sm text-slate-500">
                This is not an admin page, but it still needs transparency
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[
              "Indexed means the source is available for retrieval-backed answers.",
              "Awaiting verification means the content exists but may not yet be safe to trust fully.",
              "Draft refresh needed means the answer should show freshness caution or avoid that source.",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-[24px] border border-slate-200/80 bg-white/88 px-4 py-4 text-sm leading-6 text-slate-700"
              >
                <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </article>
      </section>

      <DocumentExplorer
        title="Document access and retrieval readiness"
        description="This frontend is ready to swap mock data for `/api/v1/documents` later without changing the user-facing information architecture."
        documents={studentDocuments}
      />
    </>
  );
}
