"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";

const CATEGORIES = ["Music", "Art", "Technology", "Sports", "Conferences", "Food"];

function EventsContent() {
  const params = useSearchParams();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [location, setLocation] = useState(params.get("location") || "");
  const [sort, setSort] = useState("date_asc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [search, category, location, minPrice, maxPrice, sort]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-violet-700">The Eventify edit</p>
          <h1 className="text-4xl font-bold tracking-tight">Find your next plan</h1>
          <p className="mt-2 text-sm text-muted-foreground">Curated experiences, ready when you are.</p>
        </div>
        <div className="rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-muted-foreground shadow-sm">
          {events.length > 0 ? `${events.length} experiences found` : "Fresh experiences weekly"}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchEvents();
        }}
        className="mb-10 grid grid-cols-1 gap-3 rounded-2xl border border-border/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-6"
      >
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events" className="pl-9" />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-lg border border-border bg-background px-3 text-sm"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <Input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min ₹" type="number" />
        <Input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max ₹" type="number" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-11 rounded-lg border border-border bg-background px-3 text-sm lg:col-span-2"
        >
          <option value="date_asc">Date: Soonest first</option>
          <option value="date_desc">Date: Latest first</option>
          <option value="price_asc">Price: Low to high</option>
          <option value="price_desc">Price: High to low</option>
        </select>
        <Button type="submit" className="lg:col-span-1">Apply Filters</Button>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
          No events match your filters. Try broadening your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((event, index) => (
            <div key={event.id} className={`reveal-up reveal-delay-${Math.min((index % 3) + 1, 3)}`}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-muted-foreground">Loading events...</div>}>
      <EventsContent />
    </Suspense>
  );
}
