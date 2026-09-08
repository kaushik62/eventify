"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Calendar, Clock, User as UserIcon, Minus, Plus } from "lucide-react";
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
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">Loading event…</div>;
  }

  const total = Number(event.price) * quantity;

  const handleBooking = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setProcessing(true);
    try {
      const bookingRes = await api.post("/bookings", { eventId: event.id, tickets: quantity });
      const booking = bookingRes.data.data;

      const orderRes = await api.post("/payments/create-order", { bookingId: booking.id });
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
        theme: { color: "#7c3aed" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating your booking.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-muted shadow-xl shadow-primary/10 sm:h-[30rem]">
            {getEventImageUrl(event.image_url) ? (
              <Image src={getEventImageUrl(event.image_url) || ""} alt={event.name} fill unoptimized className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center gradient-brand text-white">
                {event.category}
              </div>
            )}
          </div>

          <Badge className="mt-6">{event.category}</Badge>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">{event.name}</h1>

          <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(event.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {event.event_time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {event.location}
            </span>
            <span className="flex items-center gap-1.5">
              <UserIcon className="h-4 w-4" /> {event.organizer_name}
            </span>
          </div>

          <h2 className="mt-8 mb-2 text-lg font-semibold">About this event</h2>
          <p className="whitespace-pre-line text-muted-foreground">{event.description}</p>

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-4 text-lg font-semibold">You may also like</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {related.map((r) => (
                  <EventCard key={r.id} event={r} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking panel */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-border/80 bg-card p-6 shadow-xl shadow-primary/10">
            <p className="text-sm text-muted-foreground">Price per ticket</p>
            <p className="text-3xl font-bold">₹{Number(event.price).toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{event.available_seats} seats available</p>

            <div className="mt-6 flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-sm font-medium">Tickets</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="grid h-8 w-8 place-items-center rounded-full border border-border"
                  aria-label="Decrease"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-4 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(event.available_seats, q + 1))}
                  className="grid h-8 w-8 place-items-center rounded-full border border-border"
                  aria-label="Increase"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="text-muted-foreground">Total amount</span>
              <span className="font-semibold">₹{total.toLocaleString("en-IN")}</span>
            </div>

            <Button
              className="mt-6 w-full"
              size="lg"
              disabled={event.available_seats === 0 || processing}
              onClick={handleBooking}
            >
              {event.available_seats === 0 ? "Sold Out" : processing ? "Processing…" : "Book Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
