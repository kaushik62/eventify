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


                    <Button size="sm" disabled>
                      View Event
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>


                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
