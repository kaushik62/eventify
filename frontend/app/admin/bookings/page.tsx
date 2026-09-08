"use client";

import { useEffect, useState } from "react";
import { CalendarDays, IndianRupee, Ticket, Users } from "lucide-react";
import api from "@/lib/api";

interface AdminBookingRow {
  id: number;
  user_name: string;
  event_name: string;
  tickets: number;
  total_amount: string | number;
  status: string;
  created_at: string;
}

function getStatusStyles(status: string) {
  switch (status.toUpperCase()) {
    case "CONFIRMED":
      return "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20";

    case "PENDING":
      return "bg-amber-500/10 text-amber-600 ring-1 ring-inset ring-amber-500/20";

    case "CANCELLED":
      return "bg-red-500/10 text-red-600 ring-1 ring-inset ring-red-500/20";

    case "FAILED":
      return "bg-slate-500/10 text-slate-600 ring-1 ring-inset ring-slate-500/20";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatAmount(amount: string | number) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">
              Admin dashboard
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Bookings
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Monitor bookings, ticket sales, revenue, and payment status
              across all events.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total bookings
            </p>
            <p className="mt-1 text-2xl font-bold">
              {loading ? "—" : totalBookings}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total bookings
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {loading ? "—" : totalBookings.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Confirmed
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {loading ? "—" : confirmedBookings.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Ticket className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Tickets sold
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {loading ? "—" : totalTickets.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Booking revenue
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {loading ? "—" : formatAmount(totalRevenue)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent bookings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A complete overview of customer bookings.
              </p>
            </div>

            {!loading && bookings.length > 0 && (
              <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {bookings.length} records
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4 p-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Ticket className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold">No bookings found</h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Bookings will appear here once users start purchasing tickets
                for events.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left">
                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Customer
                      </th>
                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Event
                      </th>
                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Tickets
                      </th>
                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Amount
                      </th>
                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {getInitials(booking.user_name)}
                            </div>

                            <span className="font-medium">
                              {booking.user_name}
                            </span>
                          </div>
                        </td>

                        <td className="max-w-[280px] px-5 py-4">
                          <p className="truncate font-medium">
                            {booking.event_name}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-medium">
                            {booking.tickets}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-semibold">
                          {formatAmount(booking.total_amount)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyles(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                          {new Date(
                            booking.created_at
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-border md:hidden">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {getInitials(booking.user_name)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {booking.user_name}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {booking.event_name}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyles(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-muted/40 p-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Tickets
                        </p>
                        <p className="mt-1 font-semibold">
                          {booking.tickets}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Amount
                        </p>
                        <p className="mt-1 font-semibold">
                          {formatAmount(booking.total_amount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Date
                        </p>
                        <p className="mt-1 font-semibold">
                          {new Date(
                            booking.created_at
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
