"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Music,
  Palette,
  Laptop,
  Trophy,
  Mic2,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  Star,
  CalendarRange,
  ShieldCheck,
  Ticket,
  ChevronRight,
  Zap,
  Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";

const categories = [
  { name: "Music", icon: Music },
  { name: "Art", icon: Palette },
  { name: "Technology", icon: Laptop },
  { name: "Sports", icon: Trophy },
  { name: "Conferences", icon: Mic2 },
  { name: "Food", icon: UtensilsCrossed },
];

const metrics = [
  { label: "Active events", value: "5k+" },
  { label: "Happy attendees", value: "120k" },
  { label: "Cities covered", value: "42" },
];

const highlights = [
  {
    title: "Curated experiences",
    description: "Every event is hand-picked to feel exciting, relevant, and worth your time.",
    icon: Sparkles,
  },
  {
    title: "Fast, secure checkout",
    description: "Reserve tickets in seconds with a smooth flow and trusted payment support.",
    icon: ShieldCheck,
  },
  {
    title: "For every vibe",
    description: "From solo nights to creative meetups, there is always something happening nearby.",
    icon: Star,
  },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    api
      .get("/events", {
        params: { limit: 8, sort: "date_asc" },
      })
      .then((res) => setEvents(res.data.data.events))
      .catch(() => setEvents([]));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href =
      `/events?search=${encodeURIComponent(search)}` +
      `&location=${encodeURIComponent(location)}`;
  };

  return (
    <main className="overflow-hidden">

      {/* HERO */}
      <section className="relative isolate overflow-hidden gradient-hero text-foreground">

        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="ambient-orb-primary absolute left-[-14%] top-[-20%] h-[520px] w-[520px]" />
          <div className="ambient-orb-accent absolute right-[-9%] top-[8%] h-[480px] w-[480px]" />
          <div className="absolute bottom-[-30%] left-[35%] h-[440px] w-[440px] rounded-full bg-accent/8 blur-[110px]" />
        </div>

        <div className="paper-grid pointer-events-none absolute inset-0 opacity-60" />

        <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[680px] items-center gap-14 py-14 lg:grid-cols-[1.04fr_0.96fr] lg:py-16">

            {/* Hero content */}
            <div className="max-w-3xl">
              <div className="reveal-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-muted-foreground shadow-lg backdrop-blur-xl">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                  <Sparkles className="h-3 w-3 text-primary" />
                </span>
                The smarter way to make plans
              </div>

              <h1 className="reveal-up reveal-delay-1 mt-7 max-w-2xl text-5xl font-black leading-[0.94] tracking-[-0.06em] sm:text-6xl lg:text-7xl xl:text-[78px]">
                The plans you&apos;ll
                <span className="block gradient-text">
                  remember start here.
                </span>
              </h1>

              <p className="reveal-up reveal-delay-2 mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                One place for the moments that matter. Discover exceptional events,
                book in seconds, and go out more often.
              </p>

              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="reveal-up reveal-delay-3 mt-9 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 shadow-glass-lg backdrop-blur-xl"
              >
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex min-h-14 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 backdrop-blur-md">
                    <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search events, artists, or experiences"
                      className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="flex min-h-14 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 backdrop-blur-md sm:w-52">
                    <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                      className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                  </div>

                  <Button type="submit" size="lg" className="h-14 rounded-xl px-7">
                    <Search className="mr-2 h-4 w-4" />
                    Explore
                  </Button>
                </div>
              </form>

              {/* Metrics */}
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                {metrics.map((metric, index) => (
                  <div
                    key={metric.label}
                    className={`pr-8 ${index !== metrics.length - 1 ? "border-r border-white/10" : ""}`}
                  >
                    <p className="text-2xl font-bold tracking-tight">{metric.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex -space-x-2">
                    {["bg-primary/70", "bg-accent/70", "bg-primary/50"].map((color) => (
                      <span key={color} className={`h-6 w-6 rounded-full border-2 border-background ${color}`} />
                    ))}
                  </div>
                  Loved by event-goers
                </div>
              </div>
            </div>

            {/* Featured visual */}
            <div className="reveal-up reveal-delay-2 relative mx-auto w-full max-w-[480px] lg:ml-auto">
              <div className="absolute inset-10 rounded-[3rem] bg-primary/10 blur-3xl" />
              <div className="absolute -inset-8 rounded-full border border-primary/10" />
              <div className="absolute -inset-16 rounded-full border border-white/[0.04]" />

              <div className="glass-strong relative rounded-[2rem] p-3.5">

                <div className="flex items-center justify-between px-3 py-3">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Happening this weekend
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-current text-primary" />
                    4.9
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-primary/20 via-accent/10 to-surface">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85"
                      alt="Crowd enjoying a live music event"
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 480px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-background/30 to-background/85" />
                    <div className="absolute -right-8 top-6 h-48 w-48 rounded-full border-[18px] border-white/10" />
                    <div className="absolute -left-10 bottom-[-80px] h-48 w-48 rounded-full border-[26px] border-primary/15" />

                    <div className="absolute left-6 top-6 rounded-xl border border-white/15 bg-background/40 px-3 py-2 backdrop-blur-md">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Featured</p>
                      <p className="mt-1 text-sm font-bold">Mumbai&apos;s most-loved night</p>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
                        <Ticket className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="text-3xl font-black tracking-tight">Sunset Live Fest</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Music · Food · Live performances</p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 bg-white/[0.03] p-5">
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <CalendarRange className="h-4 w-4 text-primary" />
                        Sat, 12 Sep · 7:30 PM
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-primary" />
                        Jio Gardens, Mumbai
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Starting at</p>
                        <p className="mt-1 text-2xl font-bold">₹1,299</p>
                      </div>
                      <Link href="/events">
                        <Button variant="secondary" className="rounded-xl">
                          View event
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-3 top-28 rounded-2xl border border-white/10 bg-background/90 p-3 shadow-glass backdrop-blur-xl sm:-right-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
                      <Zap className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Availability</p>
                      <p className="text-xs font-bold text-accent">18 tickets left</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-2 rounded-2xl border border-white/10 bg-background/90 px-4 py-3 shadow-glass backdrop-blur-xl sm:-left-5">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-current text-primary" />
                    <span className="text-sm font-bold">4.9/5</span>
                    <span className="text-xs text-muted-foreground">attendee rating</span>
                  </div>
                </div>

                <div className="absolute -left-5 top-16 hidden rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2.5 shadow-glass backdrop-blur-xl sm:block">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10">
                      <Play className="h-3 w-3 fill-current" />
                    </span>
                    2,400+ going
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="section-label mb-3">Explore</div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Find your kind of experience
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              From live music to technology and food, discover something worth making plans for.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80 sm:inline-flex"
          >
            Explore all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ name, icon: Icon }) => (
            <Link
              key={name}
              href={`/events?category=${encodeURIComponent(name)}`}
              className="group glass card-hover relative overflow-hidden p-6"
            >
              <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/15" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm font-semibold">{name}</p>
                <div className="mt-2 flex items-center text-xs text-muted-foreground transition-colors group-hover:text-primary">
                  Explore
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-[88rem] px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {highlights.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="soft-panel card-hover group p-7 sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="relative py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-white/[0.015]" />
        <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Hand-picked
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Events worth discovering
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore some of the latest experiences on Eventify.
              </p>
            </div>
            <Link href="/events" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="glass mt-10 px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                <Ticket className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-5 font-semibold">No events available yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Check back soon for new experiences.</p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative overflow-hidden py-20 lg:py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/8 blur-[100px]" />
        <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Simple by design
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              From discovery to memories
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Everything you need to find and book your next experience.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Discover",
                description: "Browse curated experiences based on your interests and location.",
              },
              {
                step: "02",
                title: "Book confidently",
                description: "Choose your tickets and complete a simple, secure checkout.",
              },
              {
                step: "03",
                title: "Show up",
                description: "Get ready to connect, celebrate, learn, and create memories.",
              },
            ].map((item) => (
              <div key={item.step} className="glass card-hover group p-8">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
                    {item.step}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-muted-foreground" />
                </div>
                <h3 className="mt-7 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-surface via-background to-surface px-6 py-14 shadow-glass-lg backdrop-blur-xl sm:px-10 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/5 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Trusted experiences
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready for your next unforgettable experience?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Find something exciting, book your tickets, and make plans worth remembering.
              </p>
            </div>
            <Link href="/events" className="shrink-0">
              <Button size="lg" className="h-12 rounded-xl px-7">
                Explore events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
