"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";
import { getEventImageUrl } from "@/lib/image";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/events/organizer/my-events").then((res) => {
      setEvents(res.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    await api.delete(`/events/${id}`);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Link href="/organizer/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-muted-foreground">You haven&apos;t created any events yet.</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="flex items-center gap-4 rounded-xl border border-border p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                {getEventImageUrl(e.image_url) && <Image src={getEventImageUrl(e.image_url) || ""} alt={e.name} fill unoptimized className="object-cover" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{e.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(e.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                  {e.available_seats}/{e.total_seats} seats left
                </p>
              </div>
              <Link href={`/events/${e.id}`} className="text-sm font-medium text-primary">
                View
              </Link>
              <button onClick={() => remove(e.id)} className="text-red-500" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
