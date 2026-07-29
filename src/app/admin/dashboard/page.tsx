'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'
import { PageWrapper } from '@/components/admin/PageWrapper'
import { Button } from '@/components/ui/Button'
import { dashboardApi, type DashboardCounts } from '@/lib/api'
import {
  Users,
  Building2,
  ShoppingCart,
  Pill,
  CheckCircle2,
  XCircle,
  Clock3,
  Ban,
  Activity,
  ArrowUpRight,
  Plus,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'

type OrderKey = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'

export default function DashboardPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [counts, setCounts] = useState<DashboardCounts | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setError(null)
      setLoading(true)
      try {
        const res = await dashboardApi.getStats()
        if (res.success && res.data) {
          // ✅ backend returns: { success: true, data: { counts: ... } }
          // ✅ but in our typed api: res.data is DashboardStatsResponse (counts inside)
          // Some setups may return counts directly; handle both safely.
          const maybeCounts = (res.data as any).counts ? (res.data as any).counts : res.data
          setCounts(maybeCounts)
        } else {
          setError(res.error || 'فشل جلب بيانات لوحة التحكم')
        }
      } catch {
        setError('حدث خطأ غير متوقع أثناء جلب البيانات')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const safeCounts = useMemo(() => {
    const c = counts
    return {
      patients: c?.patients ?? 0,
      activePatients: c?.activePatients ?? 0,
      inactivePatients: c?.inactivePatients ?? 0,
      pharmacists: c?.pharmacists ?? 0,
      pharmacies: c?.pharmacies ?? 0,
      activePharmacies: c?.activePharmacies ?? 0,
      inactivePharmacies: c?.inactivePharmacies ?? 0,
      drugs: c?.drugs ?? 0,
      orders: {
        total: c?.orders?.total ?? 0,
        pending: c?.orders?.pending ?? 0,
        accepted: c?.orders?.accepted ?? 0,
        rejected: c?.orders?.rejected ?? 0,
        completed: c?.orders?.completed ?? 0,
        cancelled: c?.orders?.cancelled ?? 0,
      },
    }
  }, [counts])

  const pieData = useMemo(
    () => [
      { key: 'pending' as OrderKey, name: 'معلّقة', value: safeCounts.orders.pending },
      { key: 'accepted' as OrderKey, name: 'مقبولة', value: safeCounts.orders.accepted },
      { key: 'rejected' as OrderKey, name: 'مرفوضة', value: safeCounts.orders.rejected },
      { key: 'completed' as OrderKey, name: 'مكتملة', value: safeCounts.orders.completed },
      { key: 'cancelled' as OrderKey, name: 'ملغاة', value: safeCounts.orders.cancelled },
    ],
    [safeCounts]
  )

  const compareBarData = useMemo(
    () => [
      { name: 'المرضى', total: safeCounts.patients, active: safeCounts.activePatients, inactive: safeCounts.inactivePatients },
      { name: 'الصيدليات', total: safeCounts.pharmacies, active: safeCounts.activePharmacies, inactive: safeCounts.inactivePharmacies },
    ],
    [safeCounts]
  )

  return (
    <AdminShell>
      <PageWrapper title="لوحة التحكم" subtitle="نظرة عامة على نشاط النظام والإحصائيات الرئيسية">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        )}

        {/* =========================
            TOP KPI CARDS
        ========================= */}
        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            loading={loading}
            title="إجمالي المرضى"
            value={safeCounts.patients}
            subtitle={safeCounts.activePatients || safeCounts.inactivePatients ? `فعّال: ${safeCounts.activePatients} • موقوف: ${safeCounts.inactivePatients}` : 'نظرة عامة على المرضى'}
            icon={Users}
            accent="sky"
          />
          <KpiCard
            loading={loading} 
            title="إجمالي الصيدليات"
            value={safeCounts.pharmacies}
            subtitle={`فعّالة: ${safeCounts.activePharmacies} • موقوفة: ${safeCounts.inactivePharmacies}`}   
            icon={Building2}
            accent="indigo"
          />
          <KpiCard
            loading={loading}
            title="إجمالي الطلبات"
            value={safeCounts.orders.total}
            subtitle={`معلّقة: ${safeCounts.orders.pending} • مكتملة: ${safeCounts.orders.completed}`}
            icon={ShoppingCart}
            accent="orange"
          />
          <KpiCard
            loading={loading}
            title="عدد الأدوية"
            value={safeCounts.drugs}
            subtitle="قاعدة بيانات الأدوية"
            icon={Pill}
            accent="emerald"
          />
        </section>

        {/* =========================
            QUICK ACTIONS
        ========================= */}
        <section className="mb-6 grid gap-4 xl:grid-cols-3">
          <Panel>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">أنشطة سريعة</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  اختصارات لإدارة النظام بسرعة
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Activity className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <QuickAction
                title="إنشاء صيدلية"
                desc="إنشاء حساب صيدلية وربطه بصيدلي"
                icon={Plus}
                onClick={() => router.push('/admin/pharmacies')}
              />
              <QuickAction
                title="إضافة دواء"
                desc="إضافة دواء جديد لقاعدة البيانات"
                icon={Pill}
                onClick={() => router.push('/admin/drugs')}
              />
              <QuickAction
                title="عرض المرضى"
                desc="الاطلاع على بيانات المرضى والحالات"
                icon={Users}
                onClick={() => router.push('/admin/patients')}
              />
            </div>
          </Panel>

          {/* =========================
              ORDERS STATUS MINI CARDS
          ========================= */}
          <Panel className="xl:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">حالة الطلبات</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  توزيع الطلبات حسب الحالة
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 dark:border-slate-800 dark:bg-slate-900">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  إجمالي: {loading ? '—' : safeCounts.orders.total}
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <MiniStat loading={loading} title="معلّقة" value={safeCounts.orders.pending} icon={Clock3} tone="amber" />
              <MiniStat loading={loading} title="مقبولة" value={safeCounts.orders.accepted} icon={CheckCircle2} tone="emerald" />
              <MiniStat loading={loading} title="مرفوضة" value={safeCounts.orders.rejected} icon={XCircle} tone="rose" />
              <MiniStat loading={loading} title="مكتملة" value={safeCounts.orders.completed} icon={CheckCircle2} tone="sky" />
              <MiniStat loading={loading} title="ملغاة" value={safeCounts.orders.cancelled} icon={Ban} tone="slate" />
            </div>
          </Panel>
        </section>

        {/* =========================
            CHARTS
        ========================= */}
        <section className="grid gap-4 xl:grid-cols-2">
          <Panel>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">توزيع الطلبات</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                مخطط دائري يوضح حصص كل حالة من حالات الطلبات
              </p>
            </div>

            <div className="h-[320px]">
              {loading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={72}
                      outerRadius={110}
                      paddingAngle={3}
                      stroke="transparent"
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.key} fill={ORDER_COLORS[entry.key]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid rgba(148,163,184,0.25)',
                        background: 'rgba(15,23,42,0.92)',
                        color: '#fff',
                      }}
                      formatter={(value: any, name: any) => [value, name]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Panel>

          <Panel>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">مقارنة المرضى والصيدليات</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                مخطط أعمدة للمقارنة بين الإجمالي والفعّال والموقوف
              </p>
            </div>

            <div className="h-[320px]">
              {loading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={compareBarData} barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid rgba(148,163,184,0.25)',
                        background: 'rgba(15,23,42,0.92)',
                        color: '#fff',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="total" name="الإجمالي" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="active" name="فعّال" fill="#22c55e" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="inactive" name="موقوف" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Panel>
        </section>
      </PageWrapper>
    </AdminShell>
  )
}

