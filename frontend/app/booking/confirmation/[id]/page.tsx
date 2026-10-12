"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Ticket,
  Receipt,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-muted-foreground">
            Loading your booking details...
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

  const formattedAmount = Number(booking.total_amount).toLocaleString("en-IN");
  const referenceId = `EVT-${String(booking.id).padStart(6, "0")}`;

  return (
    <main className="min-h-screen bg-background py-10 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="inline-flex items-center">
            <Badge variant={isConfirmed ? "success" : "warning"}>
              {isConfirmed ? "Payment Confirmed" : "Processing"}
            </Badge>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {isConfirmed ? "Your spot is confirmed!" : "Booking Received"}
          </h1>

          <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">
            {isConfirmed
              ? "We've confirmed your reservation with the organizer. Your electronic ticket voucher is ready below."
              : "Your booking has been received and payment is being finalized."}
          </p>
        </div>

        {/* Digital Ticket Voucher Card */}
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-white shadow-card">
          {/* Card Top */}
          <div className="border-b border-border bg-slate-50/70 p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Official Admission Ticket
                </span>
                <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                  {booking.event_name}
                </h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Reference ID
                </span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  {referenceId}
                </span>
              </div>
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid gap-px border-b border-border bg-border sm:grid-cols-2">
            <div className="bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Date & Schedule
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-900">
                    {formattedDate || "Date to be confirmed"}
                  </p>
                  {booking.event_time && (
                    <p className="text-[11px] text-muted-foreground">
                      Time: {booking.event_time}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Venue Location
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-900 line-clamp-2">
                    {booking.location || "Venue details in dashboard"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Summary */}
          <div className="p-6 sm:p-7">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-900">
              <Receipt className="h-4 w-4 text-slate-400" />
              <span>Transaction Summary</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Total Reserved Tickets</span>
                <span className="font-semibold text-slate-900">
                  {booking.tickets} {booking.tickets === 1 ? "Ticket" : "Tickets"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Payment Gateway</span>
                <span className="text-slate-700 font-medium">Razorpay Verified</span>
              </div>

              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <div>
                  <span className="block font-semibold text-slate-900 text-sm">
                    Total Amount Paid
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Inclusive of all applicable taxes
                  </span>
                </div>
                <span className="text-xl font-black text-slate-900">
                  ₹{formattedAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              View in My Bookings
            </Button>
          </Link>
          <Link href="/events" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              Explore More Events
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}