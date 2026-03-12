import { FileCheck2, GraduationCap, ReceiptText } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { MetricCard } from "@/components/ui/metric-card";
import { latestCourseResults, semesterResults } from "@/lib/student-data";

export default function ResultsPage() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Latest term"
          value="Semester 6"
          detail="Current published result cycle for the student workspace."
          tone="dark"
        />
        <MetricCard
          label="Latest SGPA"
          value="8.90"
          detail="Minor project and analytics-heavy courses drove the strongest term so far."
          tone="sky"
        />
        <MetricCard
          label="Result state"
          value="Published"
          detail="This frontend can switch to pending or withheld states without page redesign."
          tone="warm"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <span className="eyebrow">Semester cards</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Published result history
              </h2>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {semesterResults.map((result) => (
              <div
                key={result.id}
                className="rounded-[26px] border border-slate-200/80 bg-slate-50/88 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">
                      {result.term}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {result.publishedAt}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    {result.status}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[20px] bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      SGPA
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {result.sgpa.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-[20px] bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      CGPA
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {result.cgpa.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-[20px] bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Credits earned
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {result.creditsEarned}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <ReceiptText className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-slate-950">
                Result workflow hints
              </p>
              <p className="text-sm text-slate-500">
                Frontend states the backend can map cleanly later
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[
              "Published: results are visible and can be paired with examination circulars.",
              "Pending review: cards should show waiting states without exposing incomplete marks.",
              "Withheld: a student-safe explanation should appear instead of blank data.",
              "Revaluation open: the circular and action CTA should sit next to the affected term.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-slate-200/80 bg-white/88 px-4 py-4 text-sm leading-6 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <DataTable
        caption="Latest semester course grades"
        rows={latestCourseResults}
        columns={[
          { key: "code", header: "Code" },
          { key: "title", header: "Course" },
          { key: "credits", header: "Credits" },
          { key: "grade", header: "Grade" },
          { key: "internal", header: "Internal" },
          { key: "external", header: "External" },
          {
            key: "status",
            header: "Status",
            render: (value) => (
              <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                {String(value)}
              </span>
            ),
          },
        ]}
      />

      <section className="surface-card p-6">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-slate-950 p-3 text-white">
            <FileCheck2 className="h-5 w-5" />
          </span>
          <div>
            <span className="eyebrow">Integration note</span>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Built to accept backend result states directly
            </h3>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          This page separates semester summaries from course-level tables so
          your backend partner can return aggregate result cards and detailed
          course records independently without changing the visual structure.
        </p>
      </section>
    </>
  );
}
