import type {
  AdminQueueItem,
  DepartmentCoverage,
  DocumentItem,
  IntegrationBinding,
  MetricCard,
  NavItem,
  ResultBatch,
  SettingItem,
  UserAccount,
} from "@/lib/contracts";

export const adminNavigation: NavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    description: "Operational command center across departments.",
    icon: "shield",
    exact: true,
  },
  {
    href: "/admin/documents",
    label: "Document Ops",
    description: "Upload, index, verify, and refresh source material.",
    icon: "file",
  },
  {
    href: "/admin/users",
    label: "User Access",
    description: "Provision accounts, roles, and approval states.",
    icon: "users",
  },
  {
    href: "/admin/results",
    label: "Result Pipeline",
    description: "Upload and validate published academic results.",
    icon: "upload",
  },
  {
    href: "/admin/query-ops",
    label: "Query Ops",
    description: "Monitor escalations, routing, and answer quality.",
    icon: "bot",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    description: "Rate limits, language defaults, and integration notes.",
    icon: "settings",
  },
];

export const adminMetrics: MetricCard[] = [
  {
    label: "Documents indexed",
    value: "418",
    detail:
      "Active retrieval corpus across admission, academic, exam, and hostel departments.",
  },
  {
    label: "Pending user actions",
    value: "29",
    detail:
      "Profile approvals, password resets, and onboarding requests are awaiting staff review.",
  },
  {
    label: "Result batches this cycle",
    value: "14",
    detail:
      "Uploads span Semester 4 to Semester 8 with one schema cleanup still pending.",
  },
  {
    label: "Escalations open",
    value: "11",
    detail:
      "Support requests that need manual office review due to missing or stale source material.",
  },
];

export const adminQueue: AdminQueueItem[] = [
  {
    id: "queue-1",
    title: "Re-index hostel handbook after fee revision",
    owner: "Hostel Administration",
    status: "In review",
    eta: "ETA: 1 day",
  },
  {
    id: "queue-2",
    title: "Bulk onboard 2026 lateral entry students",
    owner: "Academic Office",
    status: "Scheduled",
    eta: "ETA: tomorrow",
  },
  {
    id: "queue-3",
    title: "Verify Semester 6 result schema before publish",
    owner: "Examination Cell",
    status: "Blocked",
    eta: "Waiting on source cleanup",
  },
  {
    id: "queue-4",
    title: "Refresh admission FAQ prompts before counseling round",
    owner: "Admission Cell",
    status: "Ready",
    eta: "Can publish today",
  },
];

export const departmentHealth: DepartmentCoverage[] = [
  {
    id: "dept-1",
    name: "Admission Cell",
    coverage: "94%",
    readiness: "Healthy",
    note: "Public-facing content is current and mapped to the public chatbot flows.",
  },
  {
    id: "dept-2",
    name: "Examination Cell",
    coverage: "82%",
    readiness: "Watch",
    note: "Result notices are current, but revaluation annexures still need one refresh.",
  },
  {
    id: "dept-3",
    name: "Hostel Administration",
    coverage: "76%",
    readiness: "Watch",
    note: "Renewal circular exists, but one fee verification attachment is pending.",
  },
  {
    id: "dept-4",
    name: "School of Computing",
    coverage: "97%",
    readiness: "Healthy",
    note: "Syllabus and project review documents align with the latest academic cycle.",
  },
];

export const adminDocuments: DocumentItem[] = [
  {
    id: "admin-doc-1",
    title: "Admission brochure 2026 master file",
    department: "Admission Cell",
    type: "Policy PDF",
    visibility: "Public",
    updated: "Today",
    status: "Indexed",
    summary: "Primary source for counseling FAQs and public discovery pages.",
    tags: ["admissions", "master", "public"],
  },
  {
    id: "admin-doc-2",
    title: "Semester 6 result publication circular",
    department: "Examination Cell",
    type: "Circular",
    visibility: "Authenticated",
    updated: "Yesterday",
    status: "Indexed",
    summary:
      "Published result notice already available to the student workspace.",
    tags: ["results", "publish", "students"],
  },
  {
    id: "admin-doc-3",
    title: "Hostel fee revision annexure",
    department: "Hostel Administration",
    type: "Attachment",
    visibility: "Authenticated",
    updated: "2 days ago",
    status: "Awaiting verification",
    summary:
      "Blocking fully grounded hostel answers until verification completes.",
    tags: ["hostel", "verification", "fees"],
  },
  {
    id: "admin-doc-4",
    title: "Student handbook 2026",
    department: "Academic Office",
    type: "Guide",
    visibility: "Public",
    updated: "1 week ago",
    status: "Refresh scheduled",
    summary:
      "Needs one terminology update before the new student session begins.",
    tags: ["handbook", "public", "refresh"],
  },
];

