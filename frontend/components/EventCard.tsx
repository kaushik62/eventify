import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Heart } from "lucide-react";
import { EventItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { getEventImageUrl } from "@/lib/image";

export function EventCard({ event }: { event: EventItem }) {
  const date = new Date(event.event_date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/events/${event.id}`}
      className="card-hover group block overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"
    >
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        {getEventImageUrl(event.image_url) ? (
          <Image
            src={getEventImageUrl(event.image_url) || ""}
            alt={event.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 gradient-brand px-6 text-center text-white">
            <CalendarDays className="h-8 w-8 opacity-80" />
            <span className="text-sm font-semibold">{event.category} experience</span>
          </div>
        )}
        <Badge className="absolute left-3 top-3 bg-white/90 text-foreground">{event.category}</Badge>
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-foreground"
          aria-label="Favorite"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">{date}</p>
        <h3 className="line-clamp-1 text-base font-bold">{event.name}</h3>
        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {event.location}
        </p>
        <div className="flex items-center justify-between border-t border-border/70 pt-3">
          <span className="text-sm font-semibold">From ₹{Number(event.price).toLocaleString("en-IN")}</span>
          <span className="text-primary transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
