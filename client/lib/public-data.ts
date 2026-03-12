import type {
  AdmissionStep,
  FeatureCard,
  HelpdeskExample,
  MetricCard,
  Milestone,
  PublicNotice,
  QueryFlowCard,
  RoleCard,
} from "@/lib/contracts";

export const platformStats: MetricCard[] = [
  {
    label: "Departments in scope",
    value: "12",
    detail:
      "Admissions, academics, exam cell, hostels, placement, and campus services share one product surface.",
  },
  {
    label: "Language-ready surfaces",
    value: "6",
    detail:
      "Preference-aware UI states are prepared for English, Hindi, Bengali, Tamil, Telugu, and Marathi.",
  },
  {
    label: "Indexed knowledge targets",
    value: "420",
    detail:
      "Document lifecycle states stay visible before backend wiring so answer quality is understandable.",
  },
  {
    label: "Public helpdesk goal",
    value: "24 x 7",
    detail:
      "The frontend already communicates public rate limits and fallback behavior.",
  },
];

export const featureHighlights: FeatureCard[] = [
  {
    title: "Admission and discovery layer",
    description:
      "Public visitors can browse admission guidance, notices, and ask broad university questions without authentication.",
    status: "Public lane ready",
    items: [
      "Admission journey timeline with submission checkpoints",
      "Public notices with visibility cues",
      "Public chatbot preview with rate-limit messaging",
    ],
  },
  {
    title: "Student execution workspace",
    description:
      "Authenticated students move between results, analytics, notices, documents, and the helpdesk without losing context.",
    status: "Student lane ready",
    items: [
      "Semester result and course grade views",
      "CGPA trend analysis with momentum framing",
      "Preference-aware AI helpdesk states",
    ],
  },
  {
    title: "Admin operations console",
    description:
      "Staff can monitor ingestion, user access, result pipelines, and query escalations from one admin surface.",
    status: "Admin lane ready",
    items: [
      "Document ingestion lifecycle and verification tracking",
      "User provisioning and approval status",
      "Result upload batches and helpdesk escalation queue",
    ],
  },
];

export const roleCards: RoleCard[] = [
  {
    role: "Public users",
    summary:
      "Visitors need clarity on admissions, general university information, and public notices without internal ERP complexity.",
    tone: "public",
    responsibilities: [
      "Browse admissions",
      "Check public notices",
      "Ask general AI questions",
    ],
  },
  {
    role: "Students",
    summary:
      "Students need fast access to personal records, notices, academic analytics, and support answers grounded in live policy material.",
    tone: "student",
    responsibilities: [
      "View results",
      "Track CGPA trend",
      "Use authenticated helpdesk",
    ],
  },
  {
    role: "Admin and system",
    summary:
      "Administrative users manage the content, permissions, and quality controls that make the assistant trustworthy.",
    tone: "admin",
    responsibilities: [
      "Upload documents",
      "Manage users",
      "Maintain result and AI operations",
    ],
  },
];

export const queryFlowCards: QueryFlowCard[] = [
  {
    title: "Structured path",
    summary:
      "Student-specific records come from the ERP API so values stay exact and deterministic.",
    route: "Frontend -> Node API -> PostgreSQL -> Student response",
    audience: "Authenticated",
    points: [
      "Current CGPA, semester marks, and result history",
      "Profile information and personalized dashboard cards",
      "Best for audit-friendly academic answers",
    ],
  },
  {
    title: "Semantic path",
    summary:
      "Policy, circular, and notice questions rely on retrieval so answers stay grounded in document text rather than hardcoded copy.",
    route:
      "Frontend -> Node API -> RAG layer -> Qdrant -> LLM -> Grounded answer",
    audience: "Public + Authenticated",
    points: [
      "Admission requirements, examination circulars, and hostel guidance",
      "Language preference can shape the answer without changing the source of truth",
      "Needs freshness, visibility, and fallback cues in the UI",
    ],
  },
];

