"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  IndianRupee,
  Ticket,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { OrganizerStats } from "@/lib/types";
import { useAuth } from "@/lib/auth";

export default function OrganizerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<OrganizerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events/organizer/stats")
      .then((res) => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Events",
      value: stats?.total_events ?? 0,
      icon: CalendarDays,
      color: "text-primary bg-primary/10 border-primary/20",
      href: "/organizer/events",
    },
    {
      label: "Total Bookings",
      value: stats?.total_bookings ?? 0,
      icon: Ticket,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      href: "/organizer/bookings",
    },
    {
      label: "Tickets Sold",
      value: stats?.tickets_sold ?? 0,
      icon: Users,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      href: "/organizer/bookings",
    },
    {
      label: "Revenue",
      value: stats ? `₹${Number(stats.revenue).toLocaleString("en-IN")}` : "₹0",
      icon: IndianRupee,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      isRevenue: true,
      href: "/organizer/bookings",
    },
  ];

  const quickActions = [
    {
      label: "Create New Event",
      desc: "Launch a new event listing",
      href: "/organizer/events/create",
      icon: Plus,
      primary: true,
    },
    {
      label: "Manage Events",
      desc: "View and edit your events",
      href: "/organizer/events",
      icon: CalendarDays,
      primary: false,
    },
    {
      label: "View Bookings",
      desc: "See who's attending",
      href: "/organizer/bookings",
      icon: Ticket,
      primary: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="space-y-7">

        {/* Welcome header */}
        <div className="premium-panel relative overflow-hidden p-7 sm:p-9">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-violet-500/8 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back,{" "}
                <span className="text-primary">{user?.name?.split(" ")[0]}</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Here&apos;s a quick overview of your events and performance on Eventify.
              </p>
            </div>

            <Link href="/organizer/events/create" className="shrink-0">
              <Button size="lg" className="gap-2 rounded-xl shadow-glow">
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon, color, href, isRevenue }) => (
            <Link key={label} href={href} className="block">
              <div className="glass card-hover group h-full p-6">
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:text-muted-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>

                <div className="mt-5">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className={`mt-1 font-bold tracking-tight ${isRevenue ? "text-2xl" : "text-3xl"}`}>
                    {loading ? (
                      <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-white/[0.06]" />
                    ) : (
                      typeof value === "number" ? value.toLocaleString("en-IN") : value
                    )}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* Revenue / performance overview */}
          <div className="glass p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold">Revenue Overview</h2>
                <p className="text-xs text-muted-foreground">Platform performance summary</p>
              </div>
            </div>

            {/* Revenue highlight */}
            <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                Total Revenue Earned
              </p>
              <p className="mt-2 text-4xl font-black tracking-tight">
                {loading ? (
                  <span className="inline-block h-10 w-32 animate-pulse rounded-xl bg-white/[0.06]" />
                ) : (
                  `₹${Number(stats?.revenue ?? 0).toLocaleString("en-IN")}`
                )}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                From {loading ? "—" : (stats?.total_bookings ?? 0)} confirmed bookings
              </p>
            </div>

            {/* Quick stats bars */}
            <div className="space-y-4">
              {[
                {
                  label: "Events Created",
                  value: stats?.total_events ?? 0,
                  max: Math.max(stats?.total_events ?? 1, 10),
                  color: "bg-primary",
                },
                {
                  label: "Tickets Sold",
                  value: stats?.tickets_sold ?? 0,
                  max: Math.max(stats?.tickets_sold ?? 1, 100),
                  color: "bg-violet-500",
                },
                {
                  label: "Total Bookings",
                  value: stats?.total_bookings ?? 0,
                  max: Math.max(stats?.total_bookings ?? 1, 50),
                  color: "bg-emerald-500",
                },
              ].map(({ label, value, max, color }) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{loading ? "—" : value.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-700`}
                      style={{ width: loading ? "0%" : `${Math.min((value / max) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions sidebar */}
          <div className="space-y-4">
            <div className="glass p-6">
              <h2 className="mb-4 font-bold">Quick Actions</h2>
              <div className="space-y-2">
                {quickActions.map(({ label, desc, href, icon: Icon, primary }) => (
                  <Link key={href} href={href}>
                    <div className={`group flex items-center gap-3 rounded-xl border p-4 transition-all ${
                      primary
                        ? "border-primary/30 bg-primary/10 hover:bg-primary/15"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}>
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        primary ? "bg-primary/20 text-primary" : "bg-white/[0.07] text-muted-foreground"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold ${primary ? "text-primary" : ""}`}>{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/40 transition-all group-hover:text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tips card */}
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Pro Tip</p>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Events with a clear cover image and a detailed description get{" "}
                <strong className="text-foreground">3x more bookings</strong> on average.
              </p>
            </div>

            {/* Support note */}
            <div className="glass p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold">Need help?</p>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Our support team is available Mon–Fri.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
