import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { loginAction } from "@/app/auth-actions";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { getDemoSession } from "@/lib/auth";

const roleEntries = [
  {
    title: "Student access",
    detail:
      "Results, notices, documents, profile settings, and the student workspace.",
    icon: UserRound,
  },
  {
    title: "Admin access",
    detail: "Documents, users, results, and operational tools for staff teams.",
    icon: ShieldCheck,
  },
];

export default async function LoginPage() {
  const session = await getDemoSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="section-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="surface-card flex flex-col justify-between overflow-hidden p-8 sm:p-10 lg:p-12">
          <div>
            <Brand href="/" />
            <div className="mt-10 max-w-2xl space-y-6">
              <span className="eyebrow">Session entry</span>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Sign in to the university portal.
              </h1>
              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                Choose a role, enter your details, and continue to your
                workspace.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4">
            {roleEntries.map((entry) => {
              const Icon = entry.icon;

              return (
                <article
                  key={entry.title}
                  className="rounded-[28px] border border-white/80 bg-white/84 px-5 py-5 shadow-[0_24px_54px_-40px_rgba(15,23,42,0.46)]"
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
                </article>
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
              <span className="eyebrow">Sign in</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Choose how you want to continue
              </h2>
            </div>
          </div>

          <form action={loginAction}>
            <div className="mt-8 grid gap-5">
              <Field
                label="University email"
                hint="Use your campus email address."
              >
                <input
                  name="email"
                  defaultValue="ananya.sharma@campus.edu"
                  aria-label="University email"
                />
              </Field>
              <Field label="Password" hint="Enter your password to continue.">
                <input
                  type="password"
                  defaultValue="secure-password"
                  aria-label="Password"
                />
              </Field>
              <Field
                label="Preferred response language"
                hint="Choose the language you prefer to use in the portal."
              >
                <select
                  name="language"
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
                hint="Choose the role you want to enter."
              >
                <select
                  name="role"
                  defaultValue="Student"
                  aria-label="Role preview"
                >
                  <option>Student</option>
                  <option>Admin</option>
                  <option>System</option>
                </select>
              </Field>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button
                type="submit"
                name="destination"
                value="landing"
                size="lg"
                className="justify-between"
              >
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                name="destination"
                value="workspace"
                variant="secondary"
                size="lg"
                className="justify-between"
              >
                Open workspace directly
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="mt-8 rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_24px_40px_-24px_rgba(15,23,42,0.88)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">
              Quick note
            </p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-white/78">
              <p>
                Student sign-in opens results, notices, documents, and profile
                tools.
              </p>
              <p>
                Admin sign-in opens user access, documents, results, and staff
                operations.
              </p>
              <p>
                If you need help anywhere in the app, use the support bubble in
                the bottom corner.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
