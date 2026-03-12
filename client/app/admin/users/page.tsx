import { Shield, UserCog } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { adminUsers } from "@/lib/admin-data";

export default function AdminUsersPage() {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <UserCog className="h-5 w-5" />
            </span>
            <div>
              <span className="eyebrow">User access</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Role and approval controls
              </h2>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[
              "Students should only see personal records, notices, and authenticated helpdesk surfaces.",
              "Admins manage document, result, and user operations but not system-only controls.",
              "System users remain protected and clearly separated in the frontend.",
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
          <div className="rounded-[28px] bg-slate-950 p-5 text-white">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5" />
              <div>
                <p className="text-lg font-semibold">Why this screen matters</p>
                <p className="text-sm text-white/65">
                  The PRD includes role-based access and admin provisioning from
                  the start.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/80">
              This page is built as a dedicated admin route so user-management
              APIs can plug in cleanly, rather than being treated as a settings
              afterthought.
            </p>
          </div>
        </article>
      </section>

      <DataTable
        caption="Current user access state"
        rows={adminUsers}
        columns={[
          { key: "name", header: "User" },
          { key: "role", header: "Role" },
          { key: "department", header: "Department" },
          {
            key: "status",
            header: "Status",
            render: (value) => (
              <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                {String(value)}
              </span>
            ),
          },
          { key: "lastActive", header: "Last active" },
        ]}
      />
    </>
  );
}
