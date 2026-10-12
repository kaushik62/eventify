"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Eye,
  MapPin,
  Plus,
  Ticket,
  Trash2,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";
import { getEventImageUrl } from "@/lib/image";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string>("");

  const load = () => {
    setLoading(true);
    api
      .get("/events/organizer/my-events")
      .then((res) => setEvents(res.data.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    setDeleteError("");
    try {
      setDeletingId(id);
      await api.delete(`/events/${id}`);
      load();
    } catch {
      setDeleteError("Failed to delete event. Please ensure no active bookings exist.");
    } finally {
      setDeletingId(null);
    }
  };

  const upcomingCount = events.filter(
    (e) => new Date(e.event_date) >= new Date()
  ).length;

  const totalSeats = events.reduce((s, e) => s + Number(e.total_seats), 0);
  const availableSeats = events.reduce((s, e) => s + Number(e.available_seats), 0);
  const soldSeats = totalSeats - availableSeats;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Events
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your created listings, monitor capacity allocations, and track sales.
          </p>
        </div>

        <Link href="/organizer/events/create">
          <Button size="md">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Metrics Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Created",
            value: loading ? "—" : events.length,
            icon: CalendarDays,
          },
          {
            label: "Upcoming Events",
            value: loading ? "—" : upcomingCount,
            icon: Clock,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-white p-4 shadow-card"
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <Icon className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {deleteError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {deleteError}
        </div>
      )}

      {/* Events Listings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Event Catalog ({events.length})
          </h2>
        </div>

        {loading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-xl border border-border bg-white"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              No events created yet
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
              Publish your first event to start accepting ticket bookings.
            </p>
            <Link href="/organizer/events/create" className="mt-4 inline-block">
              <Button size="sm">Create Your First Event</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {events.map((event) => {
              const imageUrl = getEventImageUrl(event.image_url);
              const isUpcoming = new Date(event.event_date) >= new Date();
              const isSoldOut = Number(event.available_seats) === 0;
              const soldSeatsCount = event.total_seats - event.available_seats;
              const soldPct = event.total_seats
                ? Math.round((soldSeatsCount / event.total_seats) * 100)
                : 0;

              return (
                <div
                  key={event.id}
                  className="flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-white shadow-card transition-all duration-150 hover:border-slate-300 hover:shadow-card-hover"
                >
                  <div className="flex gap-4 p-4 sm:p-5">
                    {/* Event Image */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-28 sm:w-28">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={event.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400">
                          <CalendarDays className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 text-sm font-bold text-slate-900">
                          {event.name}
                        </h3>
                        <Badge
                          variant={
                            isSoldOut
                              ? "destructive"
                              : isUpcoming
                              ? "success"
                              : "secondary"
                          }
                        >
                          {isSoldOut ? "Sold out" : isUpcoming ? "Upcoming" : "Past"}
                        </Badge>
                      </div>

                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      {/* Capacity Bar */}
                      <div className="mt-3">
                        <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                          <span>
                            Sold: <strong>{soldSeatsCount}</strong> / {event.total_seats}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {soldPct}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              soldPct >= 90
                                ? "bg-red-500"
                                : soldPct >= 70
                                ? "bg-amber-500"
                                : "bg-indigo-600"
                            }`}
                            style={{ width: `${soldPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between border-t border-border bg-slate-50/60 px-4 py-2.5 sm:px-5">
                    <span className="text-xs font-bold text-slate-900">
                      ₹{Number(event.price).toLocaleString("en-IN")}{" "}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        / ticket
                      </span>
                    </span>

                    <div className="flex items-center gap-2">
                      <Link href={`/events/${event.id}`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                      </Link>

                      <button
                        type="button"
                        onClick={() => remove(event.id, event.name)}
                        disabled={deletingId === event.id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                        aria-label={`Delete ${event.name}`}
                      >
                        {deletingId === event.id ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}