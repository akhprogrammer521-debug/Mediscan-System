"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { ordersApi, Order, OrderStatus } from "@/lib/api";

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "بانتظار المراجعة";
    case "ACCEPTED":
      return "تم القبول";
    case "REJECTED":
      return "مرفوض";
    case "COMPLETED":
      return "مكتمل";
    case "CANCELLED":
      return "ملغي";
    default:
      return status;
  }
}

function statusColor(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
    case "ACCEPTED":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
    case "REJECTED":
      return "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
    case "CANCELLED":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
  }
}

const CURRENT_STATUSES: OrderStatus[] = ["PENDING", "ACCEPTED"];

export default function CurrentOrdersPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const res = await ordersApi.getMy();
    if (!res.success) {
      setError(res.error || "فشل تحميل الطلبات");
      setLoading(false);
      return;
    }

    setOrders(res.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      const res = await ordersApi.getMy();

      if (cancelled) return;

      if (!res.success) {
        setError(res.error || "فشل تحميل الطلبات");
        setLoading(false);
        return;
      }

      setOrders(res.data ?? []);
      setLoading(false);
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, []);


  const currentOrders = useMemo(
    () => orders.filter((o) => CURRENT_STATUSES.includes(o.status)),
    [orders]
  );

  const handleCancel = async (orderId: number) => {
    setDeletingId(orderId);
    const res = await ordersApi.cancel(orderId);
    if (!res.success) {
      setError(res.error || "فشل إلغاء الطلب");
      setDeletingId(null);
      return;
    }
    await load();
    setDeletingId(null);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">الطلبات الجارية</h1>
            <p className="text-sm text-slate-500">
              هنا تجد جميع طلبات الأدوية غير المكتملة.
            </p>
          </div>
          <Button onClick={() => router.push("/orders/new/select-method")}>
            طلب دواء جديد
          </Button>
        </header>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-sm">
            {error}
          </div>
        )}

        <section className="space-y-4">
          {loading && <p className="text-center text-sm">جارٍ التحميل…</p>}

          {!loading &&
            currentOrders.map((order) => {
              const pharmacy = order.pharmacy;

              return (
                <article
                  key={order.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border p-5 space-y-3"
                >
                  <div className="flex justify-between">
                    <div>
                      <h2 className="font-semibold">طلب #{order.id}</h2>
                      <p className="text-xs">{pharmacy.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${statusColor(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200">
                    {order.drugName || order.drug?.name || "دواء غير معروف"} — الكمية: {order.quantity}
                  </p>


                  <div className="flex justify-between text-xs">
                    <span>
                      {new Date(order.createdAt).toLocaleString("ar-EG")}
                    </span>

                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={deletingId === order.id}
                        className="text-rose-600"
                      >
                        إلغاء الطلب
                      </button>
                    )}
                  </div>
                </article>
              );
            })}

          {!loading && currentOrders.length === 0 && (
            <p className="text-center text-sm text-slate-500">
              لا توجد طلبات جارية.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
