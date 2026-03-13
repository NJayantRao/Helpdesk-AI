import type {
  CourseRecord,
  DocumentItem,
  HelpdeskExample,
  MetricCard,
  NavItem,
  NoticeItem,
  PreferenceItem,
  RiskItem,
  SemesterProgress,
  SemesterResult,
  StudentProfile,
  TaskItem,
} from "@/lib/contracts";

export const studentNavigation: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    description: "Snapshot of progress, notices, and immediate actions.",
    icon: "home",
    exact: true,
  },
  {
    href: "/dashboard/results",
    label: "Results",
    description: "Published semester outcomes and course grades.",
    icon: "file",
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    description: "Trend analysis, momentum, and CGPA projections.",
    icon: "chart",
  },
  {
    href: "/dashboard/notices",
    label: "Notices",
    description: "Department and university communication timeline.",
    icon: "bell",
    badge: "7",
  },
  {
    href: "/dashboard/documents",
    label: "Documents",
    description: "Policies, circulars, syllabi, and retrieval sources.",
    icon: "file",
  },
  {
    href: "/dashboard/helpdesk",
    label: "Support",
    description: "Ask questions or get quick guidance when needed.",
    icon: "bot",
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    description: "Identity, preference, and session configuration.",
    icon: "user",
  },
];

export const studentOverviewMetrics: MetricCard[] = [
  {
    label: "Current CGPA",
    value: "8.46",
    detail: "Upward academic momentum across the last three semesters.",
  },
  {
    label: "Credits earned",
    value: "132 / 160",
    detail: "On-track progress with one elective slot still pending.",
  },
  {
    label: "Unread notices",
    value: "7",
    detail:
      "Exam cell, hostel, and department reminders need review this week.",
  },
  {
    label: "Support response",
    value: "91%",
    detail:
      "Most common support questions are resolved quickly from one place.",
  },
];

export const semesterProgress: SemesterProgress[] = [
  {
    term: "Semester 2",
    sgpa: 7.4,
    cgpa: 7.28,
    status: "Foundation recovery after first-year adjustment",
  },
  {
    term: "Semester 3",
    sgpa: 7.8,
    cgpa: 7.52,
    status: "Backlog cleared and performance stabilized",
  },
  {
    term: "Semester 4",
    sgpa: 8.2,
    cgpa: 7.78,
    status: "Stronger lab performance lifted the average",
  },
  {
    term: "Semester 5",
    sgpa: 8.6,
    cgpa: 8.05,
    status: "Electives and project work improved consistency",
  },
  {
    term: "Semester 6",
    sgpa: 8.9,
    cgpa: 8.46,
    status: "Current trend remains clearly positive",
  },
];

export const semesterResults: SemesterResult[] = [
  {
    id: "sem-6",
    term: "Semester 6",
    publishedAt: "Published on 10 March 2026",
    sgpa: 8.9,
    cgpa: 8.46,
    creditsEarned: 24,
    status: "Published",
  },
  {
    id: "sem-5",
    term: "Semester 5",
    publishedAt: "Published on 16 December 2025",
    sgpa: 8.6,
    cgpa: 8.05,
    creditsEarned: 22,
    status: "Published",
  },
  {
    id: "sem-4",
    term: "Semester 4",
    publishedAt: "Published on 24 July 2025",
    sgpa: 8.2,
    cgpa: 7.78,
    creditsEarned: 22,
    status: "Published",
  },
];

export const latestCourseResults: CourseRecord[] = [
  {
    id: "course-1",
    code: "CSE601",
    title: "Machine Learning",
    credits: 4,
    grade: "A+",
    internal: 28,
    external: 61,
    status: "Cleared",
  },
  {
    id: "course-2",
    code: "CSE602",
    title: "Compiler Design",
    credits: 4,
    grade: "A",
    internal: 26,
    external: 56,
    status: "Cleared",
  },
  {
    id: "course-3",
    code: "CSE603",
    title: "Cloud Computing",
    credits: 3,
    grade: "A",
    internal: 27,
    external: 51,
    status: "Cleared",
  },
  {
    id: "course-4",
    code: "CSE604",
    title: "Machine Learning Lab",
    credits: 2,
    grade: "B+",
    internal: 29,
    external: 39,
    status: "Cleared",
  },
  {
    id: "course-5",
    code: "CSE690",
    title: "Minor Project II",
    credits: 4,
    grade: "A+",
    internal: 30,
    external: 64,
    status: "Cleared",
  },
];

export const noticeBoard: NoticeItem[] = [
  {
    id: "notice-1",
    title: "Exam form correction window closes on Friday",
    department: "Examination Cell",
    timeline: "Closes in 2 days",
    priority: "High",
    summary:
      "Verify your subject selection and fee receipt before the correction window ends.",
    audience: "Students with active exam registration",
  },
  {
    id: "notice-2",
    title: "Hostel renewal schedule published for next session",
    department: "Hostel Administration",
    timeline: "Updated 3 hours ago",
    priority: "Medium",
    summary:
      "Room preference, payment deadline, and warden verification steps are now available.",
    audience: "Residents and renewal applicants",
  },
  {
    id: "notice-3",
    title: "AI and Data Systems project review panel announced",
    department: "Department Office",
    timeline: "Updated today",
    priority: "Medium",
    summary:
      "Panel schedule, room allocation, and rubric publication have been finalized.",
    audience: "Semester 6 project groups",
  },
  {
    id: "notice-4",
    title:
      "Placement preparation orientation opens for pre-final year students",
    department: "Training and Placement",
    timeline: "Starts next week",
    priority: "Low",
    summary:
      "Resume review slots and company-readiness workshops open Monday morning.",
    audience: "Pre-final and final year students",
  },
];

