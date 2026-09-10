"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  IndianRupee,
  Ticket,
  TrendingUp,
  Users,
  UserRoundCog,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      label: "Total Users",
      value: stats?.totalUsers,
      icon: Users,
      description: "Registered customers",
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Total Organizers",
      value: stats?.totalOrganizers,
      icon: UserRoundCog,
      description: "Event creators",
      iconClass: "bg-violet-500/10 text-violet-400",
    },
    {
      label: "Total Events",
      value: stats?.totalEvents,
      icon: CalendarDays,
      description: "Events on platform",
      iconClass: "bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings,
      icon: Ticket,
      description: "Tickets booked",
      iconClass: "bg-amber-500/10 text-amber-400",
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
    <div className="page-surface min-h-screen">
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="premium-panel relative overflow-hidden p-7 sm:p-9">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
              <TrendingUp className="h-3.5 w-3.5" />
              Platform overview
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Get a quick overview of users, organizers, events, bookings,
              and revenue across Eventify.
            </p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Card
                key={card.label}
                className="overflow-hidden border-border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {card.label}
                      </p>

                      <p className="mt-3 text-3xl font-bold tracking-tight">
                        {loading ? "—" : formatNumber(card.value)}
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {card.description}
                      </p>
                    </div>

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Revenue */}
        <Card className="relative overflow-hidden border-border shadow-sm">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <CardContent className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <IndianRupee className="h-5 w-5" />
                  </div>

                  <p className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </p>
                </div>

                <p className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  {loading ? "—" : formatCurrency(stats?.totalRevenue)}
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  Revenue generated from bookings across the platform.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="h-7 w-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Overview */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold">Users</p>
                <p className="text-xs text-muted-foreground">
                  People using Eventify
                </p>
              </div>
            </div>

            <p className="mt-5 text-2xl font-bold">
              {loading ? "—" : formatNumber(stats?.totalUsers)}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold">Events</p>
                <p className="text-xs text-muted-foreground">
                  Events available on the platform
                </p>
              </div>
            </div>

            <p className="mt-5 text-2xl font-bold">
              {loading ? "—" : formatNumber(stats?.totalEvents)}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Ticket className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold">Bookings</p>
                <p className="text-xs text-muted-foreground">
                  Tickets purchased by users
                </p>
              </div>
            </div>

            <p className="mt-5 text-2xl font-bold">
              {loading ? "—" : formatNumber(stats?.totalBookings)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
