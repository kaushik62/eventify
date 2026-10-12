import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { EventItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { getEventImageUrl } from "@/lib/image";

export function EventCard({ event }: { event: EventItem }) {
  const dateFormatted = new Date(event.event_date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const seatsLeft = Number(event.available_seats ?? 0);
  const isAlmostFull = seatsLeft > 0 && seatsLeft <= 10;
  const isSoldOut = seatsLeft === 0;

  const formatTime = (time: string) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  const imageUrl = getEventImageUrl(event.image_url);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-card-hover">
      {/* Cover Image Container */}
      <Link href={`/events/${event.id}`} className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-102"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-slate-50 text-slate-400">
            <CalendarDays className="h-8 w-8 text-slate-300" />
            <span className="text-xs font-medium text-slate-500">{event.category}</span>
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-800 shadow-subtle backdrop-blur-sm border border-slate-200/60">
            {event.category}
          </span>
        </div>

        {/* Seat Availability Status */}
        {isSoldOut ? (
          <div className="absolute right-3 top-3 z-10">
            <Badge variant="destructive" className="shadow-subtle">
              Sold out
            </Badge>
          </div>
        ) : isAlmostFull ? (
          <div className="absolute right-3 top-3 z-10">
            <Badge variant="warning" className="shadow-subtle">
              {seatsLeft} left
            </Badge>
          </div>
        ) : null}
      </Link>

      {/* Content Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Date & Time metadata */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>
            {dateFormatted}
            {event.event_time ? ` • ${formatTime(event.event_time)}` : ""}
          </span>
        </div>

        {/* Title */}
        <Link href={`/events/${event.id}`} className="mt-1.5 block">
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900 transition-colors group-hover:text-primary">
            {event.name}
          </h3>
        </Link>

        {/* Description snippet */}
        {event.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        )}

        {/* Location venue */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{event.location}</span>
        </div>

        {/* Footer: Price & CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Price
            </span>
            <span className="text-sm font-bold text-slate-900">
              ₹{Number(event.price).toLocaleString("en-IN")}
            </span>
          </div>

          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-primary/40 hover:bg-primary hover:text-white"
          >
            <span>Book</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
