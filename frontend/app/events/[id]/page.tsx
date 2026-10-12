"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Clock,
  User as UserIcon,
  Minus,
  Plus,
  Ticket,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/EventCard";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { getEventImageUrl } from "@/lib/image";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [related, setRelated] = useState<EventItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    api.get(`/events/${id}`).then((res) => {
      const data = res.data.data;
      setEvent(data?.event || data);
      setRelated(data?.related || []);
    });
  }, [id]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (!event) {
    return (
      <main className="min-h-screen bg-background py-24 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-xs font-medium text-muted-foreground">
          Loading event details...
        </p>
      </main>
    );
  }

  const imageUrl = getEventImageUrl(event.image_url);
  const total = Number(event.price) * quantity;
  const isSoldOut = event.available_seats === 0;
  const isOrganizerEvent = Boolean(
    user && user.role === "ORGANIZER" && event.organizer_id === user.id
  );

  const handleBooking = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (isOrganizerEvent) {
      setBookingError("Organizers cannot book tickets for their own events.");
      return;
    }

    setBookingError("");
    setProcessing(true);

    try {
      const bookingRes = await api.post("/bookings", {
        eventId: event.id,
        tickets: quantity,
      });

      const booking = bookingRes.data.data;

      const orderRes = await api.post("/payments/create-order", {
        bookingId: booking.id,
      });

      const { orderId, amount, currency, keyId } = orderRes.data.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Eventify",
        description: `Booking for ${event.name}`,
        order_id: orderId,

        handler: async (response: any) => {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking.id,
            });

            router.push(`/booking/confirmation/${booking.id}`);
          } catch (verifyErr: any) {
            setBookingError(
              verifyErr?.response?.data?.message ||
                "Payment verification failed. Please contact support with your transaction details."
            );
          }
        },

        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong while initiating booking. Please try again.";
      setBookingError(message);
    } finally {
      setProcessing(false);
    }
  };

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to events</span>
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Event Media, Meta, Details */}
          <div className="lg:col-span-8">
            {/* Event Media Banner */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-slate-100 shadow-card">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={event.name}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                  <Ticket className="h-12 w-12 text-slate-300" />
                  <span className="text-sm font-medium text-slate-500">
                    {event.category}
                  </span>
                </div>
              )}

              <div className="absolute left-4 top-4">
                <Badge variant="default" className="shadow-subtle">
                  {event.category}
                </Badge>
              </div>
            </div>

            {/* Event Title Header */}
            <div className="mt-6">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {event.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    Hosted by{" "}
                    <strong className="font-semibold text-slate-900">
                      {event.organizer_name || "Eventify Partner"}
                    </strong>
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified Event</span>
                </div>
              </div>
            </div>

            {/* Key Event Details Grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3.5 rounded-xl border border-border bg-white p-4 shadow-subtle">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {formattedDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-xl border border-border bg-white p-4 shadow-subtle">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Time
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {event.event_time || "To be announced"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-xl border border-border bg-white p-4 shadow-subtle">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Venue Location
                  </p>
                  <p className="truncate text-xs font-semibold text-slate-900">
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-xl border border-border bg-white p-4 shadow-subtle">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Capacity
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {event.available_seats} / {event.total_seats} tickets remaining
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-subtle sm:p-8">
              <h2 className="text-base font-bold text-slate-900">
                About this Event
              </h2>
              <div className="mt-4 whitespace-pre-line text-xs leading-relaxed text-slate-700 sm:text-sm">
                {event.description || "No specific details provided for this event."}
              </div>
            </div>

            {/* Related Events Section */}
            {related.length > 0 && (
              <div className="mt-12 border-t border-border pt-10">
                <h2 className="text-lg font-bold text-slate-900">
                  Similar Events You Might Like
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {related.map((r) => (
                    <EventCard key={r.id} event={r} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Checkout & Booking Card */}
          <aside className="lg:col-span-4">
            <div className="sticky top-20 rounded-xl border border-border bg-white p-6 shadow-card">
              {/* Header: Pricing & Status */}
              <div className="border-b border-border pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Admission Price
                    </span>
                    <span className="text-2xl font-black tracking-tight text-slate-900">
                      ₹{Number(event.price).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      / ticket
                    </span>
                  </div>

                  <div>
                    {isSoldOut ? (
                      <Badge variant="destructive">Sold out</Badge>
                    ) : event.available_seats <= 10 ? (
                      <Badge variant="warning">{event.available_seats} seats left</Badge>
                    ) : (
                      <Badge variant="success">Available</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="py-5 border-b border-border">
                <label className="block text-xs font-semibold text-slate-900 mb-2">
                  Select Tickets
                </label>
                <div className="flex items-center justify-between rounded-lg border border-border bg-slate-50 p-2">
                  <span className="text-xs font-medium text-slate-700 pl-2">
                    Standard Admission
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || isSoldOut}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-slate-700 shadow-subtle transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Decrease tickets"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <span className="w-8 text-center text-sm font-bold text-slate-900">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(event.available_seats, q + 1)
                        )
                      }
                      disabled={
                        quantity >= event.available_seats || isSoldOut
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-slate-700 shadow-subtle transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Increase tickets"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="py-4 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    ₹{Number(event.price).toLocaleString("en-IN")} × {quantity}{" "}
                    ticket{quantity > 1 ? "s" : ""}
                  </span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Platform fee</span>
                  <span className="text-emerald-600 font-medium">₹0 (Free)</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">Total Amount</span>
                  <span className="text-lg font-black text-slate-900">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Booking Error Message */}
              {bookingError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {bookingError}
                </div>
              )}

              {/* Primary Action Button */}
              <Button
                size="lg"
                className="w-full h-11 text-sm font-semibold"
                disabled={isSoldOut || processing || isOrganizerEvent}
                onClick={handleBooking}
              >
                <Lock className="h-4 w-4 mr-1.5" />
                {isOrganizerEvent
                  ? "Created by You"
                  : isSoldOut
                  ? "Sold Out"
                  : processing
                  ? "Connecting to Razorpay..."
                  : "Book Tickets"}
              </Button>

              {isOrganizerEvent && (
                <p className="mt-2 text-center text-[11px] text-amber-600">
                  Organizers cannot purchase tickets for their own listings.
                </p>
              )}

              {/* Security strip */}
              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% Secure Checkout via Razorpay</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
