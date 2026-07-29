"use client";

import { useEffect, useState } from "react";
import { notificationsApi, PatientNotification } from "@/lib/api";
import { useNotifications } from "@/context/NotificationsContext";
import { timeAgo } from "@/lib/timeAgo";

type NotificationFilter = "ALL" | "ORDER" | "SYSTEM";

const filters: { id: NotificationFilter; label: string }[] = [
  { id: "ALL", label: "الكل" },
  { id: "ORDER", label: "الطلبات" },
  { id: "SYSTEM", label: "النظام" },
];

export default function NotificationsPage() {
  const [items, setNotifications] = useState<PatientNotification[]>([]);
  const [activeFilter, setActiveFilter] =
    useState<NotificationFilter>("ALL");

  const { setUnreadCount } = useNotifications();

  useEffect(() => {
  const load = async () => {
    const res = await notificationsApi.getAll();
    if (res.success && res.data) {
      setNotifications(res.data);

      await notificationsApi.markAllAsRead();
      setUnreadCount(0);
    }
  };

  load();
}, [setUnreadCount]);


  const filtered = items.filter((n) =>
    activeFilter === "ALL" ? true : n.type === activeFilter
  );

  if (filtered.length === 0) {
    return (
      <div className="text-sm text-slate-500 text-center py-10">
        لا يوجد إشعارات ضمن هذا القسم
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-4">
      <h1 className="text-xl font-bold">الإشعارات</h1>

      {/* الفلاتر */}
      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs border transition ${
              activeFilter === f.id
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* الإشعارات */}
      {filtered.map((n) => (
        <div
          key={n.id}
          className={`p-4 rounded-xl border ${
            n.isRead
              ? "bg-white dark:bg-slate-900"
              : "bg-blue-50 border-blue-300 dark:bg-blue-900/20"
          }`}
        >
          <p className="font-semibold">{n.title}</p>
          <p className="text-xs text-slate-500 mt-1">{n.message}</p>
          <p className="text-[11px] text-slate-400 mt-2">
            {timeAgo(n.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
}
