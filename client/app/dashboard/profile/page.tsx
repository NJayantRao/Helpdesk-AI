import { Globe2, IdCard, LockKeyhole, UserRound } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { studentPreferences, studentProfile } from "@/lib/student-data";

export default function ProfilePage() {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <span className="eyebrow">Profile</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Student identity and access context
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Name", studentProfile.name],
              ["Registration", studentProfile.registrationNumber],
              ["Program", studentProfile.program],
              ["Semester", studentProfile.semester],
              ["Department", studentProfile.department],
              ["Advisor", studentProfile.advisor],
              ["Email", studentProfile.email],
              ["Phone", studentProfile.phone],
              ["Hostel status", studentProfile.hostelStatus],
              ["Guardian", studentProfile.guardian],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[24px] border border-slate-200/80 bg-slate-50/88 px-4 py-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {label}
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="grid gap-4">
            <div className="rounded-[28px] bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-3">
                <Globe2 className="h-5 w-5" />
                <div>
                  <p className="text-lg font-semibold">Language preference</p>
                  <p className="text-sm text-white/65">
                    This setting shapes authenticated helpdesk answers and
                    future notification copy.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/88 p-5">
              <div className="flex items-center gap-3 text-slate-900">
                <LockKeyhole className="h-5 w-5" />
                <span className="font-semibold">Session design</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                This screen is ready for backend session controls later:
                password change, logout, token revocation status, and device
                history can plug in here without structural changes.
              </p>
            </div>
            <div className="rounded-[28px] border border-dashed border-slate-300/80 bg-white/72 p-5 text-sm leading-7 text-slate-600">
              The profile page deliberately keeps identity, preferences, and
              security surfaces separate so the backend can wire
              `/api/v1/users/profile` and `/api/v1/auth/change-password`
              independently.
            </div>
          </div>
        </article>
      </section>

      <DataTable
        caption="Preference surface"
        rows={studentPreferences.map((item) => ({ id: item.title, ...item }))}
        columns={[
          { key: "title", header: "Preference" },
          { key: "value", header: "Current value" },
          { key: "detail", header: "Integration note" },
        ]}
      />

      <section className="surface-card p-6">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-slate-950 p-3 text-white">
            <IdCard className="h-5 w-5" />
          </span>
          <div>
            <span className="eyebrow">Backend fit</span>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Profile state is already broken into clean contracts
            </h3>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Once your partner exposes real profile and session endpoints, this
          page can switch from mock values to live data with minimal component
          churn because the identity card, preference table, and security notes
          are already separate.
        </p>
      </section>
    </>
  );
}
