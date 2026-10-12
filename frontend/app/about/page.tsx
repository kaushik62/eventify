import Link from "next/link";
import {
  Target,
  Eye,
  Heart,
  Zap,
  ShieldCheck,
  CalendarDays,
  Globe,
  Award,
  ArrowRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | Eventify",
  description: "Learn about Eventify's mission to modernize event discovery and ticketing.",
};

const metrics = [
  { value: "5,000+", label: "Events hosted", icon: CalendarDays },
  { value: "120,000+", label: "Tickets issued", icon: Users },
  { value: "42", label: "Cities covered", icon: Globe },
  { value: "99.8%", label: "Verified checkout rate", icon: Award },
];

const values = [
  {
    icon: Heart,
    title: "Community Centric",
    description: "Live experiences connect people. We build software that makes gathering seamless, accessible, and delightful.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability & Security",
    description: "Every ticket transaction is secured via Razorpay with instant order confirmation and verified receipt logging.",
  },
  {
    icon: Zap,
    title: "Frictionless Booking",
    description: "From discovery to checkout in under 30 seconds. No cluttered popups, dark patterns, or hidden markups.",
  },
  {
    icon: Users,
    title: "Empowering Organizers",
    description: "We provide event creators with dependable tooling for inventory management, real-time analytics, and attendee tracking.",
  },
];

const timeline = [
  {
    year: "2023",
    title: "Eventify Founded",
    desc: "Started as a focused local event directory in Mumbai, addressing slow and confusing checkout experiences.",
  },
  {
    year: "2024",
    title: "Nationwide Ticketing",
    desc: "Expanded ticketing to 15 cities, adding Razorpay integration and instant digital e-ticket voucher delivery.",
  },
  {
    year: "2025",
    title: "Organizer Portal & AI",
    desc: "Launched comprehensive organizer dashboards, S3-powered image hosting, and an intelligent event assistant.",
  },
  {
    year: "2026",
    title: "Next-Gen SaaS Platform",
    desc: "Rebuilt with an enterprise-grade design system, refined analytics, and seamless attendee discovery.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            About Eventify
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Modernizing the way people experience live events
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            Eventify is an event discovery, booking, and management platform built with craftsmanship. We connect passionate attendees with extraordinary organizers.
          </p>

        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-white p-6 shadow-card text-center"
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-3xl font-black tracking-tight text-slate-900">
                {value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-8 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-4">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Our Mission</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              To remove every friction point from discovering and booking live events, while providing organizers with robust software to grow their communities sustainably.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-8 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-4">
              <Eye className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Our Vision</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              A trusted ecosystem where every quality event finds its audience, and every attendee can book memorable live experiences with complete confidence.
            </p>
          </div>
        </div>

        {/* Values */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Our Core Principles
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              What guides our design decisions, engineering, and support.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-white p-5 shadow-card"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-3">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              The Journey So Far
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {timeline.map(({ year, title, desc }) => (
              <div
                key={year}
                className="flex gap-4 rounded-xl border border-border bg-white p-4 shadow-subtle"
              >
                <span className="shrink-0 flex h-8 w-12 items-center justify-center rounded-md bg-indigo-50 text-xs font-bold text-indigo-700">
                  {year}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
