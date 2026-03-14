import { adminMetrics, departmentHealth } from "@/lib/admin-data";
import type { SessionRole } from "@/lib/auth";
import { publicNotices } from "@/lib/public-data";
import {
  noticeBoard,
  studentOverviewMetrics,
  studentProfile,
} from "@/lib/student-data";

export type SupportMode = "public" | "student" | "admin";

export type SupportReply = {
  id: string;
  prompt: string;
  answer: string;
  keywords: string[];
  href?: string;
  hrefLabel?: string;
};

const publicReplies: SupportReply[] = [
  {
    id: "public-admission-docs",
    prompt: "What documents are needed for admission?",
    answer:
      "For admission, keep your class 10 and 12 mark sheets, entrance rank proof, photo ID, recent photographs, transfer certificate, and any category documents ready. Check the latest admission notice before final submission.",
    keywords: [
      "admission",
      "documents",
      "document",
      "mark sheet",
      "certificate",
    ],
    href: "/#admissions",
    hrefLabel: "View admission info",
  },
  {
    id: "public-hostel-fees",
    prompt: "Where can I check hostel fees?",
    answer:
      "Hostel fee updates are available in the public notice section. You can review the latest fee revision and timeline there before logging in.",
    keywords: ["hostel", "fees", "fee", "renewal", "accommodation"],
    href: "/#notices",
    hrefLabel: "Open notices",
  },
  {
    id: "public-notices",
    prompt: "How do I see the latest notices?",
    answer:
      "The landing page already shows the latest public notices. Open the notices section to review admissions, campus services, and event updates.",
    keywords: [
      "notice",
      "notices",
      "latest",
      "update",
      "updates",
      "announcement",
    ],
    href: "/#notices",
    hrefLabel: "See notices",
  },
  {
    id: "public-sign-in",
    prompt: "How do I see my personal records?",
    answer:
      "Personal records such as results, profile details, and private documents are available only after sign-in. Please use the login page to continue.",
    keywords: [
      "result",
      "results",
      "my",
      "personal",
      "records",
      "login",
      "sign in",
    ],
    href: "/login",
    hrefLabel: "Go to login",
  },
];

const studentReplies: SupportReply[] = [
  {
    id: "student-cgpa",
    prompt: "What is my current CGPA?",
    answer: `Your current CGPA is ${studentOverviewMetrics[0]?.value ?? "8.46"}. You can open the results page for more detail on semester records and course grades.`,
    keywords: ["cgpa", "sgpa", "grade", "grades", "result", "results", "marks"],
    href: "/dashboard/results",
    hrefLabel: "Open results",
  },
  {
    id: "student-notices",
    prompt: "Do I have unread notices?",
    answer: `You currently have ${studentOverviewMetrics[2]?.value ?? "7"} unread notices. The notices page will show the latest updates from the exam cell, hostel, and department.`,
    keywords: ["notice", "notices", "unread", "announcement", "updates"],
    href: "/dashboard/notices",
    hrefLabel: "Open notices",
  },
  {
    id: "student-hostel",
    prompt: "What is the hostel renewal update?",
    answer:
      noticeBoard[1]?.summary ??
      "The hostel renewal update is available in your notices section.",
    keywords: ["hostel", "renewal", "room", "fees", "payment"],
    href: "/dashboard/notices",
    hrefLabel: "View hostel notice",
  },
  {
    id: "student-language",
    prompt: "What is my preferred language?",
    answer: `Your current preferred language is ${studentProfile.language}. You can update profile details and account settings from the profile page.`,
    keywords: ["language", "profile", "settings", "preference", "preferences"],
    href: "/dashboard/profile",
    hrefLabel: "Open profile",
  },
];

