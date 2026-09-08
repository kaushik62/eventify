"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
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
    return <div className="mx-auto max-w-xl px-4 py-20 text-center text-muted-foreground">Loading booking…</div>;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <h1 className="text-2xl font-bold">
        {booking.status === "CONFIRMED" ? "Booking Confirmed" : "Booking Pending"}
      </h1>

      <div className="mt-8 space-y-3 rounded-xl border border-border p-6 text-left">
        <h2 className="text-lg font-semibold">{booking.event_name}</h2>
        <p className="text-sm text-muted-foreground">
          {booking.event_date &&
            new Date(booking.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          {" · "}
          {booking.location}
        </p>
        <div className="flex justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground">Tickets</span>
          <span className="font-medium">{booking.tickets}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-medium">₹{Number(booking.total_amount).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Booking ID</span>
          <span className="font-mono font-medium">EVT-{String(booking.id).padStart(6, "0")}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/dashboard">
          <Button variant="outline">View Bookings</Button>
        </Link>
        <Link href="/events">
          <Button>Back to Events</Button>
        </Link>
      </div>
    </div>
  );
}
