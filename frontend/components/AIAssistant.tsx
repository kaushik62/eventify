"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { ChatMessage } from "@/lib/types";
import { useAuth } from "@/lib/auth";

export function AIAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I can help you find events — try asking \"music events under ₹1000\"." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (!user) return null;

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/ai/chat", {
        message: userMsg.content,
        history: nextMessages.slice(-6),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
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
          aria-label="AI event assistant"
          aria-modal="false"
          className="mb-3 flex h-[min(32rem,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-80 flex-col overflow-hidden rounded-2xl border border-white/12 bg-background/90 shadow-glass-lg backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 gradient-brand p-4 text-white">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> AI Assistant
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close AI Assistant"
              className="rounded-lg p-1.5 transition hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                  m.role === "user"
                    ? "ml-auto border border-primary/20 bg-primary/90 text-primary-foreground"
                    : "border border-white/10 bg-white/[0.06] text-foreground"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="w-fit rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-sm text-muted-foreground">
                Thinking…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="flex gap-2 border-t border-white/10 p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about events..."
              className="h-9"
            />
            <Button size="icon" className="h-9 w-9 shrink-0" onClick={send} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="grid h-14 w-14 place-items-center rounded-full border border-white/15 gradient-brand text-white shadow-glow transition-transform hover:scale-105"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    </div>
  );
}
