import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { requireStudentSession } from "@/lib/auth";
import { studentNavigation } from "@/lib/student-data";

export default async function StudentDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireStudentSession();

  return (
    <DashboardShell
      role={session.role}
      title="Student workspace"
      subtitle="Track results, notices, documents, preferences, and support tools in one place."
      items={studentNavigation}
    >
      {children}
    </DashboardShell>
  );
}
