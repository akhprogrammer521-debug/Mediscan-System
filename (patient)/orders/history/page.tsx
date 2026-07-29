"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, History, Package, XCircle } from "lucide-react";
import Button from "@/components/ui/button";
import { ordersApi, Order, OrderStatus } from "@/lib/api";

const HISTORY_STATUSES: OrderStatus[] = ["REJECTED", "COMPLETED", "CANCELLED"];

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "COMPLETED":
      return "مكتمل";
    case "CANCELLED":
      return "ملغي";
    case "REJECTED":
      return "مرفوض";
    default:
      return status;
  }
}

export default function OrdersHistoryPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const res = await ordersApi.getMy();
      if (!res.success) {
        setError(res.error || "فشل تحميل سجل الطلبات");
        setLoading(false);
        return;
      }
      setOrders(res.data ?? []);
      setLoading(false);
    })();
  }, []);

  const history = useMemo(
    () => (orders ?? []).filter((o) => HISTORY_STATUSES.includes(o.status)),
    [orders]
  );

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <History className="text-slate-700 dark:text-slate-200" size={20} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                سجل الطلبات
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                مراجعة طلباتك المكتملة/الملغية/المرفوضة.
              </p>
            </div>
          </div>

          <Button
            className="text-sm px-4 py-2"
            onClick={() => router.push("/orders/new/select-method")}
          >
            طلب دواء جديد
          </Button>
        </header>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/10 p-4 text-sm text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* History list */}
        <section className="space-y-4">
          {loading && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-8">
              جارٍ تحميل السجل…
            </p>
          )}

          {!loading && history.map((order) => {
            const pharmacy = order.pharmacy ?? null;
            const Icon = order.status === "COMPLETED" ? CheckCircle2 : XCircle;
            const badgeClass =
              order.status === "COMPLETED"
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                : order.status === "REJECTED"
                  ? "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200";

            return (
              <article
                key={order.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                      <Package className="text-emerald-700 dark:text-emerald-300" size={20} />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        طلب #{order.id}
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {pharmacy?.name || `صيدلية رقم ${order.pharmacy?.id}`}
                      </p>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] ${badgeClass}`}>
                    <Icon size={13} />
                    {statusLabel(order.status)}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  {order.drugName} — الكمية: {order.quantity}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-4">
                    <span>
                      تاريخ الطلب: {new Date(order.createdAt).toLocaleString("ar-EG")}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}

          {!loading && history.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-8">
              لا يوجد سجل طلبات بعد.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
