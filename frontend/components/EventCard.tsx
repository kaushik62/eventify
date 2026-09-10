import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Sparkles, Users, Clock, Tag } from "lucide-react";
import { EventItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { getEventImageUrl } from "@/lib/image";

export function EventCard({ event }: { event: EventItem }) {
  const date = new Date(event.event_date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const seatsLeft = Number(event.available_seats ?? 0);
  const isAlmostFull = seatsLeft > 0 && seatsLeft <= 10;
  const isSoldOut = seatsLeft === 0;

  // Format time nicely
  const formatTime = (time: string) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  return (
    <article className="card-hover group block h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.075] via-white/[0.04] to-primary/[0.03] shadow-glass backdrop-blur-xl">

      {/* Image section */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
        {getEventImageUrl(event.image_url) ? (
          <Image
            src={getEventImageUrl(event.image_url) || ""}
            alt={event.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 gradient-brand px-6 text-center text-white">
            <CalendarDays className="h-10 w-10 opacity-70" />
            <span className="text-sm font-semibold opacity-90">{event.category} experience</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category badge */}
        <Badge className="absolute left-5 top-5 border border-white/20 bg-background/60 text-foreground backdrop-blur-md">
          <Tag className="mr-1 h-3 w-3" />
          {event.category}
        </Badge>

        {/* Status badges */}
        {isSoldOut ? (
          <Badge className="absolute right-5 top-5 border-0 bg-red-500/90 text-white">
            Sold Out
          </Badge>
        ) : isAlmostFull ? (
          <Badge className="absolute right-5 top-5 border-0 bg-amber-400/90 text-amber-950">
            {seatsLeft} left
          </Badge>
        ) : null}

        {/* Invisible link overlay */}
        <Link href={`/events/${event.id}`} className="absolute inset-0 z-10" aria-label={`View ${event.name}`} />

        {/* Bottom info overlay */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">{date}</p>
            {event.event_time && (
              <p className="mt-0.5 text-xs text-white/55">{formatTime(event.event_time)}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-medium backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-primary" />
            Top pick
          </div>
        </div>
      </div>

      {/* Content section */}
      <Link href={`/events/${event.id}`} className="block space-y-4 p-6 sm:p-7">
        <div>
          <h3 className="line-clamp-2 text-lg font-bold leading-tight tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary sm:text-[1.2rem]">
            {event.name}
          </h3>
          {event.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {event.description}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="flex items-center gap-2 truncate text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
            {event.location}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0 text-accent" />
            {date}{event.event_time ? ` · ${formatTime(event.event_time)}` : ""}
          </p>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">From</p>
            <span className="text-xl font-bold tracking-tight text-foreground">
              ₹{Number(event.price).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
            <Users className="h-3.5 w-3.5" />
            Book now
          </div>
        </div>
      </Link>
    </article>
  );
}
