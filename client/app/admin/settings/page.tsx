import { Link2, Settings2 } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { adminSettings, integrationBindings } from "@/lib/admin-data";

export default function AdminSettingsPage() {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <Settings2 className="h-5 w-5" />
            </span>
            <div>
              <span className="eyebrow">Settings</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Policy, rate-limit, and language defaults
              </h2>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {adminSettings.map((setting) => (
              <div
                key={setting.title}
                className="rounded-[24px] border border-slate-200/80 bg-slate-50/88 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-base font-semibold text-slate-900">
                    {setting.title}
                  </p>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    {setting.value}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {setting.detail}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="rounded-[28px] bg-slate-950 p-5 text-white">
            <div className="flex items-center gap-3">
              <Link2 className="h-5 w-5" />
              <div>
                <p className="text-lg font-semibold">
                  Integration contract map
                </p>
                <p className="text-sm text-white/65">
                  A backend partner should be able to wire against visible
                  surfaces, not guess them.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/80">
              This table gives you a clean frontend-to-endpoint map for the main
              user-facing surfaces already built in the client.
            </p>
          </div>
        </article>
      </section>

      <DataTable
        caption="Frontend to backend integration bindings"
        rows={integrationBindings.map((binding) => ({
          id: binding.surface,
          ...binding,
        }))}
        columns={[
          { key: "surface", header: "Surface" },
          { key: "endpoint", header: "Endpoint" },
          { key: "method", header: "Method" },
          { key: "note", header: "Integration note" },
        ]}
      />
    </>
  );
}
