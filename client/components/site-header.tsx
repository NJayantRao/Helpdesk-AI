import Link from "next/link";

import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "#overview", label: "Overview" },
  { href: "#admissions", label: "Admissions" },
  { href: "#routing", label: "AI Routing" },
  { href: "#workspaces", label: "Workspaces" },
  { href: "#roadmap", label: "Roadmap" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-[rgba(248,245,239,0.78)] backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-6">
        <Brand href="/" compact />
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            href="/dashboard"
            variant="secondary"
            size="sm"
            className="hidden md:inline-flex"
          >
            Student workspace
          </Button>
          <Button
            href="/admin"
            variant="soft"
            size="sm"
            className="hidden md:inline-flex"
          >
            Admin ops
          </Button>
          <Button href="/login" size="md">
            Launch login
          </Button>
        </div>
      </div>
    </header>
  );
}
