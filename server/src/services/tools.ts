import axios from "axios";

// ─── Axios instance — reuses cookies from the original request ─────────────
// cookieHeader is forwarded from the Express req so the student's JWT
// is included in every internal API call the chatbot makes.

function makeClient(cookieHeader: string) {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
    headers: { Cookie: cookieHeader },
    withCredentials: true,
  });
}

// ─── Helper to safely unwrap ApiResponse envelope ─────────────────────────
function unwrap(data: Record<string, unknown>) {
  return data?.data ?? data;
}

// ─── STUDENT TOOLS ─────────────────────────────────────────────────────────

export async function getStudentProfile(cookie: string) {
  const res = await makeClient(cookie).get("/student/profile");
  return unwrap(res.data);
}

export async function getStudentDashboard(cookie: string) {
  const res = await makeClient(cookie).get("/student/dashboard");
  return unwrap(res.data);
}

export async function getMyResults(cookie: string) {
  const res = await makeClient(cookie).get("/student/results");
  return unwrap(res.data);
}

export async function getMySubjects(cookie: string) {
  const res = await makeClient(cookie).get("/student/subjects");
  return unwrap(res.data);
}

export async function getMyAttendance(cookie: string) {
  const res = await makeClient(cookie).get("/student/attendance");
  return unwrap(res.data);
}

export async function getEligiblePlacements(cookie: string) {
  const res = await makeClient(cookie).get("/student/placements");
  return unwrap(res.data);
}

export async function getStudentDocuments(cookie: string) {
  const res = await makeClient(cookie).get("/student/documents");
  return unwrap(res.data);
}

export async function getStudentNotifications(cookie: string) {
  const res = await makeClient(cookie).get("/student/notifications");
  return unwrap(res.data);
}

export async function getUnreadCount(cookie: string) {
  const res = await makeClient(cookie).get(
    "/student/notifications/unread-count"
  );
  return unwrap(res.data);
}

// ─── ADMIN TOOLS ───────────────────────────────────────────────────────────

export async function getAdminProfile(cookie: string) {
  const res = await makeClient(cookie).get("/admin/profile");
  return unwrap(res.data);
}

export async function getAttendanceBySubject(
  cookie: string,
  subjectId: string
) {
  const res = await makeClient(cookie).get(`/attendance/subject/${subjectId}`);
  return unwrap(res.data);
}

export async function updateAttendance(
  cookie: string,
  studentId: string,
  subjectId: string
) {
  const res = await makeClient(cookie).patch(
    `/attendance/${studentId}/${subjectId}`
  );
  return unwrap(res.data);
}

export async function getAllNotifications(cookie: string) {
  const res = await makeClient(cookie).get("/notification/");
  return unwrap(res.data);
}

// ─── ACADEMIC TOOLS ────────────────────────────────────────────────────────

export async function getAllSubjects(cookie: string) {
  const res = await makeClient(cookie).get("/subject/");
  return unwrap(res.data);
}

export async function getSubjectById(cookie: string, subjectId: string) {
  const res = await makeClient(cookie).get(`/subject/${subjectId}`);
  return unwrap(res.data);
}

export async function getResultsByStudentId(cookie: string, studentId: string) {
  const res = await makeClient(cookie).get(`/result/student/${studentId}`);
  return unwrap(res.data);
}

// ─── Tool dispatcher ───────────────────────────────────────────────────────
// Called by the agentic loop with the parsed ACTION json.

export async function dispatchTool(
  functionName: string,
  input: Record<string, string>,
  cookie: string,
  userRole: string
): Promise<unknown> {
  // Role guard for admin-only tools
  const ADMIN_ONLY = new Set([
    "getAdminProfile",
    "getAttendanceBySubject",
    "updateAttendance",
    "getAllNotifications",
  ]);

  if (
    ADMIN_ONLY.has(functionName) &&
    userRole !== "ADMIN" &&
    userRole !== "SYSTEM"
  ) {
    return { error: "ACCESS_DENIED", message: "Admin only tool." };
  }

  switch (functionName) {
    // Student
    case "getStudentProfile":
      return getStudentProfile(cookie);
    case "getStudentDashboard":
      return getStudentDashboard(cookie);
    case "getMyResults":
      return getMyResults(cookie);
    case "getMySubjects":
      return getMySubjects(cookie);
    case "getMyAttendance":
      return getMyAttendance(cookie);
    case "getEligiblePlacements":
      return getEligiblePlacements(cookie);
    case "getStudentDocuments":
      return getStudentDocuments(cookie);
    case "getStudentNotifications":
      return getStudentNotifications(cookie);
    case "getUnreadCount":
      return getUnreadCount(cookie);

    // Admin
    case "getAdminProfile":
      return getAdminProfile(cookie);
    case "getAttendanceBySubject":
      return getAttendanceBySubject(cookie, input.subjectId!);
    case "updateAttendance":
      return updateAttendance(cookie, input.studentId!, input.subjectId!);
    case "getAllNotifications":
      return getAllNotifications(cookie);

    // Academic
    case "getAllSubjects":
      return getAllSubjects(cookie);
    case "getSubjectById":
      return getSubjectById(cookie, input.subjectId!);
    case "getResultsByStudentId":
      return getResultsByStudentId(cookie, input.studentId!);

    default:
      return {
        error: "UNKNOWN_TOOL",
        message: `Unknown tool: ${functionName}`,
      };
  }
}
