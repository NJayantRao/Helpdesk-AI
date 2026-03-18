"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { Card, Avatar, Badge, Button } from "@/components/ui";
import { API_BASE_URL } from "@/lib/constants";
import {
  User,
  Lock,
  Globe,
  Bell,
  Palette,
  AlertTriangle,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧", bcp47: "en-IN" },
  { code: "hi", label: "Hindi", flag: "🇮🇳", bcp47: "hi-IN" },
  { code: "or", label: "Odia", flag: "🪷", bcp47: "or-IN" },
  { code: "bn", label: "Bengali", flag: "🇧🇩", bcp47: "bn-IN" },
  { code: "te", label: "Telugu", flag: "🔵", bcp47: "te-IN" },
  { code: "ta", label: "Tamil", flag: "🟡", bcp47: "ta-IN" },
];
const THEMES = [
  { name: "Indigo", value: "indigo", hex: "#4f46e5" },
  { name: "Violet", value: "violet", hex: "#7c3aed" },
  { name: "Rose", value: "rose", hex: "#e11d48" },
  { name: "Emerald", value: "emerald", hex: "#059669" },
  { name: "Amber", value: "amber", hex: "#d97706" },
  { name: "Sky", value: "sky", hex: "#0284c7" },
];
function getStrength(pw: string) {
  if (!pw) return null;
  if (pw.length < 6) return "Weak";
  if (pw.length < 10) return "Fair";
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) return "Strong";
  return "Good";
}
const SC: Record<string, string> = {
  Weak: "bg-red-400",
  Fair: "bg-amber-400",
  Good: "bg-blue-400",
  Strong: "bg-emerald-500",
};
const ST: Record<string, string> = {
  Weak: "text-red-500",
  Fair: "text-amber-500",
  Good: "text-blue-500",
  Strong: "text-emerald-600",
};
const SO = ["Weak", "Fair", "Good", "Strong"];
function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative w-11 h-6 rounded-full transition-all duration-200 shrink-0",
        value ? "bg-indigo-600" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200",
          value ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}
function InfoField({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value ?? "—"}</p>
    </div>
  );
}

