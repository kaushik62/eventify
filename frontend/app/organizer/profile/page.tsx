"use client";

import { useAuth } from "@/lib/auth";
import {
  User,
  Mail,
  Shield,
  CalendarDays,
  KeyRound,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function OrganizerProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const joinDate = new Date(user.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Organizer Account Settings
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          View your organizer identity, verification status, and credentials.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
        {/* Cover Strip */}
        <div className="h-20 w-full bg-slate-100 border-b border-border" />

        <div className="px-6 pb-6 pt-0">
          <div className="-mt-8 mb-4 flex items-end gap-3.5">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-white bg-indigo-50 text-xl font-black text-indigo-700 shadow-subtle">
              {initials}
            </div>
            <div className="mb-1">
              <h2 className="text-base font-bold text-slate-900">{user.name}</h2>
              <div className="mt-0.5">
                <Badge variant="default">{user.role} Verified</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            <div className="rounded-lg border border-border bg-slate-50/60 p-3.5">
              <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Account Name
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-1">
                {user.name}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-slate-50/60 p-3.5">
              <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Email Address
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-1 truncate">
                {user.email}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-slate-50/60 p-3.5">
              <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Role & Permissions
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-1">
                Event Organizer (Full Management)
              </p>
            </div>

            <div className="rounded-lg border border-border bg-slate-50/60 p-3.5">
              <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Joined Date
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-1">
                {joinDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-5 shadow-card">
          <div className="flex items-center gap-2.5 mb-2">
            <KeyRound className="h-4 w-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-900">Security Credentials</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Password was configured during account creation.
          </p>
          <Button variant="outline" size="sm" className="w-full text-xs" disabled>
            Password Protected
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-card">
          <h3 className="text-xs font-bold text-slate-900 mb-2">Workspace Shortcuts</h3>
          <div className="space-y-1.5 text-xs">
            <Link
              href="/organizer/events"
              className="flex items-center justify-between text-slate-600 hover:text-primary py-1"
            >
              <span>Manage My Events</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/organizer/bookings"
              className="flex items-center justify-between text-slate-600 hover:text-primary py-1"
            >
              <span>Attendee Bookings</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/events"
              className="flex items-center justify-between text-slate-600 hover:text-primary py-1"
            >
              <span>View Live Marketplace</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}