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
  "Tech conferences under ₹2000",
  "How to host an event?",
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi there! 👋 I'm your Eventify AI Assistant. Ask me anything about upcoming events, ticket prices, locations, or how to book!",
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
        "I'm here to help! Feel free to ask about any events.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process your request right now. Please try again in a moment!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <div
          role="dialog"
          aria-label="AI Event Assistant"
          className="mb-3 flex h-[min(34rem,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/15 bg-[hsl(222_36%_6%/0.95)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-primary/20 via-violet-500/20 to-primary/10 p-4 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">Eventify Assistant</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Always active • Instant answers</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close AI Assistant"
              className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 space-y-3.5 overflow-y-auto p-4 text-sm scrollbar-none">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/10 text-primary"
                  }`}
                >
                  {m.role === "user" ? <UserIcon className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                </div>
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "rounded-tr-sm bg-primary text-primary-foreground"
                      : "rounded-tl-sm border border-white/10 bg-white/[0.05] text-foreground shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-primary text-xs">
                  <Bot className="h-3 w-3" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestion Chips */}
          {messages.length <= 2 && !loading && (
            <div className="flex flex-wrap gap-1.5 border-t border-white/5 bg-white/[0.02] px-3 py-2">
              {SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => send(item)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="flex gap-2 border-t border-white/10 p-3 bg-white/[0.02]">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about events, prices, booking..."
              className="h-10 text-xs sm:text-sm bg-white/[0.05] border-white/10 focus-visible:ring-primary/30"
            />
            <Button
              size="icon"
              className="h-10 w-10 shrink-0 shadow-sm"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-tr from-primary via-primary/90 to-violet-500 text-white shadow-[0_8px_30px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Toggle AI Assistant"
      >
        <span className="absolute -inset-0.5 rounded-full bg-primary/40 blur-sm transition group-hover:blur-md" />
        <Sparkles className="relative h-6 w-6 animate-pulse" />
      </button>
    </div>
  );
}
