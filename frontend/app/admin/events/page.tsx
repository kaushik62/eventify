"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Ticket, Trash2, Users, Search } from "lucide-react";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/admin/events")
      .then((res) => setEvents(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

    try {
      setDeletingId(id);
      await api.delete(`/admin/events/${id}`);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  const totalSeats = events.reduce(
    (sum, event) => sum + Number(event.total_seats),
    0
  );

  const availableSeats = events.reduce(
    (sum, event) => sum + Number(event.available_seats),
    0
  );

  const soldSeats = totalSeats - availableSeats;

  const upcomingEvents = events.filter(
    (event) => new Date(event.event_date) >= new Date()
  ).length;

  const filteredEvents = events.filter((e) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    );
  });

  const getEventBadge = (event: EventItem) => {
    const isPast = new Date(event.event_date) < new Date();
    if (isPast) return <Badge variant="secondary">Past</Badge>;
    if (Number(event.available_seats) === 0) return <Badge variant="destructive">Sold out</Badge>;
    return <Badge variant="success">Active</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Platform Events Audit
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Monitor, audit, and moderate events published across the entire platform.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-white px-3 py-1.5 shadow-subtle">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Catalog Size:{" "}
          </span>
          <span className="text-xs font-bold text-slate-900">
            {loading ? "—" : events.length} listings
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-4 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Listings
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {loading ? "—" : events.length}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Upcoming Events
          </span>
          <p className="mt-2 text-2xl font-black text-emerald-600">
            {loading ? "—" : upcomingEvents}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Seats Allocated
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {loading ? "—" : totalSeats.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Tickets Sold
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {loading ? "—" : soldSeats.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border p-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Events Catalog</h2>
            <p className="text-xs text-muted-foreground">
              Showing {filteredEvents.length} of {events.length} listings
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event, venue, category..."
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-2 text-xs text-muted-foreground">Loading event catalog...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No events found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Venue Location</th>
                  <th>Pricing</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <span className="font-semibold text-slate-900 line-clamp-1 max-w-xs">
                        {e.name}
                      </span>
                    </td>
                    <td>
                      <Badge variant="outline">{e.category}</Badge>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600">
                        {new Date(e.event_date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600 line-clamp-1 max-w-[180px]">
                        {e.location}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold text-slate-900">
                        ₹{Number(e.price).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-700">
                        {e.total_seats - e.available_seats} / {e.total_seats}
                      </span>
                    </td>
                    <td>{getEventBadge(e)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => remove(e.id)}
                        disabled={deletingId === e.id}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                        title="Delete listing"
                      >
                        {deletingId === e.id ? (
                          <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}