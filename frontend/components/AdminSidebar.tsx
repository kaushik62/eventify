"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, CalendarDays, TicketPercent, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users Directory", icon: Users },
  { href: "/admin/organizers", label: "Organizers", icon: Building2 },
  { href: "/admin/events", label: "Platform Events", icon: CalendarDays },
  { href: "/admin/bookings", label: "All Bookings", icon: TicketPercent },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isCurrentActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-full shrink-0 border-b border-border bg-white p-4 sm:w-60 sm:min-h-[calc(100vh-4rem)] sm:border-b-0 sm:border-r sm:p-5">
      {/* Workspace Header */}
      <div className="mb-4 hidden sm:block border-b border-border pb-4">
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Administration
          </p>
        </div>
        <p className="mt-0.5 text-sm font-bold text-slate-900">
          Super Admin Console
        </p>
      </div>

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
    </aside>
  );
}
