"use client";

import { useDeferredValue, useState } from "react";
import { FileStack, Filter, Search } from "lucide-react";

import type { DocumentItem } from "@/lib/contracts";
import { cn } from "@/lib/utils";

type DocumentExplorerProps = {
  title: string;
  description: string;
  documents: DocumentItem[];
};

const visibilityFilters = ["All", "Public", "Authenticated"] as const;

export function DocumentExplorer({
  title,
  description,
  documents,
}: DocumentExplorerProps) {
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] =
    useState<(typeof visibilityFilters)[number]>("All");
  const deferredQuery = useDeferredValue(query);

  const filteredDocuments = documents.filter((document) => {
    const matchesVisibility =
      visibility === "All" || document.visibility === visibility;
    const q = deferredQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      [
        document.title,
        document.department,
        document.type,
        document.status,
        ...document.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);

    return matchesVisibility && matchesQuery;
  });

  return (
    <section className="surface-card p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Document workspace</span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200/80 bg-white/85 px-4 py-3 text-sm text-slate-600">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Filter className="h-4 w-4" />
            Visibility filter
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {visibilityFilters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setVisibility(item)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition",
                  visibility === item
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-white/90 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, department, tag, or status"
            className="border-none bg-transparent p-0 shadow-none focus:border-none"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {filteredDocuments.map((document) => (
          <article
            key={document.id}
            className="rounded-[26px] border border-slate-200/80 bg-white/88 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-slate-950 p-3 text-white">
                  <FileStack className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-slate-950">
                    {document.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    {document.department} / {document.type}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                {document.status}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {document.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                {document.visibility}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                {document.updated}
              </span>
              {document.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-slate-300/80 bg-slate-50/80 p-6 text-sm leading-7 text-slate-600">
          No documents match the current filters. Try adjusting your search or
          visibility selection.
        </div>
      ) : null}
    </section>
  );
}
