"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  IndianRupee,
  Ticket,
  TrendingUp,
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { AdminStats } from "@/lib/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Registered Users",
      value: stats?.totalUsers,
      icon: Users,
      description: "Attendee customer accounts",
      href: "/admin/users",
    },
    {
      label: "Active Organizers",
      value: stats?.totalOrganizers,
      icon: Building2,
      description: "Event creator accounts",
      href: "/admin/organizers",
    },
    {
      label: "Platform Events",
      value: stats?.totalEvents,
      icon: CalendarDays,
      description: "Total listings created",
      href: "/admin/events",
    },
    {
      label: "Ticket Bookings",
      value: stats?.totalBookings,
      icon: Ticket,
      description: "Completed checkout orders",
      href: "/admin/bookings",
    },
  ];

  const formatNumber = (value: number | undefined) => {
    return value?.toLocaleString("en-IN") ?? "—";
  };

  const formatCurrency = (value: string | number | undefined) => {
    if (value === undefined || value === null) return "—";
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Platform Administration
            </h1>
            <Badge variant="destructive">Super Admin</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            System-wide metric monitoring, user management, and event auditing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success">All Systems Operational</Badge>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-border bg-white p-5 shadow-card transition-all duration-150 hover:border-slate-300 hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </span>
                <Icon className="h-4 w-4 text-slate-400" />
              </div>

              <div className="mt-3">
                <p className="text-3xl font-black tracking-tight text-slate-900">
                  {loading ? (
                    <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-100" />
                  ) : (
                    formatNumber(card.value)
                  )}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Platform Gross Volume Card */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <IndianRupee className="h-4 w-4 text-emerald-600" />
              <span>Platform Gross Merchandise Value (GMV)</span>
            </div>
            <p className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              {loading ? (
                <span className="inline-block h-10 w-44 animate-pulse rounded bg-slate-100" />
              ) : (
                formatCurrency(stats?.totalRevenue)
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Total transaction volume settled through Razorpay integration across all live events.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/bookings">
              <Button variant="outline" size="sm">
                View All Transactions
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Management Directory Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "User Directory", href: "/admin/users", desc: "Manage registered attendees" },
          { title: "Organizer Directory", href: "/admin/organizers", desc: "Manage verified organizers" },
          { title: "Events Audit", href: "/admin/events", desc: "Audit live and past listings" },
          { title: "Booking Ledger", href: "/admin/bookings", desc: "Review all ticketing logs" },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-xl border border-border bg-white p-4 shadow-card hover:border-slate-300 transition-colors"
          >
            <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>{item.title}</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
