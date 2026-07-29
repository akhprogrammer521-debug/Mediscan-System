"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/button";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
}

export default function GuestChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text: "مرحباً بك في المساعد الطبي التجريبي لـ MediScan! اسأل عن دواء، تفاعل دوائي، أو طريقة استخدام عامة (للعرض فقط).",
    },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now(),
      from: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // رد تجريبي
    const botReply: Message = {
      id: Date.now() + 1,
      from: "bot",
      text:
        "هذا رد تجريبي من المساعد فقط. في النسخة الكاملة سيتم استخدام نموذج " +
        "ذكاء اصطناعي لتحليل سؤالك حول الأدوية أو التفاعلات الدوائية وإعطاء " +
        "معلومة طبية مبسّطة، مع تنبيهك دائماً لمراجعة طبيبك أو صيدلانياً مختصاً.",
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-h-[720px]">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-3">
        <h1 className="text-sm font-bold mb-1">المساعد الطبي الذكي (وضع الضيف)</h1>
        <p className="text-[11px] text-slate-600 dark:text-slate-300">
          هذه النسخة للتجربة فقط. الإجابات هنا مثال تقني وليست استشارات طبية حقيقية.
        </p>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 overflow-y-auto space-y-2"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${
                msg.from === "user"
                  ? "bg-primary-600 text-white rounded-br-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="mt-3 flex items-center gap-2">
        <input
          className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="اكتب سؤالك حول دواء أو تفاعل دوائي (تجريبي)..."
          aria-label="حقل إدخال سؤال للمساعد الطبي"
          title="حقل إدخال سؤال للمساعد الطبي"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button className="px-4 py-2 text-xs" onClick={handleSend}>
          إرسال
        </Button>
      </div>

      <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
        لا تعتمد على هذه الإجابات لاتخاذ قرارات طبية حقيقية. دائماً استشر طبيبك أو
        الصيدلاني.
      </p>
    </div>
  );
}
