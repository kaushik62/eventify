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
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { PlatformRevenueAnalytics } from "@/lib/types";

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<PlatformRevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/analytics/revenue")
      .then((res) => setAnalytics(res.data.data))
      .catch((err) => console.error("Failed to load analytics", err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = analytics?.metrics;

  const formatNumber = (value: number | undefined) => {
    return value !== undefined ? value.toLocaleString("en-IN") : "—";
  };

  const formatCurrency = (value: number | string | undefined) => {
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
            Platform-wide governance, organizer approvals, ticket ledgers, and revenue settlement auditing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {metrics && metrics.pendingOrganizerApplications > 0 ? (
            <Link href="/admin/organizers?status=PENDING">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
                <Clock className="h-3.5 w-3.5 mr-1 animate-pulse" />
                {metrics.pendingOrganizerApplications} Pending{" "}
                {metrics.pendingOrganizerApplications === 1 ? "Application" : "Applications"}
              </Button>
            </Link>
          ) : (
            <Badge variant="success">All Applications Reviewed</Badge>
          )}
        </div>
      </div>

      {/* Primary KPI Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/organizers"
          className="rounded-xl border border-border bg-white p-5 shadow-card hover:border-slate-300 hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Approved Organizers
            </span>
            <Building2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-slate-900">
              {loading ? "—" : formatNumber(metrics?.totalApprovedOrganizers)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {metrics?.totalRegisteredOrganizers || 0} registered •{" "}
              {metrics?.pendingOrganizerApplications || 0} pending review
            </p>
          </div>
        </Link>

        <Link
          href="/admin/events"
          className="rounded-xl border border-border bg-white p-5 shadow-card hover:border-slate-300 hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Platform Events
            </span>
            <CalendarDays className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-slate-900">
              {loading ? "—" : formatNumber(metrics?.totalEvents)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Active and past event listings
            </p>
          </div>
        </Link>

        <Link
          href="/admin/bookings"
          className="rounded-xl border border-border bg-white p-5 shadow-card hover:border-slate-300 hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Successful Bookings
            </span>
            <Ticket className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-slate-900">
              {loading ? "—" : formatNumber(metrics?.totalSuccessfulBookings)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {metrics?.totalTicketsSold || 0} tickets settled
            </p>
          </div>
        </Link>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-card">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Net Booking Revenue
            </span>
            <IndianRupee className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-emerald-950">
              {loading ? "—" : formatCurrency(metrics?.netBookingRevenue)}
            </p>
            <p className="mt-1 text-[11px] text-emerald-700">
              All-time volume after refund deductions
            </p>
          </div>
        </div>
      </div>

      {/* Platform-Wide Financial Settlement & Revenue Analytics Card */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                All-Time Platform Revenue & Settlement Analytics
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Calculated exclusively from verified Razorpay transactions (`PAID` status) across all organizers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">Currency: INR (₹)</Badge>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Gross Booking Value (GMV)
            </span>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {loading ? "—" : formatCurrency(metrics?.grossBookingRevenue)}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">
              Confirmed attendee checkout volume across all organizer events.
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Refunds Settled
            </span>
            <p className="mt-1 text-2xl font-black text-amber-700">
              {loading ? "—" : formatCurrency(metrics?.totalRefunds)}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">
              Processed return amounts deducted from gross settlements.
            </span>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 block">
              Net Settled Volume
            </span>
            <p className="mt-1 text-2xl font-black text-emerald-950">
              {loading ? "—" : formatCurrency(metrics?.netBookingRevenue)}
            </p>
            <span className="text-[11px] text-emerald-700 block mt-1">
              True net volume (Gross Booking Value minus processed refunds).
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800 mb-0.5">Financial Transparency Note:</p>
          Gross Merchandise Value reflects all ticket transactions settled by attendees. Net booking revenue
          accurately subtracts refunds. Eventify uses direct organizer event settlements without artificial commission calculations.
        </div>
      </div>

      {/* Top Organizers by Revenue & Monthly Trends Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Organizers */}
        <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Performing Organizers</h3>
              <p className="text-xs text-muted-foreground">By total gross booking volume</p>
            </div>
            <Link href="/admin/organizers">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          {loading || !analytics?.topOrganizers?.length ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              {loading ? "Calculating creator revenues..." : "No organizer transactions recorded yet."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Organizer</th>
                    <th>Events</th>
                    <th>Bookings</th>
                    <th className="text-right">Gross Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topOrganizers.map((org) => (
                    <tr key={org.id}>
                      <td>
                        <Link
                          href={`/admin/organizers/${org.id}`}
                          className="font-semibold text-slate-900 hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <span>{org.name}</span>
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </Link>
                        <span className="text-[11px] text-muted-foreground block">
                          {org.organization_name || org.email}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs text-slate-800">{org.total_events}</span>
                      </td>
                      <td>
                        <span className="text-xs text-slate-800">{org.total_bookings}</span>
                      </td>
                      <td className="text-right font-bold text-slate-900">
                        {formatCurrency(org.gross_revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Revenue Breakdown */}
        <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Category Breakdown</h3>
              <p className="text-xs text-muted-foreground">Revenue and listings per event genre</p>
            </div>
            <Badge variant="outline">All-Time</Badge>
          </div>

          {loading || !analytics?.categoryBreakdown?.length ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              {loading ? "Loading category analytics..." : "No categorized events yet."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Listings</th>
                    <th>Orders</th>
                    <th className="text-right">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.categoryBreakdown.map((cat) => (
                    <tr key={cat.category}>
                      <td>
                        <Badge variant="secondary">{cat.category}</Badge>
                      </td>
                      <td>
                        <span className="text-xs text-slate-800">{cat.event_count}</span>
                      </td>
                      <td>
                        <span className="text-xs text-slate-800">{cat.booking_count}</span>
                      </td>
                      <td className="text-right font-bold text-slate-900">
                        {formatCurrency(cat.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Directory Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Organizer Approvals",
            href: "/admin/organizers?status=PENDING",
            desc: "Review pending organizer applications",
          },
          {
            title: "Organizer Directory",
            href: "/admin/organizers",
            desc: "Manage accredited event creators",
          },
          {
            title: "Events Audit",
            href: "/admin/events",
            desc: "Audit live and scheduled listings",
          },
          {
            title: "Booking Ledger",
            href: "/admin/bookings",
            desc: "Review completed ticketing orders",
          },
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
            <p className="mt-1 text-[11px] text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
