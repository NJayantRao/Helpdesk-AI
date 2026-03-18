import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE_NAME = "helpdesk_demo_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

export type SessionRole = "Student" | "Admin" | "System";

type SessionPayload = {
  email: string;
  language: string;
  name: string;
  role: SessionRole;
};

export type DemoSession = SessionPayload & {
  homePath: string;
};

function isSessionRole(value: string): value is SessionRole {
  return value === "Student" || value === "Admin" || value === "System";
}

function normalizeEmail(value: string | null | undefined) {
  const email = value?.trim().toLowerCase();

  return email && email.includes("@") ? email : "ananya.sharma@campus.edu";
}

function normalizeLanguage(value: string | null | undefined) {
  return value?.trim() || "English";
}

function normalizeRole(value: string | null | undefined): SessionRole {
  return value && isSessionRole(value) ? value : "Student";
}

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function deriveNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "";
  const normalized = localPart.replace(/[._-]+/g, " ").trim();

  return normalized ? toTitleCase(normalized) : "Campus User";
}

function encodeSession(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodeSession(value: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf-8")
    ) as Partial<SessionPayload>;

    if (
      typeof parsed.email !== "string" ||
      typeof parsed.language !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.role !== "string" ||
      !isSessionRole(parsed.role)
    ) {
      return null;
    }

    return {
      email: parsed.email,
      language: parsed.language,
      name: parsed.name,
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

export function isAdminRole(role: SessionRole) {
  return role === "Admin" || role === "System";
}

export function resolveWorkspacePath(role: SessionRole) {
  return isAdminRole(role) ? "/admin" : "/dashboard";
}

function withHomePath(payload: SessionPayload): DemoSession {
  return {
    ...payload,
    homePath: resolveWorkspacePath(payload.role),
  };
}

export async function getDemoSession(): Promise<DemoSession | null> {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawCookie) {
    return null;
  }

  const payload = decodeSession(rawCookie);

  return payload ? withHomePath(payload) : null;
}

export async function createDemoSession(input: {
  email?: string | null;
  language?: string | null;
  role?: string | null;
}) {
  const email = normalizeEmail(input.email);

  const payload: SessionPayload = {
    email,
    language: normalizeLanguage(input.language),
    role: normalizeRole(input.role),
    name: deriveNameFromEmail(email),
  };

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, encodeSession(payload), {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return withHomePath(payload);
}

export async function clearDemoSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireStudentSession() {
  const session = await getDemoSession();

  if (!session || session.role !== "Student") {
    redirect("/login");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getDemoSession();

  if (!session || !isAdminRole(session.role)) {
    redirect("/login");
  }

  return session;
}
