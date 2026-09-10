"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarPlus, ListChecks, TicketPercent, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/organizer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/organizer/events", label: "My Events", icon: ListChecks },
  { href: "/organizer/events/create", label: "Create Event", icon: CalendarPlus },
  { href: "/organizer/bookings", label: "Bookings", icon: TicketPercent },
  { href: "/organizer/profile", label: "Profile", icon: UserCog },
];

export function OrganizerSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full shrink-0 border-b border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl sm:w-64 sm:border-b-0 sm:border-r sm:p-5">
      <nav className="flex gap-2 overflow-x-auto sm:flex-col sm:gap-1 sm:overflow-visible">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/7 hover:text-foreground",
              pathname === href && "bg-primary text-primary-foreground shadow-[0_8px_18px_-10px_hsl(var(--primary)/0.9)]"
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
