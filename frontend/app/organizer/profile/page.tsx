"use client";

import { CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";

export default function OrganizerProfilePage() {
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Organizer dashboard
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Profile
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Manage and view your Eventify organizer account information.
          </p>
        </div>

        {/* Profile Hero */}
        <Card className="relative overflow-hidden border-border shadow-sm">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

          <CardContent className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-2xl font-bold text-primary ring-8 ring-primary/5">
                {getInitials(user?.name)}
              </div>

              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Organizer
                </div>

                <h2 className="mt-3 truncate text-2xl font-bold tracking-tight">
                  {user?.name || "User"}
                </h2>

                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {user?.email || "Email unavailable"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="overflow-hidden border-border shadow-sm">
          <div className="border-b border-border px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Account information
                </h2>

                <p className="text-xs text-muted-foreground">
                  Your basic organizer account details.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            <div className="grid sm:grid-cols-2">
              {/* Name */}
              <div className="border-b border-border p-6 sm:border-r">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Full name
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <p className="font-semibold">
                    {user?.name || "—"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="border-b border-border p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Email address
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <p className="break-all font-semibold">
                    {user?.email || "—"}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="p-6 sm:border-r">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Account role
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-600">
                    {user?.role || "—"}
                  </span>
                </div>
              </div>

              {/* Account Type */}
              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Account type
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <CalendarDays className="h-4 w-4" />
                  </div>

                  <p className="font-semibold">
                    Event Organizer
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organizer Note */}
        <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Your organizer account
              </h3>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Use your organizer dashboard to create events, manage your
                existing events, and track attendee bookings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}