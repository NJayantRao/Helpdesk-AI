import {
  ArrowRight,
  Bot,
  ChartNoAxesColumn,
  FileStack,
  Languages,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { HelpdeskPlayground } from "@/components/helpdesk-playground";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import {
  admissionSteps,
  featureHighlights,
  platformStats,
  publicFaqs,
  publicHelpdeskExamples,
  publicNotices,
  queryFlowCards,
  roadmapMilestones,
  roleCards,
} from "@/lib/mock-data";

const moduleIcons = [Bot, ChartNoAxesColumn, ShieldCheck];
const roleIcons = [Languages, FileStack, ShieldCheck];

export default function HomePage() {
  return (
    <main className="pb-20">
      <SiteHeader />

      <section id="overview" className="section-shell pt-8 sm:pt-12 lg:pt-16">
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="hero-halo relative overflow-hidden rounded-[40px] border border-white/70 p-8 shadow-[0_34px_90px_-48px_rgba(15,23,42,0.44)] sm:p-10 lg:p-12">
            <div className="absolute inset-y-0 right-0 hidden w-[46%] subtle-grid opacity-55 lg:block" />
            <div className="absolute -left-16 top-12 h-36 w-36 rounded-full bg-sky-300/28 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-amber-200/30 blur-3xl" />
            <div className="relative max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">PRD-aligned frontend</span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-800">
                  Backend-ready surfaces
                </span>
              </div>
              <h1 className="mt-8 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                A university ERP frontend built for records, retrieval, and
                multilingual support.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Public discovery, authenticated student workflows, and admin
                operations now live in one cohesive UI so backend integration
                can happen without another redesign cycle.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/login" size="lg">
                  Open login flow
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/dashboard" variant="secondary" size="lg">
                  Student workspace
                </Button>
                <Button href="/admin" variant="soft" size="lg">
                  Admin operations
                </Button>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {platformStats.map((stat, index) => (
                  <MetricCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    detail={stat.detail}
                    tone={
                      index === 1 ? "sky" : index === 3 ? "warm" : "default"
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="surface-card p-6">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-slate-950 p-3 text-white">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Frontend promise
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    Clear source boundaries before API work lands
                  </h2>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  "Structured academic answers are visually separated from document-grounded answers.",
                  "Public and authenticated users see different access boundaries instead of one generic chat surface.",
                  "Document freshness, visibility, and verification states are exposed in the UI from day one.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 px-4 py-4 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Public notice pulse
              </p>
              <div className="mt-4 space-y-3">
                {publicNotices.map((notice) => (
                  <article
                    key={notice.id}
                    className="rounded-[24px] border border-slate-200/80 bg-white/88 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {notice.category}
                      </span>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
                        {notice.updatedAt}
                      </span>
                    </div>
                    <p className="mt-3 text-base font-semibold text-slate-900">
                      {notice.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {notice.summary}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="admissions" className="section-shell mt-16">
        <SectionHeading
          eyebrow="Admissions"
          title="Public discovery is treated like a real product lane, not leftover marketing copy."
          description="The admissions surface is designed for clarity first: eligibility, documents, timelines, and AI-guided FAQ support."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {admissionSteps.map((step, index) => (
            <article key={step.title} className="surface-card p-6">
              <span className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Step {index + 1}
              </span>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                {step.title}
              </h3>
              <p className="mt-3 text-sm font-medium text-slate-500">
                {step.owner} • {step.timeline}
              </p>
              <div className="mt-5 space-y-3">
                {step.details.map((detail) => (
                  <div
                    key={detail}
                    className="rounded-[22px] border border-slate-200/80 bg-slate-50/85 px-4 py-3 text-sm leading-6 text-slate-700"
                  >
                    {detail}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="routing" className="section-shell mt-16">
        <SectionHeading
          eyebrow="AI Routing"
          title="The frontend explains where answers come from before the user has to ask."
          description="This product needs to separate personal ERP data from policy and notice retrieval. The UI now makes that architecture visible."
        />
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <div className="grid gap-4">
            {queryFlowCards.map((flow) => (
              <article key={flow.title} className="surface-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {flow.audience}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                      {flow.title}
                    </h3>
                  </div>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    <Route className="mr-1 inline h-3.5 w-3.5" />
                    Path
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {flow.summary}
                </p>
                <div className="mt-5 rounded-[24px] bg-slate-950 px-4 py-4 text-sm leading-7 text-white/78">
                  {flow.route}
                </div>
                <div className="mt-5 space-y-3">
                  {flow.points.map((point) => (
                    <div
                      key={point}
                      className="rounded-[22px] border border-slate-200/80 bg-slate-50/85 px-4 py-3 text-sm leading-6 text-slate-700"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <HelpdeskPlayground
            examples={publicHelpdeskExamples}
            title="Public chatbot preview"
            description="This public lane already communicates query type, language handling, and rate-limit context without pretending the backend is finished."
          />
        </div>
      </section>

      <section id="workspaces" className="section-shell mt-16">
        <SectionHeading
          eyebrow="Workspaces"
          title="Each role gets a different surface with different density, permissions, and expectations."
          description="The product is organized around distinct workflows, not one overloaded dashboard trying to serve everyone."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featureHighlights.map((feature, index) => {
            const Icon = moduleIcons[index];

            return (
              <article key={feature.title} className="surface-card p-6">
                <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-5 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {feature.status}
                </span>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
                <div className="mt-5 space-y-3">
                  {feature.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {roleCards.map((role, index) => {
            const Icon = roleIcons[index];

            return (
              <article key={role.role} className="surface-card p-6">
                <span className="inline-flex rounded-2xl bg-slate-100 p-3 text-slate-900">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                  {role.role}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {role.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {role.responsibilities.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
          <article className="surface-card p-6 sm:p-8">
            <span className="eyebrow">FAQ orientation</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              The public helpdesk still needs obvious constraints.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              A good frontend does not hide uncertainty. It shows when content
              is public, when login is required, and when the answer depends on
              the latest institutional document.
            </p>
            <div className="mt-6 space-y-3">
              {publicFaqs.map((faq) => (
                <div
                  key={faq}
                  className="rounded-[24px] border border-slate-200/80 bg-slate-50/85 px-4 py-4 text-sm leading-6 text-slate-700"
                >
                  {faq}
                </div>
              ))}
            </div>
          </article>
          <article className="surface-card p-6 sm:p-8">
            <span className="eyebrow">Launch points</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Jump directly into the frontend lanes.
            </h2>
            <div className="mt-6 grid gap-4">
              <Button href="/login" size="lg" className="justify-between">
                Demo login and session shell
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href="/dashboard"
                variant="secondary"
                size="lg"
                className="justify-between"
              >
                Student workspace
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href="/admin"
                variant="soft"
                size="lg"
                className="justify-between"
              >
                Admin operations console
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section id="roadmap" className="section-shell mt-16">
        <SectionHeading
          eyebrow="Roadmap"
          title="The frontend is ready for the MVP now and flexible enough for later phases."
          description="Nothing here blocks the later AI-service split or the placement-intelligence expansion described in the PRD."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {roadmapMilestones.map((milestone, index) => (
            <MetricCard
              key={milestone.phase}
              label={milestone.phase}
              value={milestone.focus}
              detail={milestone.detail}
              tone={index === 1 ? "dark" : "default"}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
