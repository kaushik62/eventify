"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, MapPin, Music, Palette, Laptop, Trophy, Mic2, UtensilsCrossed, Sparkles, ArrowRight, Star, CalendarRange, ShieldCheck } from "lucide-react";
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
      .get("/events", { params: { limit: 8, sort: "date_asc" } })
      .then((res) => setEvents(res.data.data.events))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.22),_transparent_35%)]" />
        <div className="gradient-brand paper-grid relative text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="max-w-2xl reveal-up">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm backdrop-blur-sm reveal-up">
                  <Sparkles className="h-4 w-4" />
                  Discover experiences worth showing up for
                </div>
                <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                  Find your next
                  <span className="block text-white/80">big experience.</span>
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/75 sm:text-xl">
                  Explore hand-picked concerts, workshops, food festivals, sports nights, and meetups happening near you.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    window.location.href = `/events?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`;
                  }}
                  className="mt-8 rounded-2xl bg-[#fffdf8] p-3 shadow-2xl shadow-black/25 reveal-up reveal-delay-1"
                >
                  <div className="flex flex-col gap-3 lg:flex-row">
                    <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                      <Search className="h-5 w-5 text-slate-500" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search events, artists, or vibes"
                        className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 lg:w-52">
                      <MapPin className="h-5 w-5 text-slate-500" />
                      <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location"
                        className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      />
                    </div>
                    <Button type="submit" size="lg" className="shrink-0 bg-slate-900 text-white hover:bg-slate-800">
                      Explore now
                    </Button>
                  </div>
                </form>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-white/80">
                  {metrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="text-2xl font-bold text-white">{metric.value}</div>
                      <div>{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative reveal-up reveal-delay-2">
                <div className="soft-panel float-gently relative overflow-hidden border-white/20 bg-white/10 p-4 text-left text-white shadow-xl shadow-black/20 backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      Trending this week
                    </span>
                    <span className="text-xs text-white/70">4.9/5 rating</span>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Featured</p>
                        <h3 className="mt-2 text-2xl font-bold">Sunset Live Fest</h3>
                      </div>
                      <div className="rounded-xl bg-emerald-400/20 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                        18 seats left
                      </div>
                    </div>
                    <div className="space-y-3 text-sm text-white/80">
                      <div className="flex items-center gap-2">
                        <CalendarRange className="h-4 w-4" />
                        Sat, 7:30 PM · 12 Sep
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Jio Gardens, Mumbai
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <div>
                        <p className="text-xs text-white/60">Starting at</p>
                        <p className="text-2xl font-bold">₹1299</p>
                      </div>
                      <Link href="/events" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-violet-700">
                        View details <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Browse</p>
            <h2 className="text-3xl font-bold tracking-tight">Choose your kind of night</h2>
          </div>
          <Link href="/events" className="hidden text-sm font-semibold text-violet-700 sm:inline-flex items-center gap-1">
            Explore all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ name, icon: Icon }) => (
            <Link
              key={name}
              href={`/events?category=${encodeURIComponent(name)}`}
              className="card-hover group flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-100 text-violet-700 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-slate-700">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured this week</h2>
          <Link href="/events" className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {events.length === 0 ? (
          <div className="soft-panel p-10 text-center text-muted-foreground">No events available yet — check back soon.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              { step: "01", title: "Discover", desc: "Browse curated experiences tailored to your interests and city." },
              { step: "02", title: "Book confidently", desc: "Secure checkout and instant confirmations for your plan." },
              { step: "03", title: "Enjoy more", desc: "Show up ready to connect, celebrate, and make memories." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/20 text-sm font-bold text-violet-200">
                  {s.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-sm leading-6 text-slate-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="soft-panel flex flex-col items-center justify-between gap-6 px-6 py-10 text-center md:flex-row md:px-10 md:text-left">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Trusted experiences
            </div>
            <h2 className="text-3xl font-bold">Ready for your next unforgettable night out?</h2>
          </div>
          <Link href="/events">
            <Button size="lg" className="whitespace-nowrap">
              Explore events
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
