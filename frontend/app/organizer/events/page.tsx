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
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleteError("");
    try {
      setDeletingId(id);
      await api.delete(`/events/${id}`);
      load();
    } catch {
      setDeleteError("Failed to delete event. Please try again.");
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
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Organizer Dashboard
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Events</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Create, manage, and monitor all the events you organize on Eventify.
          </p>
        </div>

        <Link href="/organizer/events/create">
          <Button className="h-11 gap-2 rounded-xl px-5 shadow-glow">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total events",
            value: loading ? "—" : events.length,
            icon: CalendarDays,
            color: "text-primary bg-primary/10 border-primary/20",
          },
          {
            label: "Upcoming",
            value: loading ? "—" : upcomingCount,
            icon: Clock,
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            label: "Tickets sold",
            value: loading ? "—" : soldSeats.toLocaleString("en-IN"),
            icon: TrendingUp,
            color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
          },
          {
            label: "Available seats",
            value: loading ? "—" : availableSeats.toLocaleString("en-IN"),
            icon: Users,
            color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass card-hover p-5">
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* Error message */}
      {deleteError && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
          {deleteError}
        </div>
      )}

      {/* Events section */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Your events</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the events you have created.
            </p>
          </div>

          {!loading && events.length > 0 && (
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-muted-foreground">
              {events.length} {events.length === 1 ? "event" : "events"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04]"
              >
                <div className="h-48 animate-pulse bg-white/[0.04]" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-white/[0.06]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-white/[0.06]" />
                  <div className="h-10 animate-pulse rounded-xl bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="glass rounded-3xl border-dashed px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <CalendarDays className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold">No events yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              You haven&apos;t created any events yet. Create your first event and start welcoming attendees.
            </p>
            <Link href="/organizer/events/create">
              <Button className="mt-6 gap-2 rounded-xl">
                <Plus className="h-4 w-4" />
                Create Your First Event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {events.map((event) => {
              const imageUrl = getEventImageUrl(event.image_url);
              const isUpcoming = new Date(event.event_date) >= new Date();
              const isSoldOut = Number(event.available_seats) === 0;
              const soldPct = event.total_seats
                ? Math.round(((event.total_seats - event.available_seats) / event.total_seats) * 100)
                : 0;

              return (
                <div
                  key={event.id}
                  className="group card-hover overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] backdrop-blur-xl"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-surface">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={event.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center gradient-brand">
                        <CalendarDays className="h-10 w-10 text-white/60" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <div className="absolute left-4 top-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
                          isSoldOut
                            ? "bg-red-500/90 text-white"
                            : isUpcoming
                              ? "bg-emerald-500/90 text-white"
                              : "bg-black/60 text-white"
                        }`}
                      >
                        {isSoldOut ? "Sold out" : isUpcoming ? "Upcoming" : "Past event"}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="line-clamp-2 text-xl font-bold text-white">
                        {event.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <CalendarDays className="h-3.5 w-3.5" />
                        </div>
                        {formatDate(event.event_date)}
                      </div>

                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          <MapPin className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                          <Ticket className="h-3.5 w-3.5" />
                        </div>
                        {event.available_seats} / {event.total_seats} seats available
                      </div>
                    </div>

                    {/* Capacity progress bar */}
                    <div className="mt-4">
                      <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                        <span>Capacity filled</span>
                        <span className="font-semibold">{soldPct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            soldPct >= 90
                              ? "bg-red-500"
                              : soldPct >= 70
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                          style={{ width: `${soldPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-5">
                      <Link href={`/events/${event.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="h-10 w-full gap-2 rounded-xl"
                        >
                          <Eye className="h-4 w-4" />
                          View Event
                        </Button>
                      </Link>

                      <button
                        type="button"
                        onClick={() => remove(event.id, event.name)}
                        disabled={deletingId === event.id}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 text-red-400 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Delete ${event.name}`}
                      >
                        {deletingId === event.id ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
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