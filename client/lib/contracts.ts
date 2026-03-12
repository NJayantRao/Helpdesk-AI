export type NavIcon =
  | "home"
  | "chart"
  | "bot"
  | "bell"
  | "file"
  | "user"
  | "shield"
  | "users"
  | "upload"
  | "settings";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: NavIcon;
  exact?: boolean;
  badge?: string;
};

export type MetricCard = {
  label: string;
  value: string;
  detail: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  status: string;
  items: string[];
};

export type RoleCard = {
  role: string;
  summary: string;
  tone: "public" | "student" | "admin";
  responsibilities: string[];
};

export type QueryFlowCard = {
  title: string;
  summary: string;
  route: string;
  audience: string;
  points: string[];
};

export type Milestone = {
  phase: string;
  focus: string;
  detail: string;
};

export type AdmissionStep = {
  title: string;
  owner: string;
  timeline: string;
  details: string[];
};

export type PublicNotice = {
  id: string;
  title: string;
  category: string;
  department: string;
  updatedAt: string;
  summary: string;
  visibility: "Public" | "Authenticated";
};

export type HelpdeskExample = {
  id: string;
  category: string;
  prompt: string;
  answer: string;
  language: string;
  route: string;
  sourceType: "Structured" | "Semantic" | "Hybrid";
  confidence: string;
  citations: string[];
  status: string;
};

export type SemesterProgress = {
  term: string;
  sgpa: number;
  cgpa: number;
  status: string;
};

export type SemesterResult = {
  id: string;
  term: string;
  publishedAt: string;
  sgpa: number;
  cgpa: number;
  creditsEarned: number;
  status: string;
};

export type CourseRecord = {
  id: string;
  code: string;
  title: string;
  credits: number;
  grade: string;
  internal: number;
  external: number;
  status: string;
};

export type NoticeItem = {
  id: string;
  title: string;
  department: string;
  timeline: string;
  priority: "High" | "Medium" | "Low";
  summary: string;
  audience: string;
};

export type TaskItem = {
  id: string;
  title: string;
  due: string;
  owner: string;
  status: string;
};

export type DocumentItem = {
  id: string;
  title: string;
  department: string;
  type: string;
  visibility: "Public" | "Authenticated";
  updated: string;
  status: string;
  summary: string;
  tags: string[];
};

export type StudentProfile = {
  name: string;
  registrationNumber: string;
  program: string;
  semester: string;
  department: string;
  email: string;
  phone: string;
  guardian: string;
  language: string;
  hostelStatus: string;
  advisor: string;
};

export type PreferenceItem = {
  title: string;
  value: string;
  detail: string;
};

export type RiskItem = {
  title: string;
  detail: string;
  owner: string;
};

export type AdminQueueItem = {
  id: string;
  title: string;
  owner: string;
  status: string;
  eta: string;
};

export type DepartmentCoverage = {
  id: string;
  name: string;
  coverage: string;
  readiness: string;
  note: string;
};

export type UserAccount = {
  id: string;
  name: string;
  role: string;
  department: string;
  status: string;
  lastActive: string;
};

export type ResultBatch = {
  id: string;
  semester: string;
  department: string;
  uploadedBy: string;
  uploadedAt: string;
  status: string;
  note: string;
};

export type IntegrationBinding = {
  surface: string;
  endpoint: string;
  method: string;
  note: string;
};

export type SettingItem = {
  title: string;
  value: string;
  detail: string;
};
