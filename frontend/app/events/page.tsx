"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Tag,
  ArrowDownUp,
  Sparkles,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/EventCard";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";

const CATEGORIES = [
  "Music",
  "Technology",
  "Art",
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
      setError("Unable to load events at this moment. Please check your connection and retry.");
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

  const hasFilters = search || category || location || minPrice || maxPrice;

  return (
    <main className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Event Marketplace
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Discover Live Experiences
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Browse, filter, and reserve verified tickets for upcoming events.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-subtle">
              <span className="font-semibold text-slate-900 mr-1">
                {events.length}
              </span>{" "}
              events found
            </span>
          </div>
        </div>

        {/* Quick Category Filter Chips */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              !category
                ? "border-primary bg-primary text-white shadow-subtle"
                : "border-border bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(category === item ? "" : item)}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                category === item
                  ? "border-primary bg-primary text-white shadow-subtle"
                  : "border-border bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Detailed Search & Filter Control Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchEvents();
          }}
          className="mt-5 rounded-xl border border-border bg-white p-4 shadow-card sm:p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search event name or artist..."
                className="pl-9 h-10"
              />
            </div>

            {/* Location Input */}
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City / Venue"
                className="pl-9 h-10"
              />
            </div>

            {/* Price Inputs */}
            <div className="flex gap-2">
              <Input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min ₹"
                type="number"
                min="0"
                className="h-10 text-xs"
              />
              <Input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ₹"
                type="number"
                min="0"
                className="h-10 text-xs"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="flex h-10 w-full appearance-none rounded-lg border border-border bg-white pl-9 pr-3 text-xs text-foreground shadow-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="date_asc">Date: Soonest first</option>
                <option value="date_desc">Date: Latest first</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button type="submit" size="md" className="flex-1 h-10">
                <Search className="h-3.5 w-3.5" />
                <span>Apply</span>
              </Button>
              {hasFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={clearFilters}
                  className="h-10 px-3 text-xs"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Active Filter Pills */}
        {hasFilters && !loading && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium text-slate-700 mr-1">Active filters:</span>
            {search && (
              <Badge variant="secondary" className="gap-1">
                Keyword: {search}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch("")} />
              </Badge>
            )}
            {category && (
              <Badge variant="secondary" className="gap-1">
                Category: {category}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setCategory("")} />
              </Badge>
            )}
            {location && (
              <Badge variant="secondary" className="gap-1">
                Location: {location}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setLocation("")} />
              </Badge>
            )}
            {minPrice && (
              <Badge variant="secondary" className="gap-1">
                Min: ₹{minPrice}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setMinPrice("")} />
              </Badge>
            )}
            {maxPrice && (
              <Badge variant="secondary" className="gap-1">
                Max: ₹{maxPrice}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setMaxPrice("")} />
              </Badge>
            )}
          </div>
        )}

        {/* Event Grid Section */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-xl border border-border bg-white shadow-card overflow-hidden h-84 animate-pulse"
                >
                  <div className="aspect-[16/10] bg-slate-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-28 rounded bg-slate-100" />
                    <div className="h-4 w-3/4 rounded bg-slate-100" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="pt-4 flex justify-between">
                      <div className="h-4 w-16 rounded bg-slate-100" />
                      <div className="h-6 w-16 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-dashed border-red-300 bg-red-50/50 p-12 text-center">
              <p className="text-sm font-semibold text-red-800">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={fetchEvents}
              >
                Retry
              </Button>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No matching events found
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                We couldn&apos;t find any events that match your current search criteria. Try loosening your filters or browsing all categories.
              </p>
              {hasFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-3 text-xs text-muted-foreground">Loading marketplace...</p>
        </main>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
