// ─── Legacy types (used by mock data + existing UI components) ───────────────

export type UserRole = "STUDENT" | "ADMIN" | "SYSTEM";

/** Legacy User shape — used by DashboardLayout and mock data */
export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "system";
  rollNumber?: string;
  department?: string;
  semester?: number;
  avatar?: string;
  language?: string;
}

export interface SemesterResult {
  semester: number;
  sgpa: number;
  cgpa: number;
  subjects: Subject[];
  year: string;
}

export interface Subject {
  code: string;
  name: string;
  credits: number;
  grade: string;
  marks: number;
  maxMarks: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "urgent";
  date: string;
  read: boolean;
  department?: string;
}

export interface Document {
  id: string;
  title: string;
  type: "notice" | "circular" | "syllabus" | "result";
  department: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: string[];
}

export interface PlacementCompany {
  id: string;
  name: string;
  logo?: string;
  cgpaRequired: number;
  roles: string[];
  visitDate: string;
  status: "upcoming" | "ongoing" | "completed";
}

export interface StudentStats {
  currentCGPA: number;
  currentSemester: number;
  totalCredits: number;
  backlogs: number;
  attendancePercent: number;
  trend: "Improving" | "Stable" | "Declining";
}

// ─── Auth context user (real API shape) ──────────────────────────────────────

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  // Student-only fields
  rollNumber?: number;
  semester?: number;
  branch?: string;
  department?: string;
  cgpa?: number;
  admissionYear?: number;
  // Admin-only fields
  designation?: string;
}

// ─── API response types ───────────────────────────────────────────────────────

export interface SubjectResult {
  resultId: string;
  subjectName: string;
  subjectCode: string;
  credits: number;
  marks: number;
  grade: string;
  status: "PASS" | "FAILED";
}

export interface SemesterData {
  semester: number;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  backlogs: number;
  subjects: SubjectResult[];
}

export interface CgpaHistoryPoint {
  semester: number;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
}

export interface ResultsResponse {
  cgpa: number;
  cgpaHistory: CgpaHistoryPoint[];
  semesters: SemesterData[];
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  createdAt: string;
  uploadedBy: {
    user: { fullName: string };
    designation: string;
  };
}

export interface AttendanceItem {
  id: string;
  percentage: number;
  subject: {
    subjectName: string;
    subjectCode: string;
    credits: number;
    semester: number;
  };
}

export interface Company {
  id: string;
  companyName: string;
  avgPackage: number;
  eligibilityCgpa: number;
  jobRole: string;
  visitDate: string;
}

export interface UploadResultResponse {
  totalRows: number;
  inserted: number;
  skipped: number;
  failed: number;
  errors: { row: number; reason: string }[];
}
