"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Badge } from "@/components/ui";
import { mockUser, mockNotifications } from "@/lib/utils";
import { BellOff, CheckCheck, Filter } from "lucide-react";
import type { Notification } from "@/types/index";

const TYPE_COLORS = {
  urgent: "danger",
  info: "primary",
  warning: "warning",
  success: "success",
} as const;
const TYPE_BG = {
  urgent: "bg-red-500",
  info: "bg-indigo-500",
  warning: "bg-amber-500",
  success: "bg-emerald-500",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const shown =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  function markAll() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }
  function markOne(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-5 animate-fade-in max-w-3xl">
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="text-xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Notifications
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-slate-100 rounded-xl p-1">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>
        </div>

        {shown.length === 0 ? (
          <Card className="p-12 text-center">
            <BellOff size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">
              No {filter === "unread" ? "unread " : ""}notifications
            </p>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {shown.map((n) => (
              <Card
                key={n.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${!n.read ? "border-indigo-200 bg-indigo-50/30" : ""}`}
                onClick={() => markOne(n.id)}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 transition-all ${n.read ? "bg-slate-200" : TYPE_BG[n.type]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3
                        className={`text-sm font-semibold leading-snug ${n.read ? "text-slate-600" : "text-slate-900"}`}
                      >
                        {n.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge label={n.type} variant={TYPE_COLORS[n.type]} />
                        {!n.read && (
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Filter size={10} /> {n.department}
                      </span>
                      <span>·</span>
                      <span>
                        {new Date(n.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {!n.read && (
                        <span className="ml-auto text-indigo-500 font-medium">
                          Click to mark read
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