/* =========================
   UI COMPONENTS
========================= */

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={[
        'rounded-3xl border p-5 transition-colors',
        'bg-white border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]',
        'dark:bg-slate-900/80 dark:border-slate-800 dark:shadow-none',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}


function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  loading,
}: {
  title: string
  value: number
  subtitle?: string
  icon: any
  accent: 'sky' | 'indigo' | 'orange' | 'emerald'
  loading?: boolean
}) {
  const styles = ACCENTS[accent]
  return (
    <div
      className={[
        'group relative overflow-hidden rounded-3xl border p-5 transition-all',
        // ☀️ Light mode
        'bg-white border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]',
        // 🌙 Dark mode
        'dark:bg-slate-900/80 dark:border-slate-800 dark:shadow-none',
        'hover:-translate-y-0.5 hover:shadow-md',
      ].join(' ')}

    >
      {/* glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-30 blur-2xl"
        style={{ background: styles.glow }}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <div className="mt-2">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            ) : (
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                {formatNumber(value)}
              </p>
            )}
          </div>
          <p className="mt-2 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
            {subtitle || '—'}
          </p>
        </div>

        <div
          className={[
            'flex h-12 w-12 items-center justify-center rounded-2xl border',
            'transition group-hover:scale-[1.03]',
            'dark:border-slate-800',
          ].join(' ')}
          style={{
            background: styles.badgeBg,
            borderColor: styles.badgeBorder,
            color: styles.icon,
          }}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="inline-flex h-1.5 w-1.5 rounded-full" style={{ background: styles.dot }} />
        تحديث فوري من قاعدة البيانات
      </div>
    </div>
  )
}

function MiniStat({
  title,
  value,
  icon: Icon,
  tone,
  loading,
}: {
  title: string
  value: number
  icon: any
  tone: 'amber' | 'emerald' | 'rose' | 'sky' | 'slate'
  loading?: boolean
}) {
  const t = TONES[tone]
  return (
    <div
      className={[
        'rounded-2xl border p-3 transition-colors',
        // ☀️ Light mode
        'bg-white border-slate-200',
        // 🌙 Dark mode
        'dark:bg-slate-900 dark:border-slate-800',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{title}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: t.bg, color: t.fg }}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <div className="mt-2">
        {loading ? (
          <div className="h-6 w-16 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
        ) : (
          <p className="text-xl font-bold text-slate-900 dark:text-slate-50">{formatNumber(value)}</p>
        )}
      </div>
    </div>
  )
}

function QuickAction({
  title,
  desc,
  icon: Icon,
  onClick,
}: {
  title: string
  desc: string
  icon: any
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={[
        'group cursor-pointer flex w-full items-center justify-between gap-3 rounded-2xl',
        'border border-slate-200 bg-white px-3 py-3 text-left',
        'transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm',
        'dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-900/60',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {desc}
          </p>
        </div>
      </div>

      {/* زر واحد فقط */}
      <Button type="button" className="h-9 rounded-xl px-3 text-xs">
        فتح
      </Button>
    </div>
  )
}


