import { ShieldCheck, UploadCloud } from "lucide-react";

import { DocumentExplorer } from "@/components/document-explorer";
import { adminDocuments } from "@/lib/admin-data";

export default function AdminDocumentsPage() {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
        <article className="surface-card p-6">
          <span className="eyebrow">Document ops</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Upload, verify, and refresh retrieval sources
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            The admin document surface is built around lifecycle clarity so
            backend ingestion, indexing, and deletion flows can attach directly
            to visible states.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              "Upload source file with department ownership.",
              "Chunk and index for retrieval.",
              "Verify access scope before exposing answers.",
              "Refresh or purge stale vectors when files change.",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-[22px] border border-slate-200/80 bg-slate-50/88 px-4 py-4 text-sm leading-6 text-slate-700"
              >
                <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="space-y-4">
            <div className="rounded-[28px] bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-3">
                <UploadCloud className="h-5 w-5" />
                <div>
                  <p className="text-lg font-semibold">Upload staging area</p>
                  <p className="text-sm text-white/65">
                    The backend can later attach drag-and-drop or multipart
                    upload here.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/88 p-5">
              <div className="flex items-center gap-3 text-slate-900">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-semibold">Verification rule</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                The UI is explicit about whether a source is indexed, waiting
                for verification, or scheduled for refresh. That keeps the
                helpdesk from feeling magical or untrustworthy.
              </p>
            </div>
          </div>
        </article>
      </section>

      <DocumentExplorer
        title="Document inventory and lifecycle readiness"
        description="Backend document endpoints can replace these mock cards directly because ownership, visibility, and status are already modeled."
        documents={adminDocuments}
      />
    </>
  );
}
