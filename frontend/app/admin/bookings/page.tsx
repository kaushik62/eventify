"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface AdminBookingRow {
  id: number;
  user_name: string;
  event_name: string;
  tickets: number;
  total_amount: string | number;
  status: string;
  created_at: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);

  useEffect(() => {
    api.get("/admin/bookings").then((res) => setBookings(res.data.data));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Bookings</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Event</th>
              <th className="p-3">Tickets</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="p-3">{b.user_name}</td>
                  <td className="p-3">{b.event_name}</td>
                  <td className="p-3">{b.tickets}</td>
                  <td className="p-3">₹{Number(b.total_amount).toLocaleString("en-IN")}</td>
                  <td className="p-3">{b.status}</td>
                  <td className="p-3">{new Date(b.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