function ChartSkeleton() {
  return (
    <div className="h-full w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-4 h-[240px] w-full animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
      <div className="mt-4 flex gap-2">
        <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  )
}

/* =========================
   HELPERS / DESIGN TOKENS
========================= */

function formatNumber(n: number) {
  try {
    return new Intl.NumberFormat('ar').format(n)
  } catch {
    return String(n)
  }
}

const ORDER_COLORS: Record<OrderKey, string> = {
  pending: '#f59e0b',    // amber
  accepted: '#22c55e',   // green
  rejected: '#f43f5e',   // rose
  completed: '#0ea5e9',  // sky
  cancelled: '#94a3b8',  // slate
}

const ACCENTS = {
  sky: {
    glow: 'radial-gradient(circle at 30% 30%, rgba(14,165,233,0.55), transparent 60%)',
    badgeBg: 'rgba(14,165,233,0.12)',
    badgeBorder: 'rgba(14,165,233,0.22)',
    icon: '#0284c7',
    dot: '#0ea5e9',
  },
  indigo: {
    glow: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.55), transparent 60%)',
    badgeBg: 'rgba(99,102,241,0.12)',
    badgeBorder: 'rgba(99,102,241,0.22)',
    icon: '#4f46e5',
    dot: '#6366f1',
  },
  orange: {
    glow: 'radial-gradient(circle at 30% 30%, rgba(249,115,22,0.55), transparent 60%)',
    badgeBg: 'rgba(249,115,22,0.12)',
    badgeBorder: 'rgba(249,115,22,0.22)',
    icon: '#ea580c',
    dot: '#f97316',
  },
  emerald: {
    glow: 'radial-gradient(circle at 30% 30%, rgba(34,197,94,0.55), transparent 60%)',
    badgeBg: 'rgba(34,197,94,0.12)',
    badgeBorder: 'rgba(34,197,94,0.22)',
    icon: '#16a34a',
    dot: '#22c55e',
  },
}

const TONES = {
  amber: { bg: 'rgba(245,158,11,0.15)', fg: '#b45309' },
  emerald: { bg: 'rgba(34,197,94,0.15)', fg: '#16a34a' },
  rose: { bg: 'rgba(244,63,94,0.15)', fg: '#e11d48' },
  sky: { bg: 'rgba(14,165,233,0.15)', fg: '#0284c7' },
  slate: { bg: 'rgba(148,163,184,0.18)', fg: '#475569' },
}
