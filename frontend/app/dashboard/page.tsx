"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { getEventImageUrl } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Booking } from "@/lib/types";
import { useAuth } from "@/lib/auth";

const statusColor: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-gray-100 text-gray-600",
  FAILED: "bg-red-100 text-red-700",
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
  const upcoming = bookings.filter((b) => b.event_date && new Date(b.event_date) >= now && b.status === "CONFIRMED");
  const past = bookings.filter((b) => !upcoming.includes(b));

  const cancel = async (id: number) => {
    if (!confirm("Cancel this booking?")) return;
    await api.delete(`/bookings/${id}`);
    load();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Welcome back, {user?.name.split(" ")[0]}</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Upcoming Events</p>
          <p className="mt-1 text-2xl font-bold">{upcoming.length}</p>
        </div>
        <div className="rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="mt-1 text-2xl font-bold">{bookings.length}</p>
        </div>
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold">Upcoming Bookings</h2>
      <BookingList bookings={upcoming} loading={loading} onCancel={cancel} emptyText="No upcoming bookings yet." />

      <h2 className="mb-4 mt-10 text-lg font-semibold">Past & Other Bookings</h2>
      <BookingList bookings={past} loading={loading} onCancel={cancel} emptyText="Nothing here yet." />
    </div>
  );
}

function BookingList({
  bookings,
  loading,
  onCancel,
  emptyText,
}: {
  bookings: Booking[];
  loading: boolean;
  onCancel: (id: number) => void;
  emptyText: string;
}) {
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (bookings.length === 0) return <p className="text-sm text-muted-foreground">{emptyText}</p>;

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <div key={b.id} className="flex items-center gap-4 rounded-xl border border-border p-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            {getEventImageUrl(b.image_url) && <Image src={getEventImageUrl(b.image_url) || ""} alt={b.event_name || ""} fill unoptimized className="object-cover" />}
          </div>
          <div className="flex-1">
            <p className="font-medium">{b.event_name}</p>
            <p className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {b.event_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(b.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {b.location}
              </span>
            </p>
          </div>
          <Badge className={statusColor[b.status]}>{b.status}</Badge>
          {b.status === "CONFIRMED" && (
            <Button variant="outline" size="sm" onClick={() => onCancel(b.id)}>
              Cancel
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
