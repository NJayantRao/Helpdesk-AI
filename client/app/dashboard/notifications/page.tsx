"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Badge } from "@/components/ui";
import { mockUser, mockNotifications as initial } from "@/lib/utils";
import type { Notification } from "@/types";
import { Bell, BellOff, CheckCheck } from "lucide-react";

const TYPE_STYLES: Record<
  string,
  { border: string; badge: "danger" | "primary" | "warning" | "success" }
> = {
  urgent: { border: "border-l-red-500", badge: "danger" },
  info: { border: "border-l-indigo-500", badge: "primary" },
  warning: { border: "border-l-amber-500", badge: "warning" },
  success: { border: "border-l-emerald-500", badge: "success" },
};

type FilterTab = "all" | "unread" | "read";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initial);
  const [filter, setFilter] = useState<FilterTab>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : filter === "read"
        ? notifications.filter((n) => n.read)
        : notifications;

  function markOne(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAll() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
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
          {unreadCount > 0 && (
            <button
              onClick={markAll}
              className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all"
            >
              <CheckCheck size={13} /> Mark all read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(["all", "unread", "read"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all flex items-center gap-1 ${
                filter === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab}
              {tab === "unread" && unreadCount > 0 && (
                <span className="ml-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <BellOff size={22} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                No {filter !== "all" ? filter : ""} notifications
              </p>
            </Card>
          ) : (
            filtered.map((n) => {
              const style = TYPE_STYLES[n.type] || TYPE_STYLES.info;
              return (
                <Card
                  key={n.id}
                  className={`p-4 border-l-4 ${style.border} ${!n.read ? "bg-indigo-50/30" : ""} cursor-pointer hover:shadow-sm transition-all`}
                  onClick={() => markOne(n.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-slate-200" : "bg-indigo-500"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                          {n.title}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            label={n.type === "urgent" ? "Urgent" : n.type}
                            variant={style.badge}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-2">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Bell size={10} /> {n.department}
                          </span>
                          <span>
                            {new Date(n.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {!n.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markOne(n.id);
                            }}
                            className="ml-auto text-xs text-indigo-500 font-medium border border-indigo-200 px-2 py-0.5 rounded-lg hover:bg-indigo-50 transition-all"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
