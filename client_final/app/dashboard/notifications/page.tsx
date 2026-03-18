"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, Badge } from "@/components/ui";
import { API_BASE_URL } from "@/lib/constants";
import { Bell, BellOff, CheckCheck, Loader2 } from "lucide-react";

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
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/student/notifications`, { withCredentials: true })
      .then((res) =>
        setNotifications((res.data?.data ?? res.data)?.notifications ?? [])
      )
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403)
          router.push("/login");
        else
          setError(
            err.response?.data?.message || "Failed to load notifications"
          );
      })
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : filter === "read"
        ? notifications.filter((n) => n.read)
        : notifications;

  async function handleMarkOne(id: string) {
    try {
      await axios.patch(
        `${API_BASE_URL}/student/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {}
  }

  async function handleMarkAll() {
    setMarkingAll(true);
    try {
      await axios.patch(
        `${API_BASE_URL}/student/notifications/mark-all-read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="text-xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Notifications
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {loading ? "Loading…" : `${unreadCount} unread`}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              disabled={markingAll}
              className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all disabled:opacity-60"
            >
              {markingAll ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <CheckCheck size={13} />
              )}{" "}
              Mark all read
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {(["all", "unread", "read"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all flex items-center gap-1 ${filter === tab ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              {tab}
              {tab === "unread" && unreadCount > 0 && (
                <span className="ml-1 bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={24} className="animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-red-500 text-sm">{error}</p>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <BellOff size={22} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">
              No {filter !== "all" ? filter : ""} notifications
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((n: any) => {
              const style = TYPE_STYLES[n.type] || TYPE_STYLES.info;
              return (
                <Card
                  key={n.id}
                  className={`p-4 border-l-4 ${style.border} ${!n.read ? "bg-indigo-50/30" : ""} cursor-pointer hover:shadow-sm transition-all`}
                  onClick={() => handleMarkOne(n.id)}
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
                        <Badge
                          label={n.type === "urgent" ? "Urgent" : n.type}
                          variant={style.badge}
                        />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-2">
                        {n.body}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Bell size={10} />
                          {n.source}
                        </span>
                        {!n.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkOne(n.id);
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
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
