"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { AdminStats } from "@/lib/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data.data));
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers },
    { label: "Total Organizers", value: stats?.totalOrganizers },
    { label: "Total Events", value: stats?.totalEvents },
    { label: "Total Bookings", value: stats?.totalBookings },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="mt-1 text-2xl font-bold">{c.value?.toLocaleString("en-IN") ?? "—"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardContent className="pt-5">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-1 text-3xl font-bold">
            {stats ? `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}` : "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