export const studentTasks: TaskItem[] = [
  {
    id: "task-1",
    title: "Submit internship NOC request",
    due: "Due in 3 days",
    owner: "Department Office",
    status: "Waiting for student upload",
  },
  {
    id: "task-2",
    title: "Review revaluation policy before results update",
    due: "Today",
    owner: "Examination Cell",
    status: "Action recommended",
  },
  {
    id: "task-3",
    title: "Confirm hostel renewal preference",
    due: "Due next week",
    owner: "Hostel Administration",
    status: "Not started",
  },
];

export const studentRiskItems: RiskItem[] = [
  {
    title: "Attendance watch: Machine Learning Lab",
    detail:
      "Attendance is below the preferred threshold and needs one more week of regular attendance to recover comfortably.",
    owner: "Course instructor",
  },
  {
    title: "Document freshness watch: hostel renewal",
    detail:
      "The hostel renewal circular is visible, but one supporting annexure is still marked pending verification in the admin workspace.",
    owner: "Hostel Administration",
  },
];

export const studentDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    title: "B.Tech admission brochure 2026",
    department: "Admission Cell",
    type: "Policy PDF",
    visibility: "Public",
    updated: "Today",
    status: "Indexed",
    summary:
      "Master admission guidance used by the public chatbot and counseling pages.",
    tags: ["admissions", "eligibility", "counseling"],
  },
  {
    id: "doc-2",
    title: "Semester 6 result publication circular",
    department: "Examination Cell",
    type: "Circular",
    visibility: "Authenticated",
    updated: "Yesterday",
    status: "Indexed",
    summary:
      "Publication timeline, revaluation note, and response desk contact details.",
    tags: ["results", "revaluation", "exam-cell"],
  },
  {
    id: "doc-3",
    title: "Hostel renewal and fee schedule",
    department: "Hostel Administration",
    type: "Notice",
    visibility: "Authenticated",
    updated: "2 days ago",
    status: "Awaiting verification",
    summary:
      "Fee revision, room confirmation flow, and occupancy deadlines for the new term.",
    tags: ["hostel", "fees", "renewal"],
  },
  {
    id: "doc-4",
    title: "Machine Learning syllabus revision",
    department: "School of Computing",
    type: "Syllabus",
    visibility: "Public",
    updated: "4 days ago",
    status: "Indexed",
    summary:
      "Updated course outcomes, weightage split, and reference materials.",
    tags: ["syllabus", "academics", "ml"],
  },
  {
    id: "doc-5",
    title: "Placement drive preparation kit",
    department: "Training and Placement",
    type: "Guide",
    visibility: "Authenticated",
    updated: "1 week ago",
    status: "Draft refresh needed",
    summary:
      "Resume guidelines, aptitude preparation, and interview readiness notes for upcoming drives.",
    tags: ["placement", "guide", "career"],
  },
];

export const studentHelpdeskExamples: HelpdeskExample[] = [
  {
    id: "student-cgpa",
    category: "Academics",
    prompt: "Show my current CGPA and explain whether I am improving.",
    answer:
      "Your current CGPA is 8.46. The last three semesters show stable SGPA growth, which means the academic trend is improving rather than fluctuating. Because this answer depends on your personal records, it belongs to the structured ERP path.",
    language: "English",
    route: "Structured academic data",
    sourceType: "Structured",
    confidence: "Exact record match",
    citations: ["Student CGPA history", "Semester result service"],
    status: "Authenticated lane",
  },
  {
    id: "student-revaluation",
    category: "Examination",
    prompt: "When is the revaluation deadline for the latest result?",
    answer:
      "The latest circular states that revaluation applications open after the published result release and close within the announced response window. The frontend should surface the deadline directly from the examination circular and pair it with the authenticated result card for context.",
    language: "English",
    route: "Semantic document retrieval",
    sourceType: "Semantic",
    confidence: "Grounded in examination circular",
    citations: [
      "Semester 6 result publication circular",
      "Revaluation handbook",
    ],
    status: "Authenticated lane",
  },
  {
    id: "student-hostel",
    category: "Hostel",
    prompt: "Can you explain my hostel renewal process in Hindi?",
    answer:
      "Yes. The answer can be returned in Hindi while still citing the hostel renewal circular. The language preference comes from your profile, while the actual guidance comes from the authenticated document retrieval path.",
    language: "Hindi",
    route: "Hybrid: preference plus document retrieval",
    sourceType: "Hybrid",
    confidence: "Preference-aware answer",
    citations: [
      "Hostel renewal and fee schedule",
      "Student language preference",
    ],
    status: "Authenticated lane",
  },
];

export const studentProfile: StudentProfile = {
  name: "Ananya Sharma",
  registrationNumber: "CSE-22-041",
  program: "B.Tech in Computer Science and Engineering",
  semester: "Semester 6",
  department: "School of Computing",
  email: "ananya.sharma@campus.edu",
  phone: "+91 98765 43210",
  guardian: "Rohit Sharma",
  language: "English",
  hostelStatus: "Resident - Block C",
  advisor: "Dr. Meera Singh",
};

export const studentPreferences: PreferenceItem[] = [
  {
    title: "Preferred language",
    value: "English",
    detail:
      "Used to shape authenticated helpdesk responses without changing the source of truth.",
  },
  {
    title: "Notice delivery mode",
    value: "Dashboard + email digest",
    detail:
      "The frontend is ready for notification settings once the backend notification service is available.",
  },
  {
    title: "Session security",
    value: "Single active browser session",
    detail:
      "JWT logout and future blacklist support can plug into this surface later.",
  },
];
