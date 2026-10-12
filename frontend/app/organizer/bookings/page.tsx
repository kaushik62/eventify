"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  IndianRupee,
  Mail,
  Ticket,
  Users,
  Search,
  CalendarDays,
  Calendar,
} from "lucide-react";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface BookingRow {
  id: number;
  user_name: string;
  user_email: string;
  tickets: number;
  total_amount: string | number;
  status: string;
}

function getInitials(name: string) {
  if (!name) return "A";
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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api
      .get("/events/organizer/my-events")
      .then((res) => {
        const evts = res.data.data;
        setEvents(evts);
        if (evts.length > 0) {
          setSelectedEvent((current) => current ?? evts[0].id);
        }
      })
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

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.user_name.toLowerCase().includes(q) ||
      b.user_email.toLowerCase().includes(q)
    );
  });

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

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return <Badge variant="success">Confirmed</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "CANCELLED":
      case "FAILED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Attendee Bookings
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          View live reservations, attendee contact details, and payment verification for your events.
        </p>
      </div>

      {/* Event Selector Filter Strip */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-card">
        <label className="block text-xs font-semibold text-slate-900 mb-2">
          Select Event to Inspect
        </label>
        <select
          value={selectedEvent || ""}
          onChange={(e) =>
            setSelectedEvent(Number(e.target.value) || null)
          }
          className="flex h-10 w-full max-w-xl rounded-lg border border-border bg-white px-3 text-xs text-foreground shadow-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">
            {loadingEvents ? "Loading events..." : "Choose an event..."}
          </option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name} — {new Date(event.event_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && selectedEventData && (
        <div className="space-y-6">
          {/* Selected Event Context Card */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Active Listing
              </span>
              <h2 className="mt-0.5 text-lg font-bold text-slate-900">
                {selectedEventData.name}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                  {new Date(selectedEventData.event_date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>{selectedEventData.available_seats} of {selectedEventData.total_seats} tickets remaining</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Unit Price:</span>
              <span className="text-sm font-bold text-slate-900">
                ₹{Number(selectedEventData.price).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-white p-4 shadow-card">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Orders
              </span>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {loadingBookings ? "—" : bookings.length}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-4 shadow-card">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Confirmed
              </span>
              <p className="mt-2 text-2xl font-black text-emerald-600">
                {loadingBookings ? "—" : confirmedBookings}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-4 shadow-card">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tickets Sold
              </span>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {loadingBookings ? "—" : totalTickets.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-4 shadow-card">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Event Gross
              </span>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {loadingBookings ? "—" : `₹${totalRevenue.toLocaleString("en-IN")}`}
              </p>
            </div>
          </div>

          {/* Attendee Roster Table */}
          <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border p-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Attendee Roster
                </h3>
                <p className="text-xs text-muted-foreground">
                  Showing {filteredBookings.length} of {bookings.length} reservations
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name or email..."
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </div>

            {loadingBookings ? (
              <div className="p-8 text-center">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="mt-2 text-xs text-muted-foreground">Loading attendee data...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-xs font-semibold text-slate-800">
                  {searchQuery ? "No matching attendees" : "No attendees booked yet"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {searchQuery ? "Try clearing your search query." : "Attendees will show here as tickets are reserved."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Attendee</th>
                      <th>Email Address</th>
                      <th>Tickets</th>
                      <th>Total Paid</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-700">
                              {getInitials(b.user_name)}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {b.user_name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="text-xs text-slate-600">
                            {b.user_email}
                          </span>
                        </td>
                        <td>
                          <span className="font-semibold text-slate-900">
                            {b.tickets}
                          </span>
                        </td>
                        <td>
                          <span className="font-semibold text-slate-900">
                            ₹{Number(b.total_amount).toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td>{getStatusBadge(b.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
