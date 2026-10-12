"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSuccess(true);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Desk",
      value: "support@eventify.com",
      desc: "Guaranteed response within 24 hours",
    },
    {
      icon: Phone,
      label: "Phone Line",
      value: "+91 98765 43210",
      desc: "Mon–Fri, 9:30 AM – 6:30 PM IST",
    },
    {
      icon: MapPin,
      label: "Office Location",
      value: "Mumbai, Maharashtra",
      desc: "Bandra Kurla Complex, India",
    },
    {
      icon: Clock,
      label: "Average Response",
      value: "< 2 hours",
      desc: "During business hours",
    },
  ];

  return (
    <main className="min-h-screen bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            Get in Touch
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            We&apos;re here to help
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Have questions about ticket bookings, organizer onboarding, or custom integrations? Send us a note.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map(({ icon: Icon, label, value, desc }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-white p-5 shadow-card"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-3">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="mt-10 max-w-2xl mx-auto rounded-xl border border-border bg-white p-6 sm:p-8 shadow-card">
          {success ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Message Sent Successfully
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Thank you for contacting Eventify. Our support team has received your message and will respond to {form.email} shortly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSuccess(false);
                  setForm({ name: "", email: "", subject: "", message: "" });
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Your Name *
                  </label>
                  <Input
                    required
                    placeholder="Kaushik Sharma"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Email Address *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Subject
                </label>
                <Input
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us more about your question or inquiry..."
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="flex w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-xs text-foreground shadow-subtle outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full sm:w-auto h-10 text-xs"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                {loading ? "Sending Message..." : "Submit Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
