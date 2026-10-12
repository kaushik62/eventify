"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Ticket, Users, Search } from "lucide-react";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface AdminBookingRow {
  id: number;
  user_name: string;
  event_name: string;
  tickets: number;
  total_amount: string | number;
  status: string;
  created_at: string;
}

function getInitials(name: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/admin/bookings")
      .then((res) => setBookings(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + Number(booking.total_amount),
    0
  );
  const totalTickets = bookings.reduce(
    (sum, booking) => sum + Number(booking.tickets),
    0
  );
  const confirmedBookings = bookings.filter(
    (booking) => booking.status.toUpperCase() === "CONFIRMED"
  ).length;

  const filteredBookings = bookings.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.user_name.toLowerCase().includes(q) ||
      b.event_name.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return <Badge variant="success">Confirmed</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "CANCELLED":
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Booking Transactions Ledger
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Audit ticketing activity, settled amounts, and order statuses across all events.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-white px-3 py-1.5 shadow-subtle">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Ledger Count:{" "}
          </span>
          <span className="text-xs font-bold text-slate-900">
            {loading ? "—" : totalBookings} orders
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-4 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Orders
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {loading ? "—" : totalBookings.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Confirmed Orders
          </span>
          <p className="mt-2 text-2xl font-black text-emerald-600">
            {loading ? "—" : confirmedBookings.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Tickets Issued
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {loading ? "—" : totalTickets.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Settled Volume
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {loading ? "—" : `₹${totalRevenue.toLocaleString("en-IN")}`}
          </p>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border p-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Order Logs</h2>
            <p className="text-xs text-muted-foreground">
              Showing {filteredBookings.length} of {bookings.length} recorded transactions
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user or event..."
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-2 text-xs text-muted-foreground">Loading order transactions...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No booking records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Attendee</th>
                  <th>Event Name</th>
                  <th>Tickets</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="font-mono text-xs font-semibold text-slate-800">
                        EVT-{String(b.id).padStart(6, "0")}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">
                          {getInitials(b.user_name)}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {b.user_name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="font-medium text-slate-900 line-clamp-1 max-w-xs">
                        {b.event_name}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold text-slate-900">{b.tickets}</span>
                    </td>
                    <td>
                      <span className="font-semibold text-slate-900">
                        ₹{Number(b.total_amount).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>{getStatusBadge(b.status)}</td>
                    <td>
                      <span className="text-xs text-slate-500">
                        {new Date(b.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
