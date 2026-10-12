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
  ArrowRight,
  ShieldCheck,
  Ticket,
  ChevronRight,
  Zap,
  Calendar,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/EventCard";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";

const categories = [
  { name: "Music", icon: Music, desc: "Concerts, gigs & live sessions" },
  { name: "Technology", icon: Laptop, desc: "Summits, hackathons & talks" },
  { name: "Art", icon: Palette, desc: "Exhibitions & creative workshops" },
  { name: "Conferences", icon: Mic2, desc: "Industry conventions & panels" },
  { name: "Food", icon: UtensilsCrossed, desc: "Tasting tours & food festivals" },
  { name: "Sports", icon: Trophy, desc: "Tournaments & fitness runs" },
];

const metrics = [
  { label: "Active Events", value: "5,000+" },
  { label: "Tickets Booked", value: "120,000+" },
  { label: "Cities Covered", value: "42" },
  { label: "Organizer Rating", value: "4.9 / 5" },
];

const features = [
  {
    title: "Verified Event Organizers",
    description: "Every event is verified with transparent venue locations, schedules, and capacity limits.",
    icon: ShieldCheck,
  },
  {
    title: "Instant Digital Ticketing",
    description: "Receive your booking confirmation instantly with ticket reference ID and downloadable voucher.",
    icon: Ticket,
  },
  {
    title: "Secure Razorpay Checkout",
    description: "Industry-standard payments with UPI, cards, and net banking. Zero hidden booking fees.",
    icon: Zap,
  },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events", {
        params: { limit: 6, sort: "date_asc" },
      })
      .then((res) => setEvents(res.data.data.events))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (search.trim()) query.set("search", search.trim());
    if (location.trim()) query.set("location", location.trim());
    window.location.href = `/events?${query.toString()}`;
  };

  return (
    <main className="bg-background">
      {/* HERO SECTION */}
      <section className="border-b border-border bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Headline & Search */}
            <div className="lg:col-span-7">
            

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Discover exceptional live events. <br className="hidden sm:inline" />
                <span className="text-primary">Book in seconds.</span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Eventify is the modern platform for discovering concerts, tech conferences, workshops, and cultural gatherings. Real-time seat tracking and verified organizers.
              </p>

              {/* Integrated Search Bar */}
              <form
                onSubmit={handleSearch}
                className="mt-8 rounded-xl border border-border bg-white p-2 shadow-card sm:flex sm:items-center sm:gap-2"
              >
                <div className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2 text-slate-400 focus-within:text-slate-900">
                  <Search className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search event, artist, topic..."
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-muted-foreground"
                  />
                </div>

                <div className="my-2 h-6 w-px bg-border hidden sm:block" />

                <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-400 focus-within:text-slate-900 sm:w-44">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location / City"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-muted-foreground"
                  />
                </div>

                <Button type="submit" size="md" className="w-full sm:w-auto shrink-0">
                  <Search className="h-4 w-4" />
                  <span>Find Events</span>
                </Button>
              </form>

              {/* Metric stats strip */}
              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border pt-8 sm:grid-cols-4">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      {m.value}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Editorial Spotlight Preview */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-xl border border-border bg-white shadow-card-hover">
                <div className="relative aspect-[16/10] w-full bg-slate-100">
                  <Image
                    src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85"
                    alt="Live music crowd"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover"
                  />
                  <div className="absolute left-3 top-3">
                    <Badge variant="accent">
                      Spotlight Event
                    </Badge>
                  </div>
                  <div className="absolute right-3 top-3">
                    <span className="inline-flex items-center rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800 backdrop-blur-sm shadow-subtle border border-slate-200/60">
                      Music & Culture
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Saturday, 12 Oct • 7:30 PM</span>
                  </div>

                  <h3 className="mt-1.5 text-lg font-bold text-slate-900">
                    Sunset Live Fest Mumbai
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    A multi-genre outdoor music festival featuring indie artists, artisan food pop-ups, and live stage installations.
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Starting from
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        ₹1,299
                      </span>
                    </div>

                    <Link href="/events">
                      <Button size="sm">
                        View Event
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES BROWSER */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Explore by Category
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Browse events that match your passion
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-indigo-700 transition-colors"
            >
              All categories
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map(({ name, icon: Icon, desc }) => (
              <Link
                key={name}
                href={`/events?category=${encodeURIComponent(name)}`}
                className="group flex flex-col rounded-xl border border-border bg-white p-4 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-card-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  {name}
                </h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                  {desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED UPCOMING EVENTS */}
      <section className="border-y border-border bg-slate-50/60 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Curated Listings
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Upcoming Live Experiences
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Hand-picked events with tickets available right now.
              </p>
            </div>
            <Link href="/events">
              <Button variant="outline" size="sm">
                View All Events
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-xl border border-border bg-white"
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="mt-8 rounded-xl border border-border bg-white p-12 text-center">
              <Ticket className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                No events listed at the moment
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Check back shortly or register as an organizer to list your event.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PLATFORM VALUE PROPOSITION */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Why Eventify
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Engineered for seamless event experiences
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Built with precision for attendees seeking clarity and organizers needing dependable software.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {features.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-white p-6 shadow-card"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORGANIZER CTA BANNER */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-white p-8 sm:p-12 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                <Users className="h-3 w-3" />
                For Event Creators
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Hosting a conference, workshop, or gig?
              </h2>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Launch your ticket sales with Eventify in under 5 minutes. Real-time attendee check-in, revenue tracking, and automated receipt emails.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Hosting Events
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Organizer Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
