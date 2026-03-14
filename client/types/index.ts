export type UserRole = "system" | "admin" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
