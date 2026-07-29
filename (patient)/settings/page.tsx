"use client";

import { useState , useEffect } from "react";
import {
  Settings,
  UserCog,
  Bell,
  Palette,
  ShieldCheck,
  Languages,
  Cpu,
  Smartphone,
  Trash2,
  LogOut,
  AlertTriangle,

} from "lucide-react";
import Button from "@/components/ui/button";
import { settingsApi } from "@/lib/api";



type ThemeMode = "light" | "dark" | "system";



export default function SettingsPage() {
  // === حالات تجريبية فقط (ستُربط مع الـ API لاحقاً) ===
  const [notifyMeds, setNotifyMeds] = useState(true);
  const [notifyInteractions, setNotifyInteractions] = useState(true);
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [aiAutoExplain, setAiAutoExplain] = useState(true);
  const [aiAutoInteractions, setAiAutoInteractions] = useState(true);
  const [aiTts, setAiTts] = useState(false);
  const [lastCacheClear, setLastCacheClear] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>("system");


  const handleChangePassword = () => {
    // لاحقاً: توجيه لصفحة تغيير كلمة المرور أو فتح مودال
    window.location.href = "/settings/change-password";
  };

  const handleChangeTheme = () => {
    window.location.href = "/settings/theme";
  }

  const handleLogoutAll = () => {
    // لاحقاً: استدعاء API لتسجيل الخروج من كل الأجهزة
    window.location.href = "/auth/login";
  };

  const handleDeleteAccount = () => {
    // لاحقاً: فتح مودال تأكيد + استدعاء API للحذف
    const confirmDelete = window.confirm(
      "هل أنت متأكد أنك تريد حذف حسابك نهائياً؟ لا يمكن التراجع عن هذه الخطوة."
    );
    if (confirmDelete) {
      window.location.href = "/"; // واجهة الترحيب بعد الحذف
    }
  };


  useEffect(() => {
  const loadSettings = async () => {
    const res = await settingsApi.get();
    if (!res.success || !res.data) return;

    const map = Object.fromEntries(
      res.data.map(s => [s.key, s.value])
    );

    setNotifyMeds(map["notify.meds"] !== "false");
    setNotifyInteractions(map["notify.interactions"] !== "false");
    setNotifyOrders(map["notify.orders"] !== "false");

    setLang(map["app.language"] === "en" ? "en" : "ar");

    setAiAutoExplain(map["ai.autoExplain"] !== "false");
    setAiAutoInteractions(map["ai.autoInteractions"] !== "false");
    setAiTts(map["ai.tts"] === "true");

    setTheme((map["app.theme"] as ThemeMode) ?? "system");
  };

  loadSettings();
}, []);


  const handleClearCache = () => {
    // لاحقاً: مسح بيانات مخزنة محلياً
    const now = new Date();
    setLastCacheClear(now.toLocaleString("ar-EG"));
    alert("تجريبي: تم مسح بيانات الكاش المخزنة محلياً (وهمياً).");
  };


  const saveSetting = async (key: string, value: boolean | string) => {
  await settingsApi.update([
    { key, value: String(value) },
  ]);
};



  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-3 md:pt-6 px-3 md:px-6"
    >
      <div className="max-w-5xl mx-auto space-y-5 md:space-y-7">
        {/* ===== رأس الصفحة ===== */}
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 md:h-12 md:w-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-300">
              <Settings size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">
                إعدادات النظام
              </h1>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                تحكّم في حسابك، الإشعارات، المظهر، الخصوصية، والمساعد الطبي الذكي من مكان واحد.
              </p>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end text-[11px] text-slate-500 dark:text-slate-400">
            <span>⚕️ منصة MediScan الطبية</span>
            <span>هذه الإعدادات تؤثر على تجربة استخدامك بالكامل داخل التطبيق.</span>
          </div>
        </header>

        {/* ===== شبكة الكروت الرئيسية ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          {/* === 1. إعدادات الحساب === */}
          <section className="rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-5 space-y-4">
            <CardHeader
              icon={
                <UserCog className="text-blue-600 dark:text-blue-300" size={22} />
              }
              title="إعدادات الحساب"
              subtitle="بيانات الدخول وإدارة الجلسات والأمان الأساسي."
            />

            <div className="space-y-3 text-xs md:text-sm">
              <InfoRow
                label="البريد الإلكتروني المسجّل"
                value="patient@example.com"
              />
              <InfoRow label="رقم الموبايل" value="+970 59 000 0000" />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="button"
                className="px-3 py-2 text-xs md:text-sm"
                onClick={handleChangePassword}
              >
                تغيير كلمة المرور
              </Button>
              <button
                type="button"
                onClick={handleLogoutAll}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs md:text-sm rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Smartphone size={14} />
                <span>تسجيل الخروج من جميع الأجهزة</span>
              </button>
            </div>
          </section>

          {/* === 2. الإشعارات === */}
          <section className="rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-5 space-y-4">
            <CardHeader
              icon={<Bell className="text-amber-500" size={22} />}
              title="إشعارات النظام"
              subtitle="التحكم في تذكيرات الأدوية، التداخلات، والطلبات."
            />

            <div className="space-y-3 text-xs md:text-sm">
              <ToggleRow
  id="notifyMeds"
  label="تذكيرات تناول الأدوية"
  description="استقبال إشعارات في أوقات الجرعات المجدولة."
  checked={notifyMeds}
  onChange={(v) => {
    setNotifyMeds(v);
    saveSetting("notify.meds", v);
  }}
/>

              <ToggleRow
  id="notifyInteractions"
  label="تنبيهات التداخلات الدوائية"
  description="إعلامك عند اكتشاف تفاعل دوائي خطير أو متوسط."
  checked={notifyInteractions}
  onChange={(v) => {
    setNotifyInteractions(v);
    saveSetting("notify.interactions", v);
  }}
/>

              <ToggleRow
  id="notifyOrders"
  label="إشعارات الطلبات والصيدليات"
  description="تحديثات حول حالة طلبات الأدوية ورسائل الصيدليات."
  checked={notifyOrders}
  onChange={(v) => {
    setNotifyOrders(v);
    saveSetting("notify.orders", v);
  }}
/>

            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              يمكن لاحقاً تخصيص طريقة استقبال الإشعارات (بريد، SMS، إشعارات موبايل)
              حسب إعداداتك وحسب مزوّد الخدمة.
            </p>
          </section>

          {/* === 3. المظهر (الثيم) === */}
          <section className="rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-5 space-y-4">
            <CardHeader
              icon={<Palette className="text-sky-500" size={22} />}
              title="مظهر التطبيق"
              subtitle="اختر بين الوضع الفاتح، الداكن، أو التلقائي."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm">
              <ThemeOption
                id="theme-light"
                label="وضع فاتح"
                description="خلفية بيضاء مناسبة للأماكن المضيئة."
                selected={theme === "light"}
                onSelect={() => {
  setTheme("light");
  saveSetting("app.theme", "light");
}}

              />
              <ThemeOption
                id="theme-dark"
                label="وضع داكن"
                description="خلفية كحلية مريحة للعين ليلاً."
                selected={theme === "dark"}
onSelect={() => {
  setTheme("dark");
  saveSetting("app.theme", "dark");
}}
              />
              <ThemeOption
                id="theme-system"
                label="حسب النظام"
                description="مزامنة مع إعدادات نظام التشغيل."
                selected={theme === "system"}
onSelect={() => {
  setTheme("system");
  saveSetting("app.theme", "system");
}}
              />
            </div>

            <Button
              type="button"
              className="px-3 py-2 text-xs md:text-sm"
              onClick={handleChangeTheme}
            >
              تغيير الثيم
            </Button>
          </section>

          {/* === 4. اللغة === */}
          <section className="rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-5 space-y-4">
            <CardHeader
              icon={<Languages className="text-emerald-500" size={22} />}
              title="اللغة والتعريب"
              subtitle="اختر لغة واجهة التطبيق الأساسية."
              
            />

            <div className="flex flex-wrap gap-2 text-xs md:text-sm">
              <button
                type="button"
onClick={() => {
  setLang("ar");
  saveSetting("app.language", "ar");
}}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs md:text-sm transition ${lang === "ar"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                  }`}
              >
                <span>🇸🇦</span>
                <span>العربية (افتراضي)</span>
              </button>

              <button
                type="button"
onClick={() => {
  setLang("en");
  saveSetting("app.language", "en");
}}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs md:text-sm transition ${lang === "en"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                  }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              سيتم مستقبلاً دعم ترجمة المحتوى الطبي والرسائل بالكامل بين العربية
              والإنجليزية بناءً على هذا الخيار.
            </p>
          </section>

          {/* === 5. الخصوصية والأمان === */}
          <section className="rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-5 space-y-4">
            <CardHeader
              icon={<ShieldCheck className="text-emerald-600" size={22} />}
              title="الخصوصية والأمان"
              subtitle="التحكم في بياناتك الطبية وكيفية استخدامها."
            />

            <div className="space-y-3 text-xs md:text-sm">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 px-3 py-2.5">
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                  سياسة حماية البيانات
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  يتم تخزين بياناتك الطبية بطريقة مشفّرة ولن تُشارك مع أي جهة خارجية
                  بدون موافقتك الصريحة، وفقاً لسياسات الخصوصية المعتمدة.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-rose-300 dark:border-rose-700 text-xs md:text-sm text-rose-700 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition"
                >
                  <Trash2 size={14} />
                  <span>طلب حذف الحساب</span>
                </button>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-amber-700 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl px-3 py-2">
                <AlertTriangle size={14} />
                <p>
                  تنبيه: حذف الحساب سيؤدي إلى إزالة كل بياناتك الطبية وطلباتك نهائياً،
                  ولن يكون بالإمكان استعادتها لاحقاً.
                </p>
              </div>
            </div>
          </section>

          {/* === 6. إعدادات المساعد الطبي (AI) === */}
          <section className="rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-5 space-y-4">
            <CardHeader
              icon={<Cpu className="text-purple-500" size={22} />}
              title="إعدادات المساعد الطبي الذكي"
              subtitle="تحكّم في كيفية تفاعل MediScan AI معك."
            />

            <div className="space-y-3 text-xs md:text-sm">
             <ToggleRow
  id="aiAutoExplain"
  label="شرح تلقائي للأدوية الجديدة"
  description="عند إضافة دواء جديد إلى أدويتي، يقوم المساعد بشرح مبسّط عنه."
  checked={aiAutoExplain}
  onChange={(v) => {
    setAiAutoExplain(v);
    saveSetting("ai.autoExplain", v);
  }}
/>

              <ToggleRow
  id="aiAutoInteractions"
  label="تحليل تلقائي للتداخلات الدوائية"
  description="عند إضافة أكثر من دواء، يحاول النظام اكتشاف التفاعلات بينها."
  checked={aiAutoInteractions}
  onChange={(v) => {
    setAiAutoInteractions(v);
    saveSetting("ai.autoInteractions", v);
  }}
/>

              <ToggleRow
  id="aiTts"
  label="تشغيل القراءة الصوتية (Text-to-Speech)"
  description="إتاحة خيار قراءة الردود الطبية بصوت عربي واضح."
  checked={aiTts}
  onChange={(v) => {
    setAiTts(v);
    saveSetting("ai.tts", v);
  }}
/>

            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              هذه الإعدادات ستكون فعّالة بعد ربط واجهة الشات مع نموذج الذكاء
              الاصطناعي وقاعدة بيانات الأدوية.
            </p>
          </section>

          {/* === 7. إعدادات التطبيق === */}
          <section className="rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-5 space-y-4">
            <CardHeader
              icon={<Smartphone className="text-slate-600 dark:text-slate-200" size={22} />}
              title="إعدادات التطبيق"
              subtitle="إدارة التخزين، الأداء، وتسجيل الخروج."
            />

            <div className="space-y-3 text-xs md:text-sm">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 px-3 py-2.5">
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                  بيانات الكاش المحلية
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  قد يحتفظ التطبيق ببعض البيانات الطبية مؤقتاً لتحسين سرعة التحميل. يمكنك
                  مسح هذه البيانات في أي وقت.
                </p>
                <div className="flex items-center justify-between mt-2">
                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Trash2 size={13} />
                    <span>مسح بيانات الكاش</span>
                  </button>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    آخر مسح: {lastCacheClear || "لم يتم بعد"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  window.location.href = "/auth/login"
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-rose-300 dark:border-rose-700 text-xs md:text-sm text-rose-700 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition"
              >
                <LogOut size={14} />
                <span>تسجيل الخروج من هذا الجهاز</span>
              </button>
            </div>
          </section>
        </div>

        {/* ===== تنبيه أسفل الصفحة ===== */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center pb-3">
          ملاحظة: معظم هذه الإعدادات حالياً تجريبية من جهة الواجهة فقط، وسيتم ربطها
          لاحقاً مع واجهات برمجية (APIs) خاصة بالفريق الخلفي وفريق الذكاء الاصطناعي.
        </p>
      </div>
    </div>
  );
}

/* ============ مكوّنات مساعدة داخل نفس الملف ============ */

function CardHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h2 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h2>
        <p className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 px-3 py-2">
      <span className="text-[11px] text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

function ToggleRow({ id, label, description, checked, onChange }: ToggleRowProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 px-3 py-2.5">
      <div className="flex-1">
        <label
          htmlFor={id}
          className="block text-xs font-medium text-slate-800 dark:text-slate-100"
        >
          {label}
        </label>
        <p className="text-[11px] text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
      <div className="pt-1">
        <label className="inline-flex items-center cursor-pointer" htmlFor={id}>
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            className="sr-only"
          />
          <span
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked
                ? "bg-blue-600 dark:bg-blue-500"
                : "bg-slate-300 dark:bg-slate-600"
              }`}
            aria-hidden="true"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-1"
                }`}
            />
          </span>
        </label>
      </div>
    </div>
  );
}

interface ThemeOptionProps {
  id: string;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

function ThemeOption({
  id,
  label,
  description,
  selected,
  onSelect,
}: ThemeOptionProps) {
  return (
    <button
      type="button"
      id={id}
      onClick={onSelect}
      className={`flex flex-col items-start text-right rounded-2xl border px-3 py-2.5 transition text-xs md:text-sm ${selected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100"
          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
        }`}
      title={label}
    >
      <span className="font-medium mb-0.5">{label}</span>
      <span className="text-[11px] text-slate-600 dark:text-slate-300">
        {description}
      </span>
    </button>
  );
}
