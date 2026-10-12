"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarPlus,
  ListChecks,
  TicketPercent,
  UserCog,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/organizer", label: "Overview", icon: LayoutDashboard },
  { href: "/organizer/events", label: "My Events", icon: ListChecks },
  { href: "/organizer/events/create", label: "Create Event", icon: CalendarPlus },
  { href: "/organizer/bookings", label: "Attendee Bookings", icon: TicketPercent },
  { href: "/organizer/profile", label: "Organizer Profile", icon: UserCog },
];

export function OrganizerSidebar() {
  const pathname = usePathname();

  const isCurrentActive = (href: string) => {
    if (href === "/organizer") {
      return pathname === "/organizer";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-full shrink-0 border-b border-border bg-white p-4 sm:w-60 sm:min-h-[calc(100vh-4rem)] sm:border-b-0 sm:border-r sm:p-5">
      {/* Workspace Header */}
      <div className="mb-4 hidden sm:block border-b border-border pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <p className="mt-0.5 text-sm font-bold text-slate-900">
          Organizer Portal
        </p>
      </div>

      {/* Nav List */}
      <nav className="flex gap-1 overflow-x-auto sm:flex-col sm:overflow-visible">
        {links.map(({ href, label, icon: Icon }) => {
          const active = isCurrentActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-indigo-600" : "text-slate-400")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom shortcut on desktop */}
      <div className="mt-auto hidden pt-8 sm:block">
        <Link
          href="/organizer/events/create"
          className="flex items-center justify-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Event</span>
        </Link>

        <Link
          href="/events"
          className="mt-2 flex items-center justify-center gap-1 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-800"
        >
          <span>View Public Events</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}
