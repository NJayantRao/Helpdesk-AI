import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { requireAdminSession } from "@/lib/auth";
import { adminNavigation } from "@/lib/admin-data";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireAdminSession();

  return (
    <DashboardShell
      role={session.role}
      title="Admin operations"
      subtitle="Manage documents, user access, result publishing, and daily operations from one workspace."
      items={adminNavigation}
    >
      {children}
    </DashboardShell>
  );
}
