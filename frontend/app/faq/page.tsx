"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  HelpCircle,
  Ticket,
  CreditCard,
  User,
  CalendarDays,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const faqSections = [
  {
    id: "booking",
    icon: Ticket,
    title: "Booking & Tickets",
    color: "text-primary bg-primary/10 border-primary/20",
    questions: [
      {
        q: "How do I book a ticket?",
        a: "Simply find an event you love on the Explore page, click on it to view details, select the number of tickets, and proceed to checkout. You'll be guided through a secure payment flow powered by Razorpay.",
      },
      {
        q: "Can I book tickets for multiple people?",
        a: "Yes! On the event details page, use the + / − controls to select the number of tickets you need. Each ticket is priced individually, and the total is shown before checkout.",
      },
      {
        q: "Will I receive a confirmation after booking?",
        a: "Yes. After a successful payment, you'll be taken to a booking confirmation page with your booking ID and all event details. You can also view your bookings from your dashboard.",
      },
      {
        q: "What happens if an event is sold out?",
        a: "If an event is sold out, the Book Now button will be disabled and show 'Sold Out'. You won't be able to purchase tickets for that event. We recommend booking early for popular events.",
      },
      {
        q: "Can I book my own event as an organizer?",
        a: "No, organizers cannot book tickets for events they have created. This is a platform policy to maintain fairness for attendees.",
      },
    ],
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Payments & Pricing",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "Eventify uses Razorpay as its payment processor, which supports UPI, credit/debit cards, net banking, and popular wallets. All transactions are secure and encrypted.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We never store your card details. All payments are handled by Razorpay, which is PCI DSS compliant and uses bank-grade encryption.",
      },
      {
        q: "Can I get a refund?",
        a: "Refund policies vary by event and organizer. Please contact the event organizer directly or reach out to our support team at support@eventify.com for assistance with refunds.",
      },
      {
        q: "Are there any booking fees?",
        a: "The price shown on the event listing is the final price per ticket. There are no hidden fees added by Eventify on top of the listed price.",
      },
    ],
  },
  {
    id: "account",
    icon: User,
    title: "Account & Profile",
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Get Started' on the top navigation bar. Enter your full name, email, and a password, then choose whether you want to attend events or organize them. You'll be logged in immediately.",
      },
      {
        q: "Can I change my account type from User to Organizer?",
        a: "Currently, the account type is set during registration. If you'd like to switch, please contact our support team and we'll assist you with the change.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "On the login page, you can use the 'Forgot Password' link to reset your password via email. If you continue to have issues, contact us at support@eventify.com.",
      },
      {
        q: "How do I view my booking history?",
        a: "Log in to your account and go to 'My Bookings' in the navigation menu or your dashboard. You'll see all upcoming and past bookings there.",
      },
    ],
  },
  {
    id: "organizer",
    icon: CalendarDays,
    title: "For Organizers",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    questions: [
      {
        q: "How do I create an event?",
        a: "After registering as an Organizer, log in and go to your Organizer Dashboard. Click 'Create Event', fill in all the details (title, description, date, location, tickets, price), upload a cover image, and publish.",
      },
      {
        q: "Can I edit an event after publishing?",
        a: "Currently, events can be managed through your organizer dashboard. Major details like price and dates may have restrictions once bookings have been made. Contact support for assistance.",
      },
      {
        q: "How do I manage attendees?",
        a: "From your Organizer Dashboard, you can view booking statistics, total tickets sold, and revenue for each event under 'Bookings'.",
      },
      {
        q: "Can I delete an event?",
        a: "Yes, you can delete events from the 'My Events' section in your organizer dashboard. Please note that deleting an event with existing bookings may affect attendees, so proceed with caution.",
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item overflow-hidden ${open ? "border-white/[0.16]" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold leading-6">{question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
            open ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-white/[0.07] px-5 pb-5 pt-4">
          <p className="text-sm leading-7 text-muted-foreground">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <main className="page-surface min-h-screen">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-accent/6 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-[88rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            Help Center
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Find answers to the most common questions about Eventify.
          </p>
        </div>

        {/* Category navigation */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveSection(null)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
              !activeSection
                ? "border-primary/30 bg-primary text-primary-foreground shadow-[0_4px_16px_-4px_hsl(var(--primary)/0.5)]"
                : "border-white/10 bg-white/[0.04] text-muted-foreground hover:border-white/20 hover:bg-white/[0.07] hover:text-foreground"
            }`}
          >
            All Topics
          </button>
          {faqSections.map(({ id, title, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id === activeSection ? null : id)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-all ${
                activeSection === id
                  ? "border-primary/30 bg-primary text-primary-foreground shadow-[0_4px_16px_-4px_hsl(var(--primary)/0.5)]"
                  : "border-white/10 bg-white/[0.04] text-muted-foreground hover:border-white/20 hover:bg-white/[0.07] hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {title}
            </button>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="mt-10 space-y-8">
          {faqSections
            .filter((s) => !activeSection || s.id === activeSection)
            .map(({ id, icon: Icon, title, color, questions }) => (
              <section key={id}>
                <div className="mb-5 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {questions.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {questions.map((item) => (
                    <FAQItem key={item.q} question={item.q} answer={item.a} />
                  ))}
                </div>
              </section>
            ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-16 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-primary/[0.04] p-8 text-center shadow-glass backdrop-blur-xl sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight">
            Still have questions?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Can&apos;t find the answer you&apos;re looking for? Our friendly support team is ready to help.
          </p>
          <Link href="/contact" className="mt-6 inline-flex">
            <span className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/15 hover:border-primary/45">
              Contact Support
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

      </div>
    </main>
  );
}
