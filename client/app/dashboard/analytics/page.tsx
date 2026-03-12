import { ArrowUpRight, LineChart, TrendingUp } from "lucide-react";

import { AcademicTrendChart } from "@/components/charts/academic-trend-chart";
import { MetricCard } from "@/components/ui/metric-card";
import { semesterProgress } from "@/lib/student-data";

export default function AnalyticsPage() {
  const latest = semesterProgress[semesterProgress.length - 1];

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-card p-6">
          <span className="eyebrow">Trend analysis</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            CGPA maintainer and semester momentum
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            This page is built to accept historical CGPA records directly from
            the student routes in the PRD while keeping the visualization and
            explanation layers separate.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Trend label"
              value="Improving"
              detail="Semester averages are increasing in a stable pattern."
              tone="sky"
            />
            <MetricCard
              label="Current best SGPA"
              value={latest.sgpa.toFixed(2)}
              detail={`Latest published term: ${latest.term}.`}
            />
            <MetricCard
              label="Projection signal"
              value="Strong"
              detail="Momentum remains positive for the next result cycle."
              tone="warm"
            />
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <LineChart className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-slate-950">
                Readable insight summary
              </p>
              <p className="text-sm text-slate-500">
                The analytics story should stay understandable, not only visual
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] bg-slate-950 p-6 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/55">
              <TrendingUp className="h-4 w-4" />
              Interpreted trend
            </div>
            <p className="mt-4 text-sm leading-7 text-white/80">
              Recent semesters show consistent improvement, suggesting the
              student has stabilized performance after early fluctuations. This
              explanation block is where the backend can later inject generated
              academic insight without changing the page structure.
            </p>
          </div>
        </article>
      </section>

      <AcademicTrendChart data={semesterProgress} />

      <section className="surface-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Semester breakdown</span>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Term-by-term performance bars
            </h3>
          </div>
          <p className="text-sm text-slate-500">
            CGPA is normalized to a 10-point scale for this visual summary.
          </p>
        </div>
        <div className="mt-8 space-y-5">
          {semesterProgress.map((item) => {
            const cgpaWidth = `${Math.min((item.cgpa / 10) * 100, 100)}%`;
            const sgpaWidth = `${Math.min((item.sgpa / 10) * 100, 100)}%`;

            return (
              <div
                key={item.term}
                className="rounded-[28px] border border-slate-200/80 bg-slate-50/85 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">
                      {item.term}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{item.status}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    Momentum positive
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                      <span>SGPA</span>
                      <span>{item.sgpa.toFixed(2)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
                        style={{ width: sgpaWidth }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                      <span>CGPA</span>
                      <span>{item.cgpa.toFixed(2)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-slate-950 to-slate-700"
                        style={{ width: cgpaWidth }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