export default function StudentSettingsPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState("en");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [theme, setTheme] = useState("indigo");
  const [notifPrefs, setNotifPrefs] = useState({
    academic: true,
    placement: true,
    general: true,
  });
  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    setSelectedLang(localStorage.getItem("helpdesk_lang") || "en");
    setVoiceEnabled(localStorage.getItem("helpdesk_voice") !== "false");
  }, []);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwError("All fields are required.");
      return;
    }
    if (pwForm.newPassword === pwForm.oldPassword) {
      setPwError("New password must differ.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError("Minimum 8 characters.");
      return;
    }
    setPwLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/student/change-password`,
        { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword },
        { withCredentials: true }
      );
      setPwSuccess(true);
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      setPwError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {}
    setUser(null);
    router.push("/");
  }

  const strength = getStrength(pwForm.newPassword);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Settings
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your account preferences and profile
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
              <User size={16} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Profile Information
              </p>
              <p className="text-xs text-slate-400">Your academic identity</p>
            </div>
          </div>
          <div className="px-5 py-5 space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={user?.fullName || "U"} size="lg" />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {user?.fullName}
                </p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <Badge label="Student" variant="primary" />
              </div>
              <button
                disabled
                title="Coming soon"
                className="ml-auto text-xs text-slate-400 border border-slate-200 px-3 py-1.5 rounded-xl cursor-not-allowed opacity-60"
              >
                Change photo
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InfoField label="Full Name" value={user?.fullName} />
              <InfoField label="Email" value={user?.email} />
              <InfoField label="Roll Number" value={user?.rollNumber} />
              <InfoField label="Department" value={user?.department} />
              <InfoField
                label="Semester"
                value={user?.semester ? `Semester ${user.semester}` : undefined}
              />
              <InfoField label="Branch" value={user?.branch} />
              <InfoField label="Admission Year" value={user?.admissionYear} />
              <InfoField label="CGPA" value={user?.cgpa?.toFixed(2)} />
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Lock size={11} />
              Profile can only be updated by the administrator.
            </p>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
              <Lock size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Change Password
              </p>
              <p className="text-xs text-slate-400">
                Update your login password
              </p>
            </div>
          </div>
          <form onSubmit={handleChangePassword} className="px-5 py-5 space-y-4">
            {pwError && (
              <div className="flex items-center gap-2 px-3.5 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                <AlertTriangle size={13} className="shrink-0" />
                {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="flex items-center gap-2 px-3.5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700">
                <Check size={13} className="shrink-0" />
                Password changed successfully!
              </div>
            )}
            {[
              {
                key: "oldPassword" as const,
                label: "Current Password",
                show: showPw.old,
                toggle: () => setShowPw((p) => ({ ...p, old: !p.old })),
              },
              {
                key: "newPassword" as const,
                label: "New Password",
                show: showPw.new,
                toggle: () => setShowPw((p) => ({ ...p, new: !p.new })),
              },
              {
                key: "confirmPassword" as const,
                label: "Confirm New Password",
                show: showPw.confirm,
                toggle: () => setShowPw((p) => ({ ...p, confirm: !p.confirm })),
              },
            ].map(({ key, label, show, toggle }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={pwForm[key]}
                    onChange={(e) =>
                      setPwForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    placeholder="••••••••"
                    className="w-full py-2.5 pl-3.5 pr-10 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {key === "newPassword" && strength && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {SO.map((l, i) => (
                        <div
                          key={l}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-all",
                            SO.indexOf(strength) >= i
                              ? SC[strength]
                              : "bg-slate-200"
                          )}
                        />
                      ))}
                    </div>
                    <p className={cn("text-xs mt-1 font-medium", ST[strength])}>
                      {strength} password
                    </p>
                  </div>
                )}
              </div>
            ))}
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={pwLoading}
            >
              Update Password
            </Button>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-8 h-8 bg-sky-50 rounded-xl flex items-center justify-center">
              <Globe size={16} className="text-sky-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Language & Preferences
              </p>
              <p className="text-xs text-slate-400">AI Helpdesk language</p>
            </div>
          </div>
          <div className="px-5 py-5 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang.code);
                    localStorage.setItem("helpdesk_lang", lang.code);
                  }}
                  className={cn(
                    "flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-left",
                    selectedLang === lang.code
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {lang.label}
                    </p>
                    <p className="text-[10px] text-slate-400">{lang.bcp47}</p>
                  </div>
                  {selectedLang === lang.code && (
                    <Check
                      size={14}
                      className="text-indigo-600 ml-auto shrink-0"
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Enable Voice Input
                </p>
                <p className="text-xs text-slate-500">
                  Microphone for the AI helpdesk
                </p>
              </div>
              <Toggle
                value={voiceEnabled}
                onChange={() => {
                  const n = !voiceEnabled;
                  setVoiceEnabled(n);
                  localStorage.setItem("helpdesk_voice", String(n));
                }}
              />
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Bell size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Notification Preferences
              </p>
              <p className="text-xs text-slate-400">Control what you receive</p>
            </div>
          </div>
          <div className="px-5 py-2">
            {[
              {
                key: "academic" as const,
                label: "Academic Notifications",
                desc: "Exam schedules, result declarations",
              },
              {
                key: "placement" as const,
                label: "Placement Alerts",
                desc: "Campus drive announcements",
              },
              {
                key: "general" as const,
                label: "General Notices",
                desc: "Campus info and updates",
              },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                <Toggle
                  value={notifPrefs[key]}
                  onChange={() =>
                    setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))
                  }
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center">
              <Palette size={16} className="text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Appearance</p>
              <p className="text-xs text-slate-400">Dashboard color theme</p>
            </div>
          </div>
          <div className="px-5 py-5">
            <div className="flex gap-3 flex-wrap">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  title={t.name}
                  className="relative w-9 h-9 rounded-full border-4 transition-all"
                  style={{
                    backgroundColor: t.hex,
                    borderColor: theme === t.value ? t.hex : "transparent",
                    boxShadow:
                      theme === t.value
                        ? `0 0 0 2px white, 0 0 0 4px ${t.hex}`
                        : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-red-200">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-red-100">
            <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle size={16} className="text-red-500" />
            </div>
            <p className="text-sm font-semibold text-red-600">Account</p>
          </div>
          <div className="px-5 py-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">Sign Out</p>
              <p className="text-xs text-slate-500">
                Sign out from all devices
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
