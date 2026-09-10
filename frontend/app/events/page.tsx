"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  MapPin,
  Tag,
  ArrowDownUp,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";

const CATEGORIES = [
  "Music",
  "Art",
  "Technology",
  "Sports",
  "Conferences",
  "Food",
];

function EventsContent() {
  const params = useSearchParams();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [location, setLocation] = useState(params.get("location") || "");
  const [sort, setSort] = useState("date_asc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/events", {
        params: {
          search: search || undefined,
          category: category || undefined,
          location: location || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort,
          limit: 24,
        },
      });

      setEvents(res.data.data.events);
    } catch {
      setEvents([]);
      setError("We could not load events right now. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [search, category, location, minPrice, maxPrice, sort]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setSort("date_asc");
  };

  const hasFilters =
    search || category || location || minPrice || maxPrice;

  return (
    <main className="page-surface min-h-screen">
      <div className="mx-auto max-w-[88rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* Hero */}
        <section className="premium-panel relative overflow-hidden">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              The Eventify edit
            </div>

            <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Find your next{" "}
                  <span className="text-primary">plan.</span>
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Discover concerts, conferences, sports, food experiences,
                  and more happening around you.
                </p>
              </div>

              <div className="glass flex w-fit items-center gap-2 px-5 py-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Tag className="h-4 w-4 text-primary" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Available now
                  </p>
                  <p className="font-semibold">
                    {events.length} events
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category shortcuts */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <CategoryButton
            label="All"
            active={!category}
            onClick={() => setCategory("")}
          />

          {CATEGORIES.map((item) => (
            <CategoryButton
              key={item}
              label={item}
              active={category === item}
              onClick={() => setCategory(item)}
            />
          ))}
        </div>

        {/* Search & filters */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchEvents();
          }}
          className="glass mt-5 p-5 sm:p-6"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />

            <div>
              <p className="text-sm font-semibold">
                Search & filter events
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Find the right event using the filters below
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">

            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="h-11 rounded-xl pl-9"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input h-11 w-full appearance-none pl-9 pr-3 text-sm"
              >
                <option value="">All categories</option>

                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="h-11 rounded-xl pl-9"
              />
            </div>

            {/* Min price */}
            <Input
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min price"
              type="number"
              min="0"
              className="h-11 rounded-xl"
            />

            {/* Max price */}
            <Input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price"
              type="number"
              min="0"
              className="h-11 rounded-xl"
            />

            {/* Sort */}
            <div className="relative sm:col-span-2 lg:col-span-3">
              <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="glass-input h-11 w-full appearance-none pl-9 pr-3 text-sm"
              >
                <option value="date_asc">
                  Date: Soonest first
                </option>

                <option value="date_desc">
                  Date: Latest first
                </option>

                <option value="price_asc">
                  Price: Low to high
                </option>

                <option value="price_desc">
                  Price: High to low
                </option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 sm:col-span-2 lg:col-span-3 lg:justify-end">
              {hasFilters && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="h-11 rounded-xl"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}

              <Button
                type="submit"
                className="h-11 flex-1 rounded-xl sm:flex-none"
              >
                <Search className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </form>

        {/* Results header */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Explore events
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {loading
                ? "Finding events for you..."
                : events.length > 0
                ? `${events.length} ${
                    events.length === 1 ? "event" : "events"
                  } available`
                : "No matching events"}
            </p>
          </div>

          {hasFilters && !loading && (
            <div className="flex flex-wrap gap-2">
              {search && <FilterPill label={`Search: ${search}`} />}
              {category && <FilterPill label={category} />}
              {location && <FilterPill label={location} />}
              {minPrice && (
                <FilterPill label={`Min ₹${minPrice}`} />
              )}
              {maxPrice && (
                <FilterPill label={`Max ₹${maxPrice}`} />
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <section className="mt-5">
          {loading ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <EventSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 px-6 py-16 text-center">
              <h3 className="font-semibold">Unable to load events</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{error}</p>
              <Button className="mt-5 rounded-xl" onClick={fetchEvents}>Try again</Button>
            </div>
          ) : events.length === 0 ? (
            <EmptyState onClear={clearFilters} hasFilters={!!hasFilters} />
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`reveal-up reveal-delay-${Math.min(
                    (index % 3) + 1,
                    3
                  )}`}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function CategoryButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "border-primary/30 bg-primary text-primary-foreground shadow-[0_4px_16px_-4px_hsl(var(--primary)/0.5)]"
          : "border-white/10 bg-white/[0.04] text-muted-foreground backdrop-blur-sm hover:border-primary/30 hover:bg-white/[0.07] hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
      {label}
    </span>
  );
}

function EventSkeleton() {
  return (
    <div className="glass overflow-hidden">
      <div className="h-48 animate-pulse bg-white/[0.04]" />

      <div className="space-y-3 p-6">
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.06]" />
        <div className="mt-4 h-8 w-1/3 animate-pulse rounded bg-white/[0.06]" />
      </div>
    </div>
  );
}

function EmptyState({
  onClear,
  hasFilters,
}: {
  onClear: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="glass rounded-3xl border-dashed px-6 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        No events found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        We couldn&apos;t find any events matching your current search.
        Try changing your filters or searching for something else.
      </p>

      {hasFilters && (
        <Button
          variant="outline"
          className="mt-6 rounded-xl"
          onClick={onClear}
        >
          <X className="mr-2 h-4 w-4" />
          Clear all filters
        </Button>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <main className="page-surface min-h-screen">
          <div className="mx-auto max-w-[88rem] px-4 py-24 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading events…
            </p>
          </div>
        </main>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
