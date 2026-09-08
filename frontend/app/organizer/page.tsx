"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { OrganizerStats } from "@/lib/types";

export default function OrganizerDashboardPage() {
  const [stats, setStats] = useState<OrganizerStats | null>(null);

  useEffect(() => {
    api.get("/events/organizer/stats").then((res) => setStats(res.data.data));
  }, []);

  const cards = [
    { label: "Total Events", value: stats?.total_events ?? "—" },
    { label: "Total Bookings", value: stats?.total_bookings ?? "—" },
    { label: "Tickets Sold", value: stats?.tickets_sold ?? "—" },
    { label: "Revenue", value: stats ? `₹${Number(stats.revenue).toLocaleString("en-IN")}` : "—" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
        <Link href="/organizer/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="mt-1 text-2xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
