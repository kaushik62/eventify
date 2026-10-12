"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Ticket,
  Clock3,
  ArrowRight,
  Compass,
} from "lucide-react";

import { getEventImageUrl } from "@/lib/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Booking } from "@/lib/types";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get("/bookings")
      .then((res) => {
        setBookings(res.data.data);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const now = new Date();

  const upcoming = bookings.filter(
    (b) =>
      b.event_date &&
      new Date(b.event_date) >= now &&
      b.status === "CONFIRMED"
  );

  const past = bookings.filter((b) => !upcoming.includes(b));

  return (
    <main className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back, {user?.name?.split(" ")[0] || "Attendee"}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Manage your event reservations, e-tickets, and booking receipts.
            </p>
          </div>

          <Link href="/events">
            <Button size="sm">
              <Compass className="h-4 w-4 mr-1.5" />
              Discover Events
            </Button>
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Upcoming Events</span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {upcoming.length}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Active tickets ready for admission
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Ticket className="h-4 w-4 text-indigo-600" />
              <span>Total Bookings</span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {bookings.length}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Across all categories
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-xl border border-border bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock3 className="h-4 w-4 text-slate-500" />
              <span>Account Type</span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {user?.role || "USER"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Upcoming Bookings Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Upcoming Events
              </h2>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                {upcoming.length}
              </span>
            </div>
          </div>

          <BookingList
            bookings={upcoming}
            loading={loading}
            emptyTitle="No upcoming events"
            emptyText="You haven't reserved any upcoming event tickets yet. Explore events to find your next plan."
          />
        </section>

        {/* Past Bookings Section */}
        <section className="mt-12 border-t border-border pt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Past & Inactive Bookings
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {past.length}
              </span>
            </div>
          </div>

          <BookingList
            bookings={past}
            loading={loading}
            emptyTitle="No past bookings"
            emptyText="Your history of attended events and prior bookings will appear here."
          />
        </section>
      </div>
    </main>
  );
}

function BookingList({
  bookings,
  loading,
  emptyTitle,
  emptyText,
}: {
  bookings: Booking[];
  loading: boolean;
  emptyTitle: string;
  emptyText: string;
}) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-xl border border-border bg-white"
          />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center">
        <Ticket className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-2 text-xs font-semibold text-slate-800">{emptyTitle}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
          {emptyText}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  );
}

function BookingCard({ booking: b }: { booking: Booking }) {
  const imageUrl = getEventImageUrl(b.image_url);
  const isConfirmed = b.status === "CONFIRMED";

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
      case "FAILED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-white p-4 sm:p-5 shadow-card transition-all duration-150 hover:border-slate-300 hover:shadow-card-hover">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-24 sm:w-24">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={b.event_name || "Event thumbnail"}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400">
              <Ticket className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-bold text-slate-900">
              {b.event_name}
            </h3>
            <Badge variant={getStatusBadgeVariant(b.status) as any}>
              {b.status}
            </Badge>
          </div>

          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            {b.event_date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {new Date(b.event_date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate">{b.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="text-xs">
          <span className="text-muted-foreground">Tickets: </span>
          <span className="font-semibold text-slate-900">{b.tickets}</span>
          <span className="text-muted-foreground ml-3">Total: </span>
          <span className="font-semibold text-slate-900">
            ₹{Number(b.total_amount).toLocaleString("en-IN")}
          </span>
        </div>

        <Link href={`/booking/confirmation/${b.id}`}>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <span>Ticket Receipt</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
