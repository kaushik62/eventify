"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { EventItem } from "@/lib/types";

interface BookingRow {
  id: number;
  user_name: string;
  user_email: string;
  tickets: number;
  total_amount: string | number;
  status: string;
}

export default function OrganizerBookingsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);

  useEffect(() => {
    api.get("/events/organizer/my-events").then((res) => setEvents(res.data.data));
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      api.get(`/events/${selectedEvent}/bookings`).then((res) => setBookings(res.data.data));
    }
  }, [selectedEvent]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Bookings</h1>

      <select
        onChange={(e) => setSelectedEvent(Number(e.target.value) || null)}
        className="h-11 w-full max-w-sm rounded-lg border border-border bg-background px-3 text-sm"
        defaultValue=""
      >
        <option value="">Select an event</option>
        {events.map((e) => (
          <option key={e.id} value={e.id}>{e.name}</option>
        ))}
      </select>

      {selectedEvent && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="p-3">Attendee</th>
                <th className="p-3">Email</th>
                <th className="p-3">Tickets</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No bookings yet for this event.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="border-t border-border">
                    <td className="p-3">{b.user_name}</td>
                    <td className="p-3">{b.user_email}</td>
                    <td className="p-3">{b.tickets}</td>
                    <td className="p-3">₹{Number(b.total_amount).toLocaleString("en-IN")}</td>
                    <td className="p-3">{b.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
