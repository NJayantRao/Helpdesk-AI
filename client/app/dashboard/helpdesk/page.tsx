import {
  ArrowRight,
  MessageCircleMore,
  NotebookTabs,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const supportCards = [
  {
    title: "Ask from any page",
    description:
      "Use the support bubble in the bottom corner whenever you need a quick answer.",
    icon: MessageCircleMore,
  },
  {
    title: "Common topics",
    description:
      "Get quick help with results, notices, hostel updates, and profile settings.",
    icon: NotebookTabs,
  },
  {
    title: "Account help",
    description:
      "Update profile details and language settings from your profile page when needed.",
    icon: UserRound,
  },
];

export default function HelpdeskPage() {
  return (
    <section className="space-y-6">
      <article className="surface-card p-6 sm:p-8">
        <span className="eyebrow">Support</span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Quick help is available across the portal
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          You do not need a separate support flow to ask simple questions. Use
          the support bubble from any page when you need help.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {supportCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-[26px] border border-slate-200/80 bg-slate-50/85 p-5"
              >
                <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/dashboard/results" size="lg">
            Open results
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/dashboard/notices" variant="secondary" size="lg">
            Open notices
          </Button>
          <Button href="/dashboard/profile" variant="soft" size="lg">
            Open profile
          </Button>
        </div>
      </article>
    </section>
  );
}
