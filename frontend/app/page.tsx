"use client";

import Link from "next/link";
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

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    api
      .get("/events", {
        params: {
          limit: 8,
          sort: "date_asc",
        },
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
    <main className="overflow-hidden bg-background">

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">

        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-15%] top-[-20%] h-[500px] w-[500px] rounded-full bg-violet-600/25 blur-[120px]" />
          <div className="absolute right-[-10%] top-[15%] h-[450px] w-[450px] rounded-full bg-fuchsia-500/15 blur-[120px]" />
          <div className="absolute bottom-[-25%] left-[35%] h-[400px] w-[400px] rounded-full bg-indigo-500/15 blur-[110px]" />
        </div>

        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid min-h-[680px] items-center gap-14 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">

            {/* Hero content */}
            <div className="max-w-3xl">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/80 shadow-lg backdrop-blur-xl">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20">
                  <Sparkles className="h-3 w-3 text-violet-300" />
                </span>
                Discover experiences worth showing up for
              </div>

              {/* Heading */}
              <h1 className="mt-7 text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-[82px]">
                Find your next
                <span className="block bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                  big experience.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                Discover concerts, workshops, food festivals, sports,
                conferences, and unforgettable experiences happening near you.
              </p>

              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="mt-9 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.07] p-2 shadow-2xl shadow-black/30 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-2 sm:flex-row">

                  {/* Search input */}
                  <div className="flex min-h-14 flex-1 items-center gap-3 rounded-xl bg-white px-4">
                    <Search className="h-5 w-5 shrink-0 text-slate-400" />

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search events, artists, or experiences"
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* Location */}
                  <div className="flex min-h-14 items-center gap-3 rounded-xl bg-white px-4 sm:w-52">
                    <MapPin className="h-5 w-5 shrink-0 text-slate-400" />

                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 rounded-xl bg-violet-600 px-6 font-semibold text-white shadow-lg shadow-violet-900/30 hover:bg-violet-500"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Explore
                  </Button>
                </div>
              </form>

              {/* Metrics */}
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-5">
                {metrics.map((metric, index) => (
                  <div
                    key={metric.label}
                    className={`pr-8 ${
                      index !== metrics.length - 1
                        ? "border-r border-white/10"
                        : ""
                    }`}
                  >
                    <p className="text-2xl font-bold tracking-tight">
                      {metric.value}
                    </p>

                    <p className="mt-1 text-xs text-white/45">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured visual */}
            <div className="relative mx-auto w-full max-w-md lg:ml-auto">

              {/* Glow */}
              <div className="absolute inset-8 rounded-[3rem] bg-violet-500/20 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.07] p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">

                {/* Top bar */}
                <div className="flex items-center justify-between px-3 py-3">
                  <div className="flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-semibold text-white/70">
                      Trending now
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <Star className="h-3.5 w-3.5 fill-current text-amber-300" />
                    4.9
                  </div>
                </div>

                {/* Main feature card */}
                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-violet-600 to-indigo-900">

                  {/* Fake visual */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.25),transparent_25%),radial-gradient(circle_at_80%_80%,rgba(217,70,239,.4),transparent_35%)]" />

                    <div className="absolute left-6 top-6 rounded-xl border border-white/20 bg-black/10 px-3 py-2 backdrop-blur-md">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/50">
                        Featured
                      </p>
                      <p className="mt-1 text-sm font-bold">
                        Live Experience
                      </p>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                        <Ticket className="h-6 w-6" />
                      </div>

                      <h2 className="text-3xl font-black tracking-tight">
                        Sunset Live Fest
                      </h2>

                      <p className="mt-1 text-sm text-white/60">
                        Music · Food · Live performances
                      </p>
                    </div>
                  </div>

                  {/* Feature details */}
                  <div className="bg-slate-950/30 p-5">

                    <div className="space-y-3 text-sm text-white/70">
                      <div className="flex items-center gap-3">
                        <CalendarRange className="h-4 w-4 text-violet-300" />
                        Sat, 12 Sep · 7:30 PM
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-violet-300" />
                        Jio Gardens, Mumbai
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/40">
                          Starting at
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          ₹1,299
                        </p>
                      </div>

                      <Link href="/events">
                        <Button className="rounded-xl bg-white text-slate-950 hover:bg-white/90">
                          View event
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating availability */}
                <div className="absolute -right-5 top-28 rounded-2xl border border-white/10 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10">
                      <Zap className="h-4 w-4 text-emerald-400" />
                    </div>

                    <div>
                      <p className="text-[10px] text-white/40">
                        Availability
                      </p>
                      <p className="text-xs font-bold text-emerald-300">
                        18 seats left
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating rating */}
                <div className="absolute -bottom-4 -left-5 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-current text-amber-300" />
                    <span className="text-sm font-bold">4.9/5</span>
                    <span className="text-xs text-white/40">
                      attendee rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CATEGORY SECTION
      ========================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <span className="h-px w-6 bg-primary" />
              Explore
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Find your kind of experience
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              From live music to technology and food, discover something
              worth making plans for.
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

        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ name, icon: Icon }) => (
            <Link
              key={name}
              href={`/events?category=${encodeURIComponent(name)}`}
              className="group relative overflow-hidden rounded-2xl border bg-background p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/15" />

              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>

                <p className="mt-4 text-sm font-semibold">
                  {name}
                </p>

                <div className="mt-2 flex items-center text-xs text-muted-foreground transition-colors group-hover:text-primary">
                  Explore
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================
          FEATURED EVENTS
      ========================================================== */}
      <section className="bg-muted/30 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

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

            <Link
              href="/events"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed bg-background px-6 py-20 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Ticket className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="mt-5 font-semibold">
                No events available yet
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Check back soon for new experiences.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="transition-transform duration-300 hover:-translate-y-1"
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white lg:py-24">

        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60">
              <Zap className="h-3.5 w-3.5 text-violet-300" />
              Simple by design
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              From discovery to memories
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Everything you need to find and book your next experience.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Discover",
                description:
                  "Browse curated experiences based on your interests and location.",
              },
              {
                step: "02",
                title: "Book confidently",
                description:
                  "Choose your tickets and complete a simple, secure checkout.",
              },
              {
                step: "03",
                title: "Show up",
                description:
                  "Get ready to connect, celebrate, learn, and create memories.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-sm font-bold text-violet-300">
                    {item.step}
                  </span>

                  <ArrowRight className="h-4 w-4 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
                </div>

                <h3 className="mt-7 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================== */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-900 px-6 py-12 text-white shadow-2xl shadow-violet-500/15 sm:px-10 lg:px-14 lg:py-14">

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                Trusted experiences
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready for your next unforgettable experience?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                Find something exciting, book your tickets, and make plans
                worth remembering.
              </p>
            </div>

            <Link href="/events" className="shrink-0">
              <Button
                size="lg"
                className="h-12 rounded-xl bg-white px-6 font-semibold text-violet-700 shadow-xl hover:bg-white/90"
              >
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