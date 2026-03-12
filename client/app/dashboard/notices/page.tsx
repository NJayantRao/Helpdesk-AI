import { BellRing, CalendarRange, ShieldAlert } from "lucide-react";

import { noticeBoard } from "@/lib/student-data";

export default function NoticesPage() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Unread notices
          </p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            7
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            The student dashboard uses this to keep critical communication
            visible.
          </p>
        </div>
        <div className="surface-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            High-priority items
          </p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            2
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Exam and administrative deadlines should remain impossible to miss.
          </p>
        </div>
        <div className="surface-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Audience scope
          </p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            Mixed
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Some notices are broad while others depend on semester, hostel, or
            department scope.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <BellRing className="h-5 w-5" />
            </span>
            <div>
              <span className="eyebrow">Notice timeline</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Communication feed by priority
              </h2>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {noticeBoard.map((notice) => (
              <div
                key={notice.id}
                className="rounded-[26px] border border-slate-200/80 bg-slate-50/88 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">
                      {notice.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {notice.department} • {notice.timeline}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    {notice.priority}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {notice.summary}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {notice.audience}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="space-y-4">
            <div className="rounded-[28px] bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-3">
                <CalendarRange className="h-5 w-5" />
                <div>
                  <p className="text-lg font-semibold">Notice delivery model</p>
                  <p className="text-sm text-white/65">
                    Dashboard first, digest second, never hidden behind generic
                    feed clutter.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/88 p-5">
              <div className="flex items-center gap-3 text-slate-900">
                <ShieldAlert className="h-5 w-5" />
                <span className="font-semibold">Why this page matters</span>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>
                  The ERP needs a real notice model because many helpdesk
                  answers should point back to official circulars.
                </p>
                <p>
                  Students should always know whether an update is broad
                  information or specifically relevant to their workflow.
                </p>
                <p>
                  The backend can later scope these records by role, semester,
                  department, hostel, or placement status.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
