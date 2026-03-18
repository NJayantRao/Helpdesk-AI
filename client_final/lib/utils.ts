import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  SemesterResult,
  Notification,
  Document,
  StudentStats,
  User,
  PlacementCompany,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mockUser: User = {
  id: "1",
  name: "Arjun Sharma",
  email: "arjun.sharma@nist.edu",
  role: "student",
  rollNumber: "2204001",
  department: "Computer Science",
  semester: 4,
  language: "en",
};

export const mockAdminUser: User = {
  id: "2",
  name: "Dr. Priya Nair",
  email: "priya.nair@nist.edu",
  role: "admin",
  department: "Computer Science",
  language: "en",
};

export const mockResults: SemesterResult[] = [
  {
    semester: 1,
    sgpa: 8.2,
    cgpa: 8.2,
    year: "2024",
    subjects: [
      {
        code: "CS101",
        name: "Mathematics I",
        credits: 4,
        grade: "A",
        marks: 82,
        maxMarks: 100,
      },
      {
        code: "CS102",
        name: "Physics",
        credits: 3,
        grade: "A+",
        marks: 91,
        maxMarks: 100,
      },
      {
        code: "CS103",
        name: "Programming Fundamentals",
        credits: 4,
        grade: "A",
        marks: 85,
        maxMarks: 100,
      },
      {
        code: "CS104",
        name: "English Communication",
        credits: 2,
        grade: "B+",
        marks: 76,
        maxMarks: 100,
      },
    ],
  },
  {
    semester: 2,
    sgpa: 8.5,
    cgpa: 8.35,
    year: "2024",
    subjects: [
      {
        code: "CS201",
        name: "Mathematics II",
        credits: 4,
        grade: "A+",
        marks: 90,
        maxMarks: 100,
      },
      {
        code: "CS202",
        name: "Data Structures",
        credits: 4,
        grade: "A",
        marks: 83,
        maxMarks: 100,
      },
      {
        code: "CS203",
        name: "Digital Electronics",
        credits: 3,
        grade: "A",
        marks: 80,
        maxMarks: 100,
      },
      {
        code: "CS204",
        name: "Object Oriented Programming",
        credits: 4,
        grade: "A+",
        marks: 92,
        maxMarks: 100,
      },
    ],
  },
  {
    semester: 3,
    sgpa: 8.8,
    cgpa: 8.5,
    year: "2025",
    subjects: [
      {
        code: "CS301",
        name: "Algorithms",
        credits: 4,
        grade: "A+",
        marks: 88,
        maxMarks: 100,
      },
      {
        code: "CS302",
        name: "Computer Organization",
        credits: 3,
        grade: "A",
        marks: 82,
        maxMarks: 100,
      },
      {
        code: "CS303",
        name: "Database Management",
        credits: 4,
        grade: "A+",
        marks: 93,
        maxMarks: 100,
      },
      {
        code: "CS304",
        name: "Operating Systems",
        credits: 4,
        grade: "A",
        marks: 85,
        maxMarks: 100,
      },
    ],
  },
  {
    semester: 4,
    sgpa: 0,
    cgpa: 8.5,
    year: "2025",
    subjects: [],
  },
];

export const mockStats: StudentStats = {
  currentCGPA: 8.5,
  currentSemester: 4,
  totalCredits: 64,
  backlogs: 0,
  attendancePercent: 88,
  trend: "Improving",
};

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Mid-Semester Exam Schedule",
    message:
      "Mid-semester exams for Semester 4 will begin on March 20, 2026. Time table has been uploaded.",
    type: "urgent",
    date: "2026-03-10",
    read: false,
    department: "Academic Office",
  },
  {
    id: "2",
    title: "TCS Campus Drive",
    message:
      "TCS will be visiting campus on April 5. Students with CGPA ≥ 7.5 are eligible.",
    type: "info",
    date: "2026-03-08",
    read: false,
    department: "Placement Cell",
  },
  {
    id: "3",
    title: "Library Due Date Reminder",
    message: "Please return borrowed books before March 15 to avoid fines.",
    type: "warning",
    date: "2026-03-07",
    read: true,
    department: "Library",
  },
  {
    id: "4",
    title: "Scholarship Applications Open",
    message:
      "Merit scholarship applications are now open. Apply before March 25.",
    type: "success",
    date: "2026-03-05",
    read: true,
    department: "Admin",
  },
];

