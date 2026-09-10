"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Ticket,
  Trash2,
  Users,
} from "lucide-react";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);

    api
      .get("/admin/events")
      .then((res) => setEvents(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this event? This is permanent.")) return;

    try {
      setDeletingId(id);
      await api.delete(`/admin/events/${id}`);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  const totalSeats = events.reduce(
    (sum, event) => sum + Number(event.total_seats),
    0
  );

  const availableSeats = events.reduce(
    (sum, event) => sum + Number(event.available_seats),
    0
  );

  const soldSeats = totalSeats - availableSeats;

  const upcomingEvents = events.filter(
    (event) => new Date(event.event_date) >= new Date()
  ).length;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getEventStatus = (event: EventItem) => {
    const eventDate = new Date(event.event_date);
    const now = new Date();

    if (eventDate < now) {
      return {
        label: "Past",
        className:
          "bg-white/[0.05] text-white/60 ring-1 ring-inset ring-white/10",
      };
    }

    if (Number(event.available_seats) === 0) {
      return {
        label: "Sold out",
        className:
          "bg-red-400/10 text-red-300 ring-1 ring-inset ring-red-400/20",
      };
    }

    return {
      label: "Upcoming",
      className:
        "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/20",
    };
  };

  return (
    <div className="page-surface min-h-screen">
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">
              Admin dashboard
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Events
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Manage all events, monitor seat availability, and keep your
              event catalog organized.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total events
            </p>

            <p className="mt-1 text-2xl font-bold">
              {loading ? "—" : events.length}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total events
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {loading ? "—" : events.length.toLocaleString("en-IN")}
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
                  Upcoming
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {loading ? "—" : upcomingEvents}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CalendarDays className="h-5 w-5" />
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
                  {loading ? "—" : soldSeats.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Ticket className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Available seats
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {loading ? "—" : availableSeats.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">All events</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Review and manage events created by organizers.
              </p>
            </div>

            {!loading && events.length > 0 && (
              <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {events.length} {events.length === 1 ? "event" : "events"}
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
          ) : events.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <CalendarDays className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold">No events found</h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Events created by organizers will appear here.
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
                        Event
                      </th>

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Organizer
                      </th>

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Date
                      </th>

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Seats
                      </th>

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right font-medium text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {events.map((event) => {
                      const status = getEventStatus(event);

                      return (
                        <tr
                          key={event.id}
                          className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                        >
                          <td className="max-w-[300px] px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <CalendarDays className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-semibold">
                                  {event.name}
                                </p>

                                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  Event location
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 font-medium">
                            {event.organizer_name}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                            {formatDate(event.event_date)}
                          </td>

                          <td className="px-5 py-4">
                            <div>
                              <p className="font-semibold">
                                {event.available_seats}/
                                {event.total_seats}
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                available
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => remove(event.id)}
                              disabled={deletingId === event.id}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label={`Delete ${event.name}`}
                            >
                              {deletingId === event.id ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-border md:hidden">
                {events.map((event) => {
                  const status = getEventStatus(event);

                  return (
                    <div key={event.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <CalendarDays className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-semibold">
                              {event.name}
                            </h3>

                            <p className="mt-1 truncate text-xs text-muted-foreground">
                              {event.organizer_name}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            Date
                          </p>

                          <p className="mt-1 font-semibold">
                            {formatDate(event.event_date)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            Seats
                          </p>

                          <p className="mt-1 font-semibold">
                            {event.available_seats}/{event.total_seats}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(event.id)}
                        disabled={deletingId === event.id}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === event.id ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Delete event
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}