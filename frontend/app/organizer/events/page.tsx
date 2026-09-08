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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";
import { getEventImageUrl } from "@/lib/image";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);

    api
      .get("/events/organizer/my-events")
      .then((res) => {
        setEvents(res.data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;

    try {
      setDeletingId(id);
      await api.delete(`/events/${id}`);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  const upcomingEvents = events.filter(
    (event) => new Date(event.event_date) >= new Date()
  ).length;

  const totalSeats = events.reduce(
    (sum, event) => sum + Number(event.total_seats),
    0
  );

  const availableSeats = events.reduce(
    (sum, event) => sum + Number(event.available_seats),
    0
  );

  const soldSeats = totalSeats - availableSeats;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">
              Organizer dashboard
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Events
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Create, manage, and monitor all the events you organize on
              Eventify.
            </p>
          </div>

          <Link href="/organizer/events/create">
            <Button className="h-11 gap-2 rounded-xl px-5 shadow-sm">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
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
                  {loading ? "—" : events.length}
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
                  Upcoming events
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {loading ? "—" : upcomingEvents}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
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
                  {loading
                    ? "—"
                    : soldSeats.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
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
                  {loading
                    ? "—"
                    : availableSeats.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Ticket className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Events section */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Your events
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage the events you have created.
              </p>
            </div>

            {!loading && events.length > 0 && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {events.length}{" "}
                {events.length === 1 ? "event" : "events"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="h-48 animate-pulse bg-muted" />

                  <div className="space-y-3 p-5">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                    <div className="h-10 animate-pulse rounded-xl bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="overflow-hidden rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CalendarDays className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-semibold">
                No events yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                You haven't created any events yet. Create your first event
                and start welcoming attendees.
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
                const isUpcoming =
                  new Date(event.event_date) >= new Date();
                const isSoldOut =
                  Number(event.available_seats) === 0;

                return (
                  <div
                    key={event.id}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-muted">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={event.name}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <CalendarDays className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      <div className="absolute left-4 top-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
                            isSoldOut
                              ? "bg-red-500/90 text-white"
                              : isUpcoming
                                ? "bg-emerald-500/90 text-white"
                                : "bg-black/50 text-white"
                          }`}
                        >
                          {isSoldOut
                            ? "Sold out"
                            : isUpcoming
                              ? "Upcoming"
                              : "Past event"}
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
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <CalendarDays className="h-4 w-4" />
                          </div>

                          <span>
                            {formatDate(event.event_date)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600">
                            <MapPin className="h-4 w-4" />
                          </div>

                          <span>
                            {event.available_seats}/
                            {event.total_seats} seats available
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex items-center gap-2 border-t border-border pt-5">
                        <Link
                          href={`/events/${event.id}`}
                          className="flex-1"
                        >
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
                          onClick={() => remove(event.id)}
                          disabled={deletingId === event.id}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 text-red-600 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
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
    </div>
  );
}