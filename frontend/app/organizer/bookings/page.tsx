"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  IndianRupee,
  Mail,
  Ticket,
  Users,
} from "lucide-react";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";

interface BookingRow {
  id: number;
  user_name: string;
  user_email: string;
  tickets: number;
  total_amount: string | number;
  status: string;
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

export default function OrganizerBookingsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    api
      .get("/events/organizer/my-events")
      .then((res) => setEvents(res.data.data))
      .finally(() => setLoadingEvents(false));
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setLoadingBookings(true);

      api
        .get(`/events/${selectedEvent}/bookings`)
        .then((res) => setBookings(res.data.data))
        .finally(() => setLoadingBookings(false));
    } else {
      setBookings([]);
    }
  }, [selectedEvent]);

  const selectedEventData = events.find(
    (event) => event.id === selectedEvent
  );

  const totalTickets = bookings.reduce(
    (sum, booking) => sum + Number(booking.tickets),
    0
  );

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + Number(booking.total_amount),
    0
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status.toUpperCase() === "CONFIRMED"
  ).length;

  const formatAmount = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Organizer dashboard
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Bookings
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Track attendees, ticket sales, and booking activity for your
            events.
          </p>
        </div>

        {/* Event selector */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Ticket className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">Select an event</h2>
              <p className="text-xs text-muted-foreground">
                Choose an event to view its bookings.
              </p>
            </div>
          </div>

          <select
            onChange={(e) =>
              setSelectedEvent(Number(e.target.value) || null)
            }
            className="h-12 w-full max-w-xl rounded-xl border border-border bg-background px-4 text-sm font-medium outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            defaultValue=""
          >
            <option value="">
              {loadingEvents
                ? "Loading events..."
                : events.length === 0
                  ? "No events available"
                  : "Select an event"}
            </option>

            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selected event */}
        {selectedEvent && selectedEventData && (
          <>
            {/* Event summary */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Selected event
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  {selectedEventData.name}
                </h2>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span>
                    {new Date(
                      selectedEventData.event_date
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>

                  <span>
                    {selectedEventData.available_seats} seats available
                  </span>
                </div>
              </div>
            </div>

            {/* Booking stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total bookings
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {loadingBookings ? "—" : bookings.length}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Confirmed
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {loadingBookings ? "—" : confirmedBookings}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tickets sold
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {loadingBookings
                        ? "—"
                        : totalTickets.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                    <Ticket className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Revenue
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {loadingBookings
                        ? "—"
                        : formatAmount(totalRevenue)}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex flex-col gap-2 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Attendees
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    View everyone who booked this event.
                  </p>
                </div>

                {!loadingBookings && bookings.length > 0 && (
                  <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {bookings.length}{" "}
                    {bookings.length === 1
                      ? "booking"
                      : "bookings"}
                  </span>
                )}
              </div>

              {loadingBookings ? (
                <div className="space-y-4 p-5">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="h-16 animate-pulse rounded-xl bg-muted"
                    />
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                    <Ticket className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <h3 className="text-lg font-semibold">
                    No bookings yet
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Bookings for this event will appear here once attendees
                    purchase tickets.
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
                            Attendee
                          </th>

                          <th className="px-5 py-4 font-medium text-muted-foreground">
                            Email
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
                        </tr>
                      </thead>

                      <tbody>
                        {bookings.map((booking) => (
                          <tr
                            key={booking.id}
                            className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                  {getInitials(booking.user_name)}
                                </div>

                                <span className="font-semibold">
                                  {booking.user_name}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{booking.user_email}</span>
                              </div>
                            </td>

                            <td className="px-5 py-4 font-semibold">
                              {booking.tickets}
                            </td>

                            <td className="px-5 py-4 font-semibold">
                              ₹
                              {Number(
                                booking.total_amount
                              ).toLocaleString("en-IN")}
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

                              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                                <Mail className="h-3 w-3 shrink-0" />
                                {booking.user_email}
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

                        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-3">
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
                              ₹
                              {Number(
                                booking.total_amount
                              ).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* No event selected */}
        {!selectedEvent && (
          <div className="rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Ticket className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-semibold">
              Select an event to continue
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Choose one of your events above to view attendee bookings,
              ticket sales, and revenue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
