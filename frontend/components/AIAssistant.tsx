"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "Upcoming music events",
  "How do I book tickets?",
  "Events under ₹1500",
  "Host an event as organizer",
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your Eventify assistant. Ask me about discovering events, ticket availability, booking steps, or venue locations.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const send = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: textToSend };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        message: userMsg.content,
        history: nextMessages.slice(-6),
      });

      const reply =
        res.data?.data?.reply ||
        res.data?.response ||
        res.data?.reply ||
        "I'm here to help! Feel free to ask about upcoming events.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not connect to the assistant service right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div
          role="dialog"
          aria-label="Eventify AI Assistant"
          className="mb-3 flex h-[min(32rem,calc(100vh-6.5rem))] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-white shadow-modal animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-slate-50/80 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white shadow-subtle">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  Eventify AI
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] text-muted-foreground">
                    Online • Groq Assistant
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close Assistant"
              className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                    m.role === "user"
                      ? "bg-slate-200 text-slate-700"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {m.role === "user" ? (
                    <UserIcon className="h-3 w-3" />
                  ) : (
                    <Bot className="h-3 w-3" />
                  )}
                </div>
                <div
                  className={`max-w-[82%] rounded-xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "rounded-tr-xs bg-primary text-white"
                      : "rounded-tl-xs border border-border bg-slate-50 text-slate-800"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px]">
                  <Bot className="h-3 w-3" />
                </div>
                <div className="flex items-center gap-1 rounded-xl rounded-tl-xs border border-border bg-slate-50 px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.3s]" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && !loading && (
            <div className="flex flex-wrap gap-1.5 border-t border-border/60 bg-slate-50/50 p-2.5">
              {SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => send(item)}
                  className="rounded-md border border-border bg-white px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {/* Input field */}
          <div className="flex items-center gap-2 border-t border-border p-2.5 bg-white">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask a question..."
              className="h-9 text-xs"
            />
            <Button
              size="sm"
              className="h-9 px-3 shrink-0"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Floating launcher */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-modal transition-transform duration-150 hover:scale-105 active:scale-95"
        aria-label="Toggle AI Assistant"
      >
        <Sparkles className="h-5 w-5" />
      </button>
    </div>
  );
}
