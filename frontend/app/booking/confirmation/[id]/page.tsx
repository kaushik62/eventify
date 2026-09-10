"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Booking } from "@/lib/types";

export default function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    api.get(`/bookings/${id}`).then((res) => setBooking(res.data.data));
  }, [id]);

  if (!booking) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

          <p className="text-sm font-medium text-muted-foreground">
            Loading your booking...
          </p>
        </div>
      </div>
    );
  }

  const isConfirmed = booking.status === "CONFIRMED";

  const formattedDate = booking.event_date
    ? new Date(booking.event_date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const formattedAmount = Number(booking.total_amount).toLocaleString(
    "en-IN"
  );

  return (
    <div className="page-surface relative min-h-[calc(100vh-5rem)] overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-32 top-1/3 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Success Header */}
        <div className="text-center">
          <div className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-sm">
              <CheckCircle2 className="h-10 w-10" strokeWidth={2} />
            </div>
          </div>

          <div className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-semibold text-emerald-300">
            {isConfirmed ? "Payment successful" : "Booking received"}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {isConfirmed
              ? "Booking Confirmed!"
              : "Booking Pending"}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            {isConfirmed
              ? "Your spot is secured. Here are the details for your upcoming event."
              : "Your booking has been received and is currently being processed."}
          </p>
        </div>

        {/* Booking Card */}
        <div className="glass-strong mt-10 overflow-hidden">
          {/* Card Header */}
          <div className="border-b border-white/10 bg-white/[0.03] p-7 sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your event
                </p>

                <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                  {booking.event_name}
                </h2>
              </div>

              <div
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isConfirmed
                    ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/20"
                    : "bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400/20"
                }`}
              >
                {booking.status}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid gap-px border-b border-border bg-border sm:grid-cols-2">
            <div className="bg-card p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-semibold leading-6">
                    {formattedDate || "Date unavailable"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold leading-6">
                    {booking.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />

              <h3 className="text-sm font-semibold">
                Booking summary
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">
                  Tickets
                </span>

                <span className="font-semibold">
                  {booking.tickets}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">
                  Booking ID
                </span>

                <span className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1 font-mono text-xs font-semibold">
                  EVT-{String(booking.id).padStart(6, "0")}
                </span>
              </div>

              <div className="border-t border-dashed border-border pt-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total amount
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {booking.tickets}{" "}
                      {booking.tickets === 1 ? "ticket" : "tickets"}
                    </p>
                  </div>

                  <p className="text-2xl font-bold">
                    ₹{formattedAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Note */}
        <div className="glass mt-5 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock3 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Keep your booking ID handy
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                You can use EVT-{String(booking.id).padStart(6, "0")} to
                identify this booking from your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-11 w-full px-6 sm:w-auto"
            >
              View My Bookings
            </Button>
          </Link>

          <Link href="/events" className="w-full sm:w-auto">
            <Button className="h-11 w-full gap-2 px-6 sm:w-auto">
              Explore More Events
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Footer reassurance */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Thank you for choosing Eventify. Enjoy your experience!
        </p>
      </div>
    </div>
  );
}