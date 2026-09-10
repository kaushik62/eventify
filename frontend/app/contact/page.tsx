"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  Clock,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
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
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Support",
      value: "support@eventify.com",
      desc: "We reply within 24 hours",
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      icon: Phone,
      label: "Phone Support",
      value: "+91 98765 43210",
      desc: "Mon–Fri, 10 AM – 6 PM IST",
      color: "text-accent bg-accent/10 border-accent/20",
    },
    {
      icon: MapPin,
      label: "Office",
      value: "Mumbai, Maharashtra",
      desc: "India — 400001",
      color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "< 24 hours",
      desc: "For email inquiries",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <main className="page-surface min-h-screen">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-24 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute -right-40 top-1/2 h-80 w-80 rounded-full bg-accent/6 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-[88rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
            We&apos;re here to help
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Contact <span className="gradient-text">Eventify</span>
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Have a question, feedback, or need support? Our team is ready to help you.
          </p>
        </div>

        {/* Contact info grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map(({ icon: Icon, label, value, desc, color }) => (
            <div key={label} className="glass card-hover p-6">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="mt-1.5 font-semibold">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {/* Main content: form + FAQ */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Contact form */}
          <div className="premium-panel p-7 sm:p-9">
            {success ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold">Message Sent!</h2>
                <p className="mt-3 max-w-sm text-muted-foreground">
                  Thank you for reaching out, {form.name}. We&apos;ve received your message and will
                  reply to <strong className="text-foreground">{form.email}</strong> within 24 hours.
                </p>
                <Button
                  className="mt-8 rounded-xl"
                  onClick={() => { setSuccess(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-7">
                  <h2 className="text-2xl font-bold tracking-tight">Send us a message</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fill in the form and we&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                {error && (
                  <div role="alert" className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold">
                        Full name <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="contact-name"
                        required
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold">
                        Email address <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold">
                      Subject
                    </label>
                    <Input
                      id="contact-subject"
                      placeholder="What is this about?"
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={6}
                      placeholder="Tell us how we can help you..."
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      className="glass-input w-full p-3.5 text-sm"
                    />
                    <p className="mt-1.5 text-right text-xs text-muted-foreground">
                      {form.message.length} / 1000 characters
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/20"
                  >
                    {loading ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>

          {/* Sidebar: Quick help */}
          <div className="space-y-5">
            <div className="glass p-6">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Quick Help</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Before contacting us, check our FAQ — most questions are answered there.</p>
              </div>
              <Link href="/faq">
                <Button variant="outline" size="sm" className="mt-4 w-full rounded-xl gap-2">
                  View FAQ
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="glass p-6">
              <h3 className="mb-4 font-semibold">Common Topics</h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Booking a ticket",
                  "Payment issues",
                  "Event cancellations",
                  "Organizer accounts",
                  "Technical problems",
                  "Refund requests",
                ].map((topic) => (
                  <li key={topic}>
                    <Link
                      href="/faq"
                      className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-primary" />
                      {topic}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-sm font-semibold">Response Guarantee</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                We commit to responding to all inquiries within{" "}
                <strong className="text-foreground">24 business hours</strong>. Urgent issues
                are prioritized.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