export const adminUsers: UserAccount[] = [
  {
    id: "user-1",
    name: "Ananya Sharma",
    role: "Student",
    department: "School of Computing",
    status: "Active",
    lastActive: "12 minutes ago",
  },
  {
    id: "user-2",
    name: "Ritika Verma",
    role: "Admin",
    department: "Admission Cell",
    status: "Active",
    lastActive: "1 hour ago",
  },
  {
    id: "user-3",
    name: "Rahul Das",
    role: "Student",
    department: "Mechanical Engineering",
    status: "Pending approval",
    lastActive: "Today",
  },
  {
    id: "user-4",
    name: "Sanjay Nair",
    role: "System",
    department: "Operations",
    status: "Protected",
    lastActive: "Yesterday",
  },
];

export const resultBatches: ResultBatch[] = [
  {
    id: "batch-1",
    semester: "Semester 6",
    department: "School of Computing",
    uploadedBy: "Examination Cell",
    uploadedAt: "10 March 2026, 09:15",
    status: "Published",
    note: "Student-facing cards and result circular are already live.",
  },
  {
    id: "batch-2",
    semester: "Semester 4",
    department: "Civil Engineering",
    uploadedBy: "Examination Cell",
    uploadedAt: "9 March 2026, 18:20",
    status: "Schema review",
    note: "One grade code mismatch still needs correction before release.",
  },
  {
    id: "batch-3",
    semester: "Semester 8",
    department: "Electronics",
    uploadedBy: "Academic Office",
    uploadedAt: "8 March 2026, 14:10",
    status: "Queued",
    note: "Waiting for approval from the controller of examinations.",
  },
];

export const escalationQueue: AdminQueueItem[] = [
  {
    id: "esc-1",
    title: "Public admission chatbot missing updated lateral-entry seat data",
    owner: "Admission Cell",
    status: "Needs document refresh",
    eta: "Resolve before counseling round",
  },
  {
    id: "esc-2",
    title: "Hostel renewal answer returned stale fee details",
    owner: "Hostel Administration",
    status: "Source under verification",
    eta: "Pending annexure approval",
  },
  {
    id: "esc-3",
    title: "Student requested manual clarification on backlog conversion rules",
    owner: "Examination Cell",
    status: "Officer follow-up",
    eta: "Reply within 24 hours",
  },
];

export const adminSettings: SettingItem[] = [
  {
    title: "Authenticated helpdesk rate limit",
    value: "25 queries / user / hour",
    detail:
      "Prepared as a frontend settings surface so backend configuration can map here later.",
  },
  {
    title: "Public chatbot rate limit",
    value: "10 queries / IP / hour",
    detail:
      "The landing page already communicates that public usage is more tightly constrained.",
  },
  {
    title: "Default response language",
    value: "Respect profile preference",
    detail:
      "If no preference exists, the UI falls back to English and exposes a selector.",
  },
  {
    title: "Document freshness warning",
    value: "Show warning after 14 days without verification",
    detail:
      "Visible in the UI so stale content is obvious before it becomes a support issue.",
  },
];

export const integrationBindings: IntegrationBinding[] = [
  {
    surface: "Login and session shell",
    endpoint: "POST /api/v1/auth/login",
    method: "POST",
    note: "Replace demo entry buttons with JWT login submission and token storage.",
  },
  {
    surface: "Student overview and notices",
    endpoint:
      "GET /api/v1/students/dashboard + GET /api/v1/users/notifications",
    method: "GET",
    note: "Dashboard metrics, cards, and notice feed are already grouped for a single page load.",
  },
  {
    surface: "Result and analytics pages",
    endpoint:
      "GET /api/v1/students/results + GET /api/v1/students/cgpa/history",
    method: "GET",
    note: "Result summaries and charts use separate sections so the backend can fetch independently.",
  },
  {
    surface: "Helpdesk workspace",
    endpoint: "POST /api/v1/ai/query + GET /api/v1/ai/query-history",
    method: "POST / GET",
    note: "Prompt composer, citations, and route indicators already map to structured and semantic response states.",
  },
  {
    surface: "Admin document operations",
    endpoint: "POST /api/v1/documents/upload + GET /api/v1/documents",
    method: "POST / GET",
    note: "Document cards expose status, visibility, and department ownership fields expected from the backend.",
  },
  {
    surface: "Admin user access",
    endpoint: "GET /api/v1/admin/users + PATCH /api/v1/admin/users/:id",
    method: "GET / PATCH",
    note: "User table and approval cues are ready for pagination or server-side filtering later.",
  },
];