export const mockDocuments: Document[] = [
  {
    id: "1",
    title: "CS Semester 4 Syllabus",
    type: "syllabus",
    department: "Computer Science",
    uploadedBy: "Dr. Priya Nair",
    uploadedAt: "2026-01-15",
    fileSize: "2.4 MB",
  },
  {
    id: "2",
    title: "Mid-Sem Exam Circular 2026",
    type: "circular",
    department: "Academic Office",
    uploadedBy: "Admin",
    uploadedAt: "2026-03-10",
    fileSize: "0.8 MB",
  },
  {
    id: "3",
    title: "Semester 3 Result Declaration",
    type: "result",
    department: "Exam Cell",
    uploadedBy: "Admin",
    uploadedAt: "2025-12-20",
    fileSize: "1.2 MB",
  },
  {
    id: "4",
    title: "Campus Placement Policy 2026",
    type: "notice",
    department: "Placement Cell",
    uploadedBy: "Admin",
    uploadedAt: "2026-02-01",
    fileSize: "0.5 MB",
  },
  {
    id: "5",
    title: "Hostel Rules & Regulations",
    type: "notice",
    department: "Hostel Admin",
    uploadedBy: "Admin",
    uploadedAt: "2026-01-10",
    fileSize: "1.1 MB",
  },
  {
    id: "6",
    title: "Academic Calendar 2025-26",
    type: "circular",
    department: "Academic Office",
    uploadedBy: "Admin",
    uploadedAt: "2025-11-30",
    fileSize: "0.7 MB",
  },
];

export const mockCompanies: PlacementCompany[] = [
  {
    id: "1",
    name: "TCS",
    cgpaRequired: 7.5,
    roles: ["Software Engineer", "Analyst"],
    visitDate: "2026-04-05",
    status: "upcoming",
  },
  {
    id: "2",
    name: "Infosys",
    cgpaRequired: 7.0,
    roles: ["Systems Engineer", "Operations Executive"],
    visitDate: "2026-04-12",
    status: "upcoming",
  },
  {
    id: "3",
    name: "Wipro",
    cgpaRequired: 6.5,
    roles: ["Project Engineer", "Developer"],
    visitDate: "2026-03-20",
    status: "upcoming",
  },
  {
    id: "4",
    name: "Cognizant",
    cgpaRequired: 7.0,
    roles: ["Programmer Analyst", "Associate"],
    visitDate: "2026-03-10",
    status: "completed",
  },
];

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Arjun Sharma",
    email: "arjun.sharma@nist.edu",
    role: "student",
    rollNumber: "2204001",
    department: "Computer Science",
    semester: 4,
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.patel@nist.edu",
    role: "student",
    rollNumber: "2204002",
    department: "Computer Science",
    semester: 4,
  },
  {
    id: "3",
    name: "Rohit Kumar",
    email: "rohit.kumar@nist.edu",
    role: "student",
    rollNumber: "2204003",
    department: "Electronics",
    semester: 4,
  },
  {
    id: "4",
    name: "Dr. Priya Nair",
    email: "priya.nair@nist.edu",
    role: "admin",
    department: "Computer Science",
  },
  {
    id: "5",
    name: "Mr. Suresh Reddy",
    email: "suresh.reddy@nist.edu",
    role: "admin",
    department: "Admin Office",
  },
];

export const DEPARTMENTS = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Chemical",
  "Academic Office",
  "Exam Cell",
  "Hostel Admin",
  "Placement Cell",
  "Library",
];
