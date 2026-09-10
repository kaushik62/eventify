import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Target,
  Eye,
  Heart,
  Zap,
  ShieldCheck,
  Users,
  CalendarDays,
  TrendingUp,
  Globe,
  Award,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us",
  description: "Learn about Eventify's story, mission, and vision.",
};

const metrics = [
  { value: "5,000+", label: "Events hosted", icon: CalendarDays },
  { value: "120K+", label: "Happy attendees", icon: Users },
  { value: "42", label: "Cities covered", icon: Globe },
  { value: "98%", label: "Satisfaction rate", icon: Award },
];

const values = [
  {
    icon: Heart,
    title: "Community First",
    description:
      "We believe experiences are better shared. Every feature we build is designed to bring people together and create lasting memories.",
    color: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Security",
    description:
      "Your bookings, payments, and personal data are protected with industry-grade security. We partner only with trusted payment processors.",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Simplicity",
    description:
      "Booking an event should take seconds, not minutes. We obsess over removing friction so you can focus on the experience ahead.",
    color: "text-primary bg-primary/10 border-primary/20",
  },
  {
    icon: TrendingUp,
    title: "Empowering Organizers",
    description:
      "We provide organizers with powerful tools to create, manage, and grow their events — helping great experiences reach more people.",
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
];

const timeline = [
  {
    year: "2022",
    title: "The idea was born",
    desc: "Two friends frustrated with clunky event booking experiences decided to build something better.",
  },
  {
    year: "2023",
    title: "Eventify launched",
    desc: "We launched with 50 events in Mumbai and grew to 500 events in 6 months through word of mouth.",
  },
  {
    year: "2024",
    title: "Expanding across India",
    desc: "Eventify expanded to 15 cities, onboarded 200+ organizers, and crossed 50,000 bookings.",
  },
  {
    year: "2025",
    title: "Platform 2.0",
    desc: "We rebuilt the platform with powerful organizer tools, smarter discovery, and a premium experience.",
  },
];

export default function AboutPage() {
  return (
    <main className="page-surface overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="ambient-orb-primary absolute -left-40 -top-20 h-[500px] w-[500px]" />
          <div className="ambient-orb-accent absolute -right-32 top-10 h-[400px] w-[400px]" />
          <div className="paper-grid absolute inset-0 opacity-40" />
        </div>

        <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Our story
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              We&apos;re building the
              <span className="block gradient-text">future of events</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Eventify was born from a simple belief: finding and booking great experiences should
              be effortless, enjoyable, and accessible to everyone.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link href="/events">
                <Button size="lg" className="h-12 rounded-xl px-7">
                  Explore Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="h-12 rounded-xl px-7">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="mx-auto max-w-[88rem] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(({ value, label, icon: Icon }) => (
            <div key={label} className="stat-highlight card-hover group">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-3xl font-black tracking-tight">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="soft-panel group p-8 sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight">Our Mission</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              To make discovering and attending live experiences as easy and delightful as possible —
              empowering event-goers to say yes more often and enabling organizers to build
              extraordinary communities.
            </p>
          </div>

          <div className="soft-panel group p-8 sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight">Our Vision</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              A world where every great event is discoverable, every community has the tools to
              thrive, and every person has access to experiences that enrich their lives — regardless
              of where they are.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <Heart className="h-3.5 w-3.5 text-primary" />
              What we stand for
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our core values
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="glass card-hover group p-7">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="section-label mb-3">Journey</div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How we got here
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="relative space-y-0">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

            {timeline.map(({ year, title, desc }, i) => (
              <div key={year} className="relative flex gap-6 pb-10 last:pb-0">
                {/* Timeline dot */}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-background text-xs font-bold text-primary shadow-[0_0_16px_hsl(var(--primary)/0.3)]">
                    {i + 1}
                  </div>
                </div>

                <div className="glass card-hover flex-1 p-6">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {year}
                  </span>
                  <h3 className="mt-3 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-[88rem]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-surface via-background to-surface px-8 py-14 shadow-glass-xl backdrop-blur-xl text-center sm:px-12 lg:py-16">
            <div className="pointer-events-none absolute -right-32 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to experience Eventify?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join thousands of event-goers discovering unforgettable experiences every day.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/events">
                  <Button size="lg" className="h-12 rounded-xl px-7">
                    Browse Events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg" className="h-12 rounded-xl px-7">
                    Join Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
