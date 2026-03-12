import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";

import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { integrationBindings } from "@/lib/admin-data";

const roleEntries = [
  {
    title: "Student access",
    detail:
      "Results, analytics, notices, documents, and the authenticated AI helpdesk.",
    href: "/dashboard",
    icon: UserRound,
  },
  {
    title: "Admin access",
    detail:
      "Documents, users, result pipeline, and query operations for institutional teams.",
    href: "/admin",
    icon: ShieldCheck,
  },
];

export default function LoginPage() {
  return (
    <main className="section-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="surface-card flex flex-col justify-between overflow-hidden p-8 sm:p-10 lg:p-12">
          <div>
            <Brand href="/" />
            <div className="mt-10 max-w-2xl space-y-6">
              <span className="eyebrow">Session entry</span>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Sign in to the university ERP and multilingual helpdesk.
              </h1>
              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                This frontend is built so real authentication can replace the
                mock controls later without changing the flow or the screen
                structure.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4">
            {roleEntries.map((entry) => {
              const Icon = entry.icon;

              return (
                <Button
                  key={entry.title}
                  href={entry.href}
                  variant="secondary"
                  className="!flex !justify-start rounded-[28px] !px-5 !py-5 text-left"
                >
                  <span className="flex items-start gap-4">
                    <span className="rounded-2xl bg-slate-950 p-3 text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="block">
                      <span className="block text-lg font-semibold text-slate-950">
                        {entry.title}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-slate-600">
                        {entry.detail}
                      </span>
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>
        </section>

        <section className="surface-card p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <div>
              <span className="eyebrow">Demo login</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                API-ready sign-in shell
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            <Field
              label="University email"
              hint="Later maps to `POST /api/v1/auth/login`."
            >
              <input
                defaultValue="ananya.sharma@campus.edu"
                aria-label="University email"
              />
            </Field>
            <Field
              label="Password"
              hint="JWT session logic can be wired here without changing the layout."
            >
              <input
                type="password"
                defaultValue="secure-password"
                aria-label="Password"
              />
            </Field>
            <Field
              label="Preferred response language"
              hint="The profile language can flow straight into helpdesk requests."
            >
              <select
                defaultValue="English"
                aria-label="Preferred response language"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Bengali</option>
                <option>Tamil</option>
                <option>Telugu</option>
              </select>
            </Field>
            <Field
              label="Role preview"
              hint="For now this is a frontend switch; later the backend should resolve the role from the token."
            >
              <select defaultValue="Student" aria-label="Role preview">
                <option>Student</option>
                <option>Admin</option>
                <option>System</option>
              </select>
            </Field>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button href="/dashboard" size="lg" className="justify-between">
              Continue as student
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href="/admin"
              variant="secondary"
              size="lg"
              className="justify-between"
            >
              Continue as admin
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_24px_40px_-24px_rgba(15,23,42,0.88)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">
              Integration map
            </p>
            <div className="mt-4 space-y-3">
              {integrationBindings.slice(0, 3).map((binding) => (
                <div
                  key={binding.surface}
                  className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-4"
                >
                  <p className="text-sm font-semibold">{binding.surface}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    {binding.method} • {binding.endpoint}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    {binding.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
