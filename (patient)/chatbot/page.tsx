"use client";

import { JSX, useState } from "react";
import {
  Bot,
  User,
  Pill,
  Stethoscope,
  AlertTriangle,
  Languages,
  Send,
} from "lucide-react";
import Button from "@/components/ui/button";
import { patientAiApi } from "@/lib/api";

type Role = "user" | "assistant";
type MessageKind = "normal" | "interaction" | "translation" | "warning";

interface ChatMessage {
  id: string;
  role: Role;
  kind: MessageKind;
  content: string;
  createdAt: number;
}

const SUGGESTED_QUESTIONS: { label: string; prompt: string; icon: JSX.Element }[] = [
  {
    label: "تحليل تداخل دوائي",
    prompt: "هل يوجد تفاعل دوائي بين Paracetamol 500mg و Ibuprofen 400mg؟",
    icon: <Pill size={16} />,
  },
  {
    label: "ترجمة وصفة أجنبية",
    prompt:
      "لدي وصفة مكتوبة باللغة الإنجليزية، هل يمكنك ترجمتها للعربية وشرح كل دواء باختصار؟",
    icon: <Languages size={16} />,
  },
  {
    label: "شرح دواء معيّن",
    prompt: "اشرح لي دواء Metformin 850mg: الاستطبابات، الجرعة، والتحذيرات.",
    icon: <Stethoscope size={16} />,
  },
  {
    label: "سؤال عام عن حالة",
    prompt: "ما هي الأمور التي يجب الانتباه لها عند استخدام أدوية الضغط مع السكري؟",
    icon: <AlertTriangle size={16} />,
  },
];

export default function MedicalAssistantPage() {

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      kind: "normal",
      createdAt: Date.now(),
      content:
        "مرحباً 👋 أنا المساعد الطبي الذكي في MediScan.\n\n" +
        "أستطيع مساعدتك في:\n" +
        "• التحقق من التداخلات الدوائية.\n" +
        "• شرح الأدوية والجرعات والتحذيرات.\n" +
        "• تحليل وصفات طبية.\n\n" +
        "ابدأ بكتابة سؤالك أو اختر أحد الاقتراحات.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachedImageName, setAttachedImageName] = useState<string | null>(null);

  const handleSend = async () => {
    const text = input.trim();
    if (!text && !attachedImageName) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      kind: "normal",
      content:
        attachedImageName && !text
          ? `أرفقتُ صورة (${attachedImageName}) لتحليلها.`
          : text,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await patientAiApi.chat(text, "ar");

      if (!res.success || !res.data) {
        throw new Error(res.error || "AI Error");
      }

      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        kind: "normal",
        content: res.data.answer,
        createdAt: Date.now(),
      };


      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          kind: "warning",
          content:
            "تعذر الحصول على رد طبي موثوق حاليًا. يرجى المحاولة لاحقًا.",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsSending(false);
      setAttachedImageName(null);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleChooseSuggestion = (prompt: string) => {
    setInput(prompt);
  };


  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-4 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center">
            <Bot />
          </div>
          <div>
            <h1 className="text-2xl font-bold">المساعد الطبي الذكي</h1>
            <p className="text-sm text-slate-500">
              معلومات دوائية ذكية مبنية على بياناتك الطبية
            </p>
          </div>
        </header>

        <section className="rounded-3xl bg-white dark:bg-slate-950 border flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {isSending && (
              <div className="text-xs text-slate-500">
                جاري معالجة سؤالك…
              </div>
            )}
          </div>

          <div className="border-t p-4 space-y-3">
            {attachedImageName && (
              <div className="text-xs text-blue-600">
                صورة مرفقة: {attachedImageName}
              </div>
            )}

            <div className="flex gap-2">
              <textarea
                className="flex-1 rounded-2xl border px-3 py-2 text-sm"
                placeholder="اكتب سؤالك هنا…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <Button onClick={handleSend} disabled={isSending}>
                <Send size={16} />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleChooseSuggestion(q.prompt)}
                  className="text-xs border rounded-2xl px-3 py-1"
                >
                  {q.icon} {q.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================= Chat Bubble ================= */

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {!isUser && <Bot size={18} />}
      <div
        className={`rounded-2xl px-4 py-2 text-sm max-w-lg ${isUser ? "bg-blue-600 text-white" : "bg-slate-100"
          }`}
      >
        {message.content}
      </div>
      {isUser && <User size={18} />}
    </div>
  );
}
