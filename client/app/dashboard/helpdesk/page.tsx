import { FileStack, ShieldCheck } from "lucide-react";

import { HelpdeskPlayground } from "@/components/helpdesk-playground";
import { studentHelpdeskExamples } from "@/lib/student-data";

export default function HelpdeskPage() {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-card p-6">
          <span className="eyebrow">Authenticated chatbot</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Multilingual helpdesk with clear routing and source cues
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            The PRD calls for department-aware answers, language preference
            handling, and a split between structured ERP data and semantic
            retrieval. This screen is built around that exact behavior.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              "Structured path for marks, results, and authenticated records",
              "Semantic retrieval for notices, circulars, and policies",
              "Language preference passed into the AI answer flow",
              "Fallback messaging when source context is unavailable",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-slate-200/80 bg-slate-50/85 px-4 py-4 text-sm leading-6 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="grid gap-4">
            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/85 p-5">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-slate-950 p-3 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-slate-950">
                    Rate-limit model
                  </p>
                  <p className="text-sm text-slate-500">
                    Authenticated users are treated differently from the public
                    chatbot.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-white/12 p-3 text-white">
                  <FileStack className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-semibold">Source grounding</p>
                  <p className="text-sm text-white/65">
                    Document freshness directly affects answer quality.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/78">
                This frontend is already prepared for citations, route labels,
                and retrieval freshness states once the AI endpoints are
                connected.
              </p>
            </div>
          </div>
        </article>
      </section>

      <HelpdeskPlayground
        examples={studentHelpdeskExamples}
        title="Authenticated prompt lab"
      />
    </>
  );
}
