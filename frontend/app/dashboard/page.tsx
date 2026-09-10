"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Ticket,
  ArrowUpRight,
  Clock3,
  Sparkles,
} from "lucide-react";

import { getEventImageUrl } from "@/lib/image";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Booking } from "@/lib/types";
import { useAuth } from "@/lib/auth";

const statusColor: Record<string, string> = {
  CONFIRMED:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  PENDING:
    "border-amber-400/20 bg-amber-400/10 text-amber-300",
  CANCELLED:
    "border-white/10 bg-white/[0.05] text-white/55",
  FAILED:
    "border-red-400/20 bg-red-400/10 text-red-300",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/bookings").then((res) => {
      setBookings(res.data.data);
      setLoading(false);
    });
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
    <main className="page-surface relative min-h-screen overflow-hidden">
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-[88rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* Header */}
        <section className="premium-panel relative overflow-hidden p-7 sm:p-9">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Your event dashboard
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back,{" "}
                <span className="text-primary">
                  {user?.name?.split(" ")[0]}
                </span>
              </h1>

              <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                Keep track of your upcoming events and manage all your
                bookings in one place.
              </p>
            </div>

            <div className="hidden shrink-0 rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm sm:block">
              <Ticket className="h-8 w-8 text-primary" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <StatCard
            icon={<Calendar className="h-5 w-5" />}
            label="Upcoming Events"
            value={upcoming.length}
            description="Confirmed events ahead"
          />

          <StatCard
            icon={<Ticket className="h-5 w-5" />}
            label="Total Bookings"
            value={bookings.length}
            description="All your bookings"
          />
        </section>

        {/* Upcoming */}
        <section className="mt-12">
          <SectionHeader
            title="Upcoming Bookings"
            description="Events you are attending"
            count={upcoming.length}
          />

          <div className="mt-5">
            <BookingList
              bookings={upcoming}
              loading={loading}
              emptyText="No upcoming bookings yet."
            />
          </div>
        </section>

        {/* Past */}
        <section className="mt-12 pb-10">
          <SectionHeader
            title="Past & Other Bookings"
            description="Your previous and inactive bookings"
            count={past.length}
          />

          <div className="mt-5">
            <BookingList
              bookings={past}
              loading={loading}
              emptyText="Nothing here yet."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="glass card-hover group p-6 sm:p-7">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>

      <div className="mt-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  count,
}: {
  title: string;
  description: string;
  count: number;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>

          <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {count}
          </span>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function BookingList({
  bookings,
  loading,
  emptyText,
}: {
  bookings: Booking[];
  loading: boolean;
  emptyText: string;
}) {
  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]"
          />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="glass rounded-2xl border-dashed px-6 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
          <Ticket className="h-5 w-5 text-muted-foreground" />
        </div>

        <p className="mt-4 font-medium">{emptyText}</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Your booked events will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  );
}

function BookingCard({
  booking: b,
}: {
  booking: Booking;
}) {
  const imageUrl = getEventImageUrl(b.image_url);

  return (
    <Link
      href={`/booking/confirmation/${b.id}`}
      aria-label={`View booking details for ${b.event_name || "your event"}`}
      className="card-hover group block h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.055] shadow-glass backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex gap-4 p-4 sm:p-5">

        {/* Image */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] sm:h-28 sm:w-28">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={b.event_name || "Event"}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Ticket className="h-7 w-7 text-muted-foreground" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 font-semibold leading-snug">
              {b.event_name}
            </h3>

            <Badge
              // variant="outline"
              className={`shrink-0 text-[11px] font-medium ${statusColor[b.status]}`}
            >
              {b.status}
            </Badge>
          </div>

          <div className="mt-3 space-y-2">
            {b.event_date && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.05]">
                  <Calendar className="h-3.5 w-3.5" />
                </div>

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

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.05]">
                <MapPin className="h-3.5 w-3.5" />
              </div>

              <span className="truncate">{b.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {b.status === "CONFIRMED" && (
        <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            Booking confirmed
          </div>
          <span className="text-xs font-semibold text-primary transition-transform group-hover:translate-x-0.5">
            View ticket <span aria-hidden="true">-&gt;</span>
          </span>
        </div>
      )}
    </Link>
  );
}