const adminReplies: SupportReply[] = [
  {
    id: "admin-documents",
    prompt: "How many documents are indexed?",
    answer: `${adminMetrics[0]?.value ?? "418"} documents are currently indexed. Use document operations to review uploads, verification status, and refresh needs.`,
    keywords: [
      "documents",
      "document",
      "indexed",
      "upload",
      "uploads",
      "verification",
    ],
    href: "/admin/documents",
    hrefLabel: "Open document ops",
  },
  {
    id: "admin-users",
    prompt: "How many user actions are pending?",
    answer: `${adminMetrics[1]?.value ?? "29"} user actions are currently pending. You can review approvals and account status from the user access page.`,
    keywords: ["users", "user", "pending", "approval", "approvals", "access"],
    href: "/admin/users",
    hrefLabel: "Open user access",
  },
  {
    id: "admin-results",
    prompt: "How many result batches are in this cycle?",
    answer: `${adminMetrics[2]?.value ?? "14"} result batches are in the current cycle. The result pipeline page will show publish status and review progress.`,
    keywords: ["result", "results", "batches", "pipeline", "publish", "schema"],
    href: "/admin/results",
    hrefLabel: "Open result pipeline",
  },
  {
    id: "admin-coverage",
    prompt: "Which area needs attention?",
    answer:
      departmentHealth[2]?.note ??
      "Review department coverage to see which source areas still need attention.",
    keywords: [
      "coverage",
      "health",
      "attention",
      "department",
      "source",
      "stale",
    ],
    href: "/admin/query-ops",
    hrefLabel: "Open query ops",
  },
];

const fallbackReplies: Record<SupportMode, SupportReply> = {
  public: {
    id: "public-fallback",
    prompt: "Public support",
    answer:
      "I can help with admissions, public notices, hostel information, and sign-in guidance. For personal records, please log in first.",
    keywords: [],
    href: "/login",
    hrefLabel: "Go to login",
  },
  student: {
    id: "student-fallback",
    prompt: "Student support",
    answer:
      "I can help with results, notices, hostel updates, and profile settings. Try asking about your CGPA, unread notices, or hostel renewal.",
    keywords: [],
    href: "/dashboard",
    hrefLabel: "Open dashboard",
  },
  admin: {
    id: "admin-fallback",
    prompt: "Admin support",
    answer:
      "I can help with documents, user access, result batches, and operational status. Try asking about pending approvals, indexed documents, or result batches.",
    keywords: [],
    href: "/admin",
    hrefLabel: "Open admin workspace",
  },
};

const quickPrompts: Record<SupportMode, string[]> = {
  public: [
    "Admission documents",
    "Hostel fees",
    "Latest notices",
    "How do I sign in?",
  ],
  student: [
    "My current CGPA",
    "Unread notices",
    "Hostel renewal",
    "Profile language",
  ],
  admin: [
    "Indexed documents",
    "Pending user actions",
    "Result batches",
    "Coverage status",
  ],
};

const welcomeMessages: Record<SupportMode, string> = {
  public:
    "Hi, I can help with admissions, public notices, hostel information, and login guidance.",
  student:
    "Hi, I can help with your results, notices, hostel updates, and profile settings.",
  admin:
    "Hi, I can help with documents, user access, result batches, and admin operations.",
};

function getEntries(mode: SupportMode) {
  if (mode === "student") {
    return studentReplies;
  }

  if (mode === "admin") {
    return adminReplies;
  }

  return publicReplies;
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((part) => part.length > 1);
}

function scoreReply(reply: SupportReply, query: string) {
  const normalized = query.toLowerCase();
  let score = 0;

  for (const keyword of reply.keywords) {
    if (normalized.includes(keyword.toLowerCase())) {
      score += keyword.includes(" ") ? 3 : 2;
    }
  }

  for (const token of tokenize(reply.prompt)) {
    if (normalized.includes(token)) {
      score += 1;
    }
  }

  return score;
}

export function getSupportMode(role?: SessionRole | null): SupportMode {
  if (role === "Student") {
    return "student";
  }

  if (role === "Admin" || role === "System") {
    return "admin";
  }

  return "public";
}

export function getSupportQuickPrompts(mode: SupportMode) {
  return quickPrompts[mode];
}

export function getSupportWelcomeMessage(mode: SupportMode) {
  return welcomeMessages[mode];
}

export function getSupportReply(mode: SupportMode, query: string) {
  const replies = getEntries(mode);
  let bestReply: SupportReply | null = null;
  let bestScore = 0;

  for (const reply of replies) {
    const score = scoreReply(reply, query);

    if (score > bestScore) {
      bestScore = score;
      bestReply = reply;
    }
  }

  return bestReply ?? fallbackReplies[mode];
}

export function getPublicNoticeSummary() {
  return publicNotices.slice(0, 3);
}
