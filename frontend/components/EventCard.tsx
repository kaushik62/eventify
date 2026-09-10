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
    <article className="card-hover group block h-full overflow-hidden rounded-[1.6rem] border border-border/75 bg-gradient-to-br from-card via-card to-orange-50/60 shadow-[0_18px_42px_-28px_rgba(24,44,53,0.52)]">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
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

        <Badge className="absolute left-4 top-4 border border-white/60 bg-white/90 text-foreground shadow-sm backdrop-blur-md">
          {event.category}
        </Badge>

        {isAlmostFull && (
          <Badge className="absolute right-14 top-4 border-0 bg-amber-400/95 text-amber-950 shadow-sm">
            Limited
          </Badge>
        )}

        <button
          onClick={(e) => e.preventDefault()}
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/60 bg-white/90 text-foreground shadow-sm backdrop-blur-md transition hover:scale-105 hover:text-primary"
          aria-label="Favorite"
        >
          <Heart className="h-4 w-4" />
        </button>

        <Link href={`/events/${event.id}`} className="absolute inset-0 z-10" aria-label={`View ${event.name}`} />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
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

      <Link href={`/events/${event.id}`} className="block space-y-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{date}</p>
            <h3 className="mt-1 line-clamp-2 text-xl font-bold leading-tight tracking-[-0.025em] text-foreground">{event.name}</h3>
          </div>
        </div>

        <p className="flex min-h-5 items-center gap-1.5 truncate text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          {event.location}
        </p>

        <div className="flex items-center justify-between border-t border-border/70 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">From</p>
            <span className="text-base font-bold text-foreground">
              ₹{Number(event.price).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary">
            <Users className="h-3.5 w-3.5" />
            Book now
          </div>
        </div>
      </Link>
    </article>
  );
}
