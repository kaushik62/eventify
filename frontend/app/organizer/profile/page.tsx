"use client";

import { useAuth } from "@/lib/auth";
import {
  User,
  Mail,
  Shield,
  CalendarDays,
  Edit3,
  KeyRound,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Your organizer profile
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Profile card */}
      <div className="premium-panel overflow-hidden">
        {/* Cover gradient */}
        <div className="h-24 w-full gradient-brand opacity-60" />

        {/* Avatar + name */}
        <div className="relative px-7 pb-7 pt-0">
          <div className="-mt-10 mb-5 flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-primary/20 text-3xl font-black text-primary shadow-glass">
              {initials}
            </div>
            <div className="mb-1">
              <p className="text-lg font-bold">{user.name}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                <CheckCircle2 className="h-3 w-3" />
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="glass p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Full Name
                </p>
              </div>
              <p className="font-semibold">{user.name}</p>
            </div>

            {/* Email */}
            <div className="glass p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Mail className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email Address
                </p>
              </div>
              <p className="truncate font-semibold">{user.email}</p>
            </div>

            {/* Role */}
            <div className="glass p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <Shield className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Account Role
                </p>
              </div>
              <p className="font-semibold">
                {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
              </p>
            </div>

            {/* Member since */}
            <div className="glass p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Member Since
                </p>
              </div>
              <p className="font-semibold">{joinDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="glass p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Edit Profile</p>
              <p className="text-xs text-muted-foreground">Update your name or details</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full rounded-xl" disabled>
            Coming Soon
          </Button>
        </div>

        <div className="glass p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Change Password</p>
              <p className="text-xs text-muted-foreground">Update your account password</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full rounded-xl" disabled>
            Coming Soon
          </Button>
        </div>
      </div>

      {/* Quick nav */}
      <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Quick Links
        </p>
        <div className="space-y-1">
          {[
            { label: "My Events", href: "/organizer/events" },
            { label: "Create New Event", href: "/organizer/events/create" },
            { label: "View Bookings", href: "/organizer/bookings" },
            { label: "Contact Support", href: "/contact" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
            >
              {label}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}