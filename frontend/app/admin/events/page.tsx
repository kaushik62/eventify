"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  const load = () => {
    api.get("/admin/events").then((res) => setEvents(res.data.data));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this event? This is permanent.")) return;
    await api.delete(`/admin/events/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Events</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3">Event</th>
              <th className="p-3">Organizer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Seats</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="p-3">{e.name}</td>
                  <td className="p-3">{e.organizer_name}</td>
                  <td className="p-3">{new Date(e.event_date).toLocaleDateString("en-IN")}</td>
                  <td className="p-3">{e.available_seats}/{e.total_seats}</td>
                  <td className="p-3">
                    <button onClick={() => remove(e.id)} className="text-red-500" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
