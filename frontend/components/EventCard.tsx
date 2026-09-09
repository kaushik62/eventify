import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Heart, Sparkles, Users } from "lucide-react";
import { EventItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { getEventImageUrl } from "@/lib/image";

export function EventCard({ event }: { event: EventItem }) {
  const date = new Date(event.event_date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  const seatsLeft = Number(event.available_seats ?? 0);
  const isAlmostFull = seatsLeft > 0 && seatsLeft <= 10;

  return (
    <div className="card-hover group block overflow-hidden rounded-[1.6rem] border border-border/80 bg-card shadow-sm">
      <div className="relative h-56 w-full overflow-hidden bg-muted">
        {getEventImageUrl(event.image_url) ? (
          <Image
            src={getEventImageUrl(event.image_url) || ""}
            alt={event.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 gradient-brand px-6 text-center text-white">
            <CalendarDays className="h-8 w-8 opacity-80" />
            <span className="text-sm font-semibold">{event.category} experience</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

        <Badge className="absolute left-3 top-3 border-0 bg-white/90 text-foreground shadow-sm">
          {event.category}
        </Badge>

        {isAlmostFull && (
          <Badge className="absolute right-12 top-3 border-0 bg-amber-400/95 text-amber-950 shadow-sm">
            Limited
          </Badge>
        )}

        <button
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-foreground shadow-sm transition hover:scale-105"
          aria-label="Favorite"
        >
          <Heart className="h-4 w-4" />
        </button>

        <Link href={`/events/${event.id}`} className="absolute inset-0 z-10" aria-label={`View ${event.name}`} />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3 text-white">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">{date}</p>
            <p className="mt-1 text-xs text-white/80">{seatsLeft} seats left</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-amber-300" />
            Top pick
          </div>
        </div>
      </div>

      <Link href={`/events/${event.id}`} className="block space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{date}</p>
            <h3 className="mt-1 line-clamp-1 text-base font-bold text-foreground">{event.name}</h3>
          </div>
        </div>

        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          {event.location}
        </p>

        <div className="flex items-center justify-between border-t border-border/70 pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">From</p>
            <span className="text-sm font-bold text-foreground">
              ₹{Number(event.price).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary">
            <Users className="h-3.5 w-3.5" />
            Book now
          </div>
        </div>
      </Link>
    </div>
  );
}
