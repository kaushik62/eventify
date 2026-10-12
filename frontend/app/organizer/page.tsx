"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  IndianRupee,
  Ticket,
  Plus,
  ArrowUpRight,
  BarChart3,
  Users,
  Lightbulb,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      href: "/organizer/events",
      helper: "Published listings",
    },
    {
      label: "Total Bookings",
      value: stats?.total_bookings ?? 0,
      icon: Ticket,
      href: "/organizer/bookings",
      helper: "Attendee orders",
    },
    {
      label: "Tickets Sold",
      value: stats?.tickets_sold ?? 0,
      icon: Users,
      href: "/organizer/bookings",
      helper: "Total admissions",
    },
    {
      label: "Total Revenue",
      value: stats ? `₹${Number(stats.revenue).toLocaleString("en-IN")}` : "₹0",
      icon: IndianRupee,
      isRevenue: true,
      href: "/organizer/bookings",
      helper: "Processed via Razorpay",
    },
  ];

  const quickActions = [
    {
      label: "Create New Event",
      desc: "Configure tickets, pricing, date & venue",
      href: "/organizer/events/create",
      icon: Plus,
      primary: true,
    },
    {
      label: "Manage Event Inventory",
      desc: "Monitor seats sold and update event details",
      href: "/organizer/events",
      icon: CalendarDays,
      primary: false,
    },
    {
      label: "View Attendee Roster",
      desc: "Inspect bookings and export attendee lists",
      href: "/organizer/bookings",
      icon: Ticket,
      primary: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Organizer Dashboard
            </h1>
            <Badge variant="default">Verified Organizer</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Welcome back, {user?.name || "Organizer"}. Here is your live ticketing and revenue overview.
          </p>
        </div>

        <Link href="/organizer/events/create">
          <Button size="md">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, href, isRevenue, helper }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border border-border bg-white p-5 shadow-card transition-all duration-150 hover:border-slate-300 hover:shadow-card-hover"
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <Icon className="h-4 w-4 text-slate-400" />
            </div>

            <div className="mt-3">
              <p className={`font-black tracking-tight text-slate-900 ${isRevenue ? "text-2xl" : "text-3xl"}`}>
                {loading ? (
                  <span className="inline-block h-8 w-20 animate-pulse rounded bg-slate-100" />
                ) : typeof value === "number" ? (
                  value.toLocaleString("en-IN")
                ) : (
                  value
                )}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">{helper}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Workspace Split */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Revenue & Capacity Breakdown */}
        <div className="lg:col-span-8 rounded-xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-slate-900">
                Ticketing & Revenue Performance
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Real-time platform data
            </span>
          </div>

          {/* Revenue Highlight Card */}
          <div className="mt-5 rounded-lg border border-indigo-100 bg-indigo-50/60 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
              Total Gross Ticket Revenue
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {loading ? (
                <span className="inline-block h-9 w-32 animate-pulse rounded bg-indigo-100" />
              ) : (
                `₹${Number(stats?.revenue ?? 0).toLocaleString("en-IN")}`
              )}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Accumulated across {stats?.total_bookings ?? 0} confirmed orders and {stats?.tickets_sold ?? 0} attendees.
            </p>
          </div>

          {/* Progress Bars */}
          <div className="mt-6 space-y-4">
            {[
              {
                label: "Active Events Listed",
                value: stats?.total_events ?? 0,
                max: Math.max(stats?.total_events ?? 1, 10),
                barColor: "bg-indigo-600",
              },
              {
                label: "Tickets Distributed",
                value: stats?.tickets_sold ?? 0,
                max: Math.max(stats?.tickets_sold ?? 1, 100),
                barColor: "bg-slate-700",
              },
              {
                label: "Completed Bookings",
                value: stats?.total_bookings ?? 0,
                max: Math.max(stats?.total_bookings ?? 1, 50),
                barColor: "bg-emerald-600",
              },
            ].map(({ label, value, max, barColor }) => (
              <div key={label}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{label}</span>
                  <span className="font-bold text-slate-900">
                    {loading ? "—" : value.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{
                      width: loading
                        ? "0%"
                        : `${Math.min((value / max) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Navigation & Recommendations */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Actions Card */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-card">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Quick Management
            </h2>

            <div className="space-y-2">
              {quickActions.map(({ label, desc, href, icon: Icon, primary }) => (
                <Link key={href} href={href} className="block">
                  <div
                    className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                      primary
                        ? "border-primary/30 bg-indigo-50/70 hover:bg-indigo-100/70"
                        : "border-border bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                        primary
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900">{label}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{desc}</p>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Organizer Advice */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900">
                Ticketing Best Practice
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Including high-resolution event imagery and an accurate venue address increases conversion by over 40%.
            </p>
          </div>

          {/* Support Widget */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 mb-1.5">
              <Headphones className="h-4 w-4 text-slate-400" />
              <h3 className="text-xs font-bold text-slate-900">
                Organizer Support
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Need assistance with payouts or event edits?
            </p>
            <Link href="/contact" className="mt-3 block">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Contact Organizer Desk
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
