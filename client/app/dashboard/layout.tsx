import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { studentNavigation } from "@/lib/student-data";

export default function StudentDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <DashboardShell
      role="Student"
      title="Student workspace"
      subtitle="Track results, notices, documents, preferences, and AI support in one frontend-ready workspace built around the ERP PRD."
      items={studentNavigation}
    >
      {children}
    </DashboardShell>
  );
}
