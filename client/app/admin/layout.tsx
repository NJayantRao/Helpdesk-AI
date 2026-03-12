import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { adminNavigation } from "@/lib/admin-data";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <DashboardShell
      role="Admin"
      title="Admin operations"
      subtitle="Manage document ingestion, user access, result publishing, and AI quality controls from one operational frontend."
      items={adminNavigation}
    >
      {children}
    </DashboardShell>
  );
}
