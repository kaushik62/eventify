"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Ticket,
  CreditCard,
  User,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const faqSections = [
  {
    id: "booking",
    icon: Ticket,
    title: "Booking & Ticketing",
    questions: [
      {
        q: "How do I book tickets on Eventify?",
        a: "Navigate to the Explore Events page, choose your event to view its full details, select your ticket quantity, and proceed to our secure checkout powered by Razorpay.",
      },
      {
        q: "Can I book multiple tickets in a single order?",
        a: "Yes. Use the stepper on the event details page to reserve multiple seats simultaneously. The total price and seat allocations update in real-time.",
      },
      {
        q: "How do I access my tickets after booking?",
        a: "Immediately following checkout, you receive an electronic voucher with a unique EVT reference ID. You can also view and download all your past and upcoming tickets from My Bookings in your attendee dashboard.",
      },
      {
        q: "What happens if an event sells out?",
        a: "When capacity is reached, the booking widget automatically indicates 'Sold out' and disables new reservations to prevent overbooking.",
      },
    ],
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Payments & Receipts",
    questions: [
      {
        q: "What payment methods are supported?",
        a: "We support all major payment instruments through Razorpay, including UPI (Google Pay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), and Net Banking.",
      },
      {
        q: "Are transactions secure?",
        a: "Yes. Payment credentials are never stored on Eventify servers. All transactions undergo bank-grade 256-bit SSL encryption and PCI DSS compliant processing via Razorpay.",
      },
      {
        q: "Are there any hidden booking charges?",
        a: "None. The ticket price shown on the event listing is the total amount you pay.",
      },
    ],
  },
  {
    id: "organizer",
    icon: CalendarDays,
    title: "Organizer Workspace",
    questions: [
      {
        q: "How do I host an event as an organizer?",
        a: "Sign up with an Organizer account or choose 'Host Events' during registration. From your Organizer Dashboard, click 'Create Event' to specify ticket counts, venue details, pricing, and promotional photos.",
      },
      {
        q: "How do I monitor attendee check-ins?",
        a: "Your organizer portal provides an Attendee Bookings ledger showing real-time names, emails, ticket counts, and settled revenue for each published listing.",
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-white shadow-subtle overflow-hidden transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left"
        aria-expanded={open}
      >
        <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
          {question}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-border bg-slate-50/50 p-4 sm:p-5 pt-3">
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const displayedSections = activeSection
    ? faqSections.filter((s) => s.id === activeSection)
    : faqSections;

  return (
    <main className="min-h-screen bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            Help & Documentation
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Clear answers to questions regarding booking, payments, and hosting events.
          </p>
        </div>

        {/* Section Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveSection(null)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              !activeSection
                ? "border-primary bg-primary text-white shadow-subtle"
                : "border-border bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Questions
          </button>
          {faqSections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                activeSection === s.id
                  ? "border-primary bg-primary text-white shadow-subtle"
                  : "border-border bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-8">
          {displayedSections.map((sec) => (
            <div key={sec.id} className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-border pb-2">
                {sec.title}
              </h2>
              <div className="space-y-3">
                {sec.questions.map((q) => (
                  <FAQItem key={q.q} question={q.q} answer={q.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Still have a question?
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Our support team is available to assist attendees and organizers.
            </p>
          </div>
          <Link href="/contact">
            <Button size="sm">
              Contact Support
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
