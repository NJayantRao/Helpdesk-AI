"use client";

import { useDeferredValue, useState } from "react";
import {
  Bot,
  FileStack,
  Languages,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type { HelpdeskExample } from "@/lib/contracts";
import { cn } from "@/lib/utils";

type HelpdeskPlaygroundProps = {
  examples: HelpdeskExample[];
  title?: string;
  description?: string;
  layout?: "split" | "portal";
  searchPlaceholder?: string;
};

export function HelpdeskPlayground({
  examples,
  title = "Prompt switcher",
  description = "Preview how the frontend can explain routing, citations, and multilingual behavior before real APIs are connected.",
  layout = "split",
  searchPlaceholder,
}: HelpdeskPlaygroundProps) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(
    examples[0]?.id ?? null
  );
  const deferredQuery = useDeferredValue(query);
  const inputPlaceholder =
    searchPlaceholder ??
    (layout === "portal"
      ? "Ask about admissions, fees, notices, or exams"
      : "Filter prompts by category, language, or route");

  const filteredExamples = examples.filter((example) => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) {
      return true;
    }

    return [example.category, example.prompt, example.route, example.language]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const active =
    filteredExamples.find((example) => example.id === activeId) ??
    filteredExamples[0] ??
    null;

  if (!active) {
    return (
      <div className="surface-card p-6">
        <p className="text-lg font-semibold text-slate-950">
          Helpdesk preview unavailable
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Connect this surface to your AI query endpoint or add mock prompts to
          preview the question flow.
        </p>
      </div>
    );
  }

  if (layout === "portal") {
    return (
      <div className="surface-card p-6 sm:p-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto inline-flex rounded-2xl bg-slate-950 p-3 text-white">
            <Bot className="h-5 w-5" />
          </span>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {title}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-[28px] border border-slate-200/80 bg-white/92 px-5 py-4 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.55)]">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={inputPlaceholder}
              className="border-none bg-transparent p-0 shadow-none focus:border-none focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {filteredExamples.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() => setActiveId(example.id)}
              className={cn(
                "w-full rounded-[28px] border p-5 text-left transition",
                active.id === example.id
                  ? "border-slate-950 bg-slate-950 text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.86)]"
                  : "border-slate-200/80 bg-white/88 text-slate-700 hover:border-slate-950 hover:bg-white"
              )}
            >
              <span
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
                  active.id === example.id
                    ? "bg-white/12 text-white/78"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {example.category}
              </span>
              <p
                className={cn(
                  "mt-4 text-base font-semibold leading-7",
                  active.id === example.id ? "text-white" : "text-slate-900"
                )}
              >
                {example.prompt}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-[0_28px_60px_-28px_rgba(15,23,42,0.92)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/78">
                {active.category}
              </span>
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/78">
                {active.language}
              </span>
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/78">
                {active.confidence}
              </span>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
              Selected question
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
              {active.prompt}
            </p>

            <div className="mt-6 rounded-[24px] bg-white/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                Sample answer
              </p>
              <p className="mt-3 text-sm leading-7 text-white/84">
                {active.answer}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Languages className="h-4 w-4" />
                Response language
              </div>
              <p className="mt-3 text-base font-semibold text-slate-950">
                {active.language}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Answers stay readable for the selected language without changing
                the underlying university guidance.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Sparkles className="h-4 w-4" />
                Answer source
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {active.route}
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <FileStack className="h-4 w-4" />
                References
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {active.citations.map((citation) => (
                  <span
                    key={citation}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
                  >
                    {citation}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ShieldCheck className="h-4 w-4" />
                Access
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {active.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="surface-card p-6">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-slate-950 p-3 text-white">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-semibold text-slate-950">{title}</p>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-slate-200/80 bg-white/90 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={inputPlaceholder}
              className="border-none bg-transparent p-0 shadow-none focus:border-none focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {filteredExamples.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() => setActiveId(example.id)}
              className={cn(
                "w-full rounded-[24px] border p-4 text-left transition",
                active.id === example.id
                  ? "border-slate-950 bg-slate-950 text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.86)]"
                  : "border-slate-200/80 bg-white/80 text-slate-700 hover:border-slate-950"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
                    active.id === example.id
                      ? "bg-white/12 text-white/78"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  {example.category}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {example.sourceType}
                </span>
              </div>
              <p
                className={cn(
                  "mt-3 text-sm leading-6",
                  active.id === example.id ? "text-white" : "text-slate-800"
                )}
              >
                {example.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="surface-card p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-800">
            {active.category}
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">
            {active.language}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
            {active.confidence}
          </span>
        </div>

        <div className="mt-5 rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Selected prompt
          </p>
          <p className="mt-3 text-lg font-medium leading-8 text-slate-950">
            {active.prompt}
          </p>
        </div>

        <div className="mt-4 rounded-[28px] bg-slate-950 p-5 text-white shadow-[0_24px_40px_-24px_rgba(15,23,42,0.9)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
            Assistant preview
          </p>
          <p className="mt-3 text-sm leading-7 text-white/80">
            {active.answer}
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200/80 bg-white/85 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Route className="h-4 w-4" />
              Routing logic
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {active.route}
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200/80 bg-white/85 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Languages className="h-4 w-4" />
              Output language
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The response preserves {active.language.toLowerCase()} output
              while keeping the answer grounded in the same source path.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.88fr]">
          <div className="rounded-[24px] border border-slate-200/80 bg-white/85 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sparkles className="h-4 w-4" />
              Citation plan
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {active.citations.map((citation) => (
                <span
                  key={citation}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
                >
                  {citation}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-slate-200/80 bg-white/85 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ShieldCheck className="h-4 w-4" />
              Status
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {active.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
