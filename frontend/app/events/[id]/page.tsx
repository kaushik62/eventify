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

  useEffect(() => {
    api.get(`/events/${id}`).then((res) => {
      setEvent(res.data.data.event);
      setRelated(res.data.data.related);
    });
  }, [id]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!event) {
    return (
      <main className="min-h-screen bg-muted/20">
        <div className="mx-auto max-w-[88rem] px-4 py-24 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading event…
          </p>
        </div>
      </main>
    );
  }

  const imageUrl = getEventImageUrl(event.image_url);
  const total = Number(event.price) * quantity;
  const isSoldOut = event.available_seats === 0;
  const isOrganizerEvent = Boolean(user && user.role === "ORGANIZER" && event.organizer_id === user.id);

  const handleBooking = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (isOrganizerEvent) {
      alert("Organizers cannot book their own events.");
      return;
    }

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
        description: event.name,
        order_id: orderId,

        handler: async (response: any) => {
          await api.post("/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: booking.id,
          });

          router.push(`/booking/confirmation/${booking.id}`);
        },

        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong while creating your booking.";
      alert(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background">
      <div className="mx-auto max-w-[88rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">

          {/* Main content */}
          <div className="min-w-0 lg:col-span-2">

            {/* Hero image */}
            <div className="group relative h-[280px] overflow-hidden rounded-3xl bg-muted shadow-xl sm:h-[400px] lg:h-[500px]">
              {imageUrl ? (
                <>
                  <Image
                    src={imageUrl}
                    alt={event.name}
                    fill
                    priority
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7">
                    <Badge className="border-0 bg-white/95 text-black shadow-sm backdrop-blur">
                      {event.category}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="gradient-brand flex h-full w-full items-center justify-center">
                  <div className="text-center text-white">
                    <Ticket className="mx-auto h-12 w-12 opacity-80" />
                    <p className="mt-3 text-lg font-semibold">
                      {event.category}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Event heading */}
            <div className="mt-7">
              {!imageUrl && (
                <Badge className="mb-3">{event.category}</Badge>
              )}

              <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {event.name}
              </h1>

              <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                Join us for an unforgettable experience.
              </p>
            </div>

            {/* Event information */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={<Calendar className="h-5 w-5" />}
                label="Date"
                value={new Date(event.event_date).toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              />

              <InfoCard
                icon={<Clock className="h-5 w-5" />}
                label="Time"
                value={event.event_time}
              />

              <InfoCard
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value={event.location}
              />

              <InfoCard
                icon={<UserIcon className="h-5 w-5" />}
                label="Organized by"
                value={event.organizer_name || "Eventify organizer"}
              />
            </div>

            {/* Description */}
            <section className="mt-10 rounded-2xl border bg-background p-6 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold">About this event</h2>

              <div className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
                {event.description}
              </div>
            </section>

            {/* Related events */}
            {related.length > 0 && (
              <section className="mt-12 pb-8">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      You may also like
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      More events you might enjoy
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {related.map((r) => (
                    <EventCard key={r.id} event={r} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Booking panel */}
          <aside className="lg:relative">
            <div className="sticky top-24 overflow-hidden rounded-3xl border bg-background shadow-xl">

              {/* Price header */}
              <div className="border-b bg-muted/20 p-6 sm:p-7">
                <p className="text-sm font-medium text-muted-foreground">
                  Starting from
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight">
                    ₹{Number(event.price).toLocaleString("en-IN")}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    / ticket
                  </span>
                </div>

                {/* Availability */}
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isSoldOut ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  />

                  <span className="text-xs font-medium text-muted-foreground">
                    {isSoldOut
                      ? "Sold out"
                      : `${event.available_seats} seats available`}
                  </span>
                </div>
              </div>

              {/* Booking controls */}
              <div className="p-6 sm:p-7">

                <div>
                  <p className="text-sm font-semibold">Select tickets</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Choose how many tickets you need
                  </p>
                </div>

                {/* Quantity */}
                <div className="mt-5 flex items-center justify-between rounded-2xl border bg-muted/20 p-3">
                  <span className="pl-2 text-sm font-medium">
                    Tickets
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.max(1, q - 1))
                      }
                      disabled={quantity <= 1}
                      className="grid h-9 w-9 place-items-center rounded-full border bg-background transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease tickets"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="w-6 text-center text-base font-semibold">
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(event.available_seats, q + 1)
                        )
                      }
                      disabled={
                        quantity >= event.available_seats
                      }
                      className="grid h-9 w-9 place-items-center rounded-full border bg-background transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Increase tickets"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ₹{Number(event.price).toLocaleString("en-IN")} ×{" "}
                      {quantity} ticket{quantity > 1 ? "s" : ""}
                    </span>

                    <span>
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        Total
                      </span>

                      <span className="text-xl font-bold">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  className="mt-6 h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/20"
                  size="lg"
                  disabled={isSoldOut || processing || isOrganizerEvent}
                  onClick={handleBooking}
                >
                  {isOrganizerEvent
                    ? "Own Event"
                    : isSoldOut
                    ? "Sold Out"
                    : processing
                    ? "Processing…"
                    : "Book Now"}
                </Button>

                {isOrganizerEvent && (
                  <p className="mt-3 text-center text-xs text-amber-600">
                    Organizers cannot book tickets for events they created.
                  </p>
                )}

                {/* Trust message */}
                <div className="mt-5 flex items-start gap-3 rounded-xl bg-muted/50 p-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <p className="text-[11px] leading-5 text-muted-foreground">
                    Secure checkout powered by Razorpay. Your payment
                    information is handled securely.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}
