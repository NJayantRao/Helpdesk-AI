"use server";

import { redirect } from "next/navigation";

import {
  clearDemoSession,
  createDemoSession,
  resolveWorkspacePath,
  type SessionRole,
} from "@/lib/auth";

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : undefined;
}

function normalizeRole(value: FormDataEntryValue | null): SessionRole {
  return value === "Admin" || value === "System" ? value : "Student";
}

export async function loginAction(formData: FormData) {
  const role = normalizeRole(formData.get("role"));
  const destination =
    formData.get("destination") === "workspace" ? "workspace" : "landing";

  await createDemoSession({
    email: getStringValue(formData.get("email")),
    language: getStringValue(formData.get("language")),
    role,
  });

  redirect(destination === "workspace" ? resolveWorkspacePath(role) : "/");
}

export async function logoutAction() {
  await clearDemoSession();
  redirect("/");
}