export const roadmapMilestones: Milestone[] = [
  {
    phase: "Phase 1",
    focus: "ERP + helpdesk MVP",
    detail:
      "Public discovery, student workspace, admin operations, and document visibility states.",
  },
  {
    phase: "Phase 2",
    focus: "Dedicated AI service split",
    detail:
      "Frontend stays stable while the Node API delegates heavier RAG workloads to a separate service.",
  },
  {
    phase: "Phase 3",
    focus: "Placement intelligence",
    detail:
      "Eligibility, company targeting, and preparation assets extend the student workspace after the ERP core is stable.",
  },
];

export const admissionSteps: AdmissionStep[] = [
  {
    title: "Discover eligibility",
    owner: "Admission Cell",
    timeline: "Before counseling",
    details: [
      "Program-wise eligibility and seat categories",
      "Entrance score thresholds",
      "Fee slab overview",
    ],
  },
  {
    title: "Upload and verify",
    owner: "Applicant",
    timeline: "Counseling week",
    details: [
      "Mark sheets and rank proof",
      "Identity and transfer certificate",
      "Missing-document fallback guidance",
    ],
  },
  {
    title: "Confirm admission",
    owner: "Academic Office",
    timeline: "Offer acceptance",
    details: [
      "Fee confirmation and enrollment issue",
      "Branch allocation",
      "Hostel preference collection",
    ],
  },
];

export const publicNotices: PublicNotice[] = [
  {
    id: "public-1",
    title: "B.Tech admission brochure for 2026 released",
    category: "Admissions",
    department: "Admission Cell",
    updatedAt: "Updated 2 hours ago",
    summary:
      "Seat matrix, document requirements, and counseling calendar are now available for public review.",
    visibility: "Public",
  },
  {
    id: "public-2",
    title: "Hostel fee revision circular published",
    category: "Campus Services",
    department: "Hostel Administration",
    updatedAt: "Updated yesterday",
    summary:
      "Renewal fees and revised accommodation timelines are visible ahead of the new session.",
    visibility: "Public",
  },
  {
    id: "public-3",
    title: "Open house for AI and Data Systems department",
    category: "Events",
    department: "School of Computing",
    updatedAt: "Starts next week",
    summary:
      "Prospective students can attend a guided walkthrough of labs, curriculum, and project showcases.",
    visibility: "Public",
  },
];

export const publicFaqs = [
  "What documents are required for B.Tech admission confirmation?",
  "How do I check whether a notice is public or requires login?",
  "Can the chatbot answer in Hindi or Bengali for admission questions?",
  "What happens if an admission circular is updated after I submit my query?",
];

export const publicHelpdeskExamples: HelpdeskExample[] = [
  {
    id: "public-admission",
    category: "Admissions",
    prompt: "What documents do I need for B.Tech admission confirmation?",
    answer:
      "Prepare your class 10 and 12 mark sheets, entrance rank proof, transfer certificate, valid photo ID, migration certificate where applicable, and recent photographs. The final list should always be confirmed against the latest admission circular before submission.",
    language: "English",
    route: "Semantic document retrieval",
    sourceType: "Semantic",
    confidence: "High confidence",
    citations: [
      "Admission brochure 2026",
      "Counseling notice: document checklist",
    ],
    status: "Public lane with IP-based rate limit",
  },
  {
    id: "public-hostel",
    category: "Campus Services",
    prompt: "Can I see hostel renewal details before logging in?",
    answer:
      "Yes, broad hostel renewal timelines and fee revisions can be shown publicly, but personalized room allocation or payment status should remain behind authentication.",
    language: "English",
    route: "Semantic document retrieval",
    sourceType: "Semantic",
    confidence: "Grounded in latest hostel circular",
    citations: [
      "Hostel fee revision circular",
      "Public accommodation timeline",
    ],
    status: "Public lane with fallback notice",
  },
  {
    id: "public-language",
    category: "Language",
    prompt: "Can the helpdesk answer admission questions in Hindi?",
    answer:
      "Yes. The frontend can capture a preferred language before sending the query so the backend can return a Hindi response while still citing the same admission documents.",
    language: "Hindi",
    route: "Semantic document retrieval with language preference",
    sourceType: "Hybrid",
    confidence: "Language-ready UI state",
    citations: ["Frontend preference selector", "Admission FAQ routing note"],
    status: "Public lane preview",
  },
];
