"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const dashboardLink =
    user?.role === "ADMIN" ? "/admin" : user?.role === "ORGANIZER" ? "/organizer" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/75 shadow-[0_8px_30px_-25px_rgba(24,44,53,0.45)] backdrop-blur-2xl">
      <nav className="mx-auto flex h-[4.75rem] max-w-[88rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
          <span className="grid h-10 w-10 place-items-center rounded-xl gradient-brand text-white shadow-lg shadow-[#182c35]/20 transition-transform duration-300 group-hover:rotate-6">
            <CalendarDays className="h-4 w-4" />
          </span>
          Event<span className="text-primary">ify</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/events" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Explore
          </Link>
          {user ? (
            <>
              <Link href={dashboardLink} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Dashboard
              </Link>
              <span className="rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background shadow-sm">Hi, {user.name.split(" ")[0]}</span>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Login
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <button className="rounded-lg p-2 transition-colors hover:bg-muted md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/70 bg-background/95 px-4 py-5 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-foreground">
            <Link href="/events" onClick={() => setOpen(false)}>Explore</Link>
            {user ? (
              <>
                <Link href={dashboardLink} onClick={() => setOpen(false)}>Dashboard</Link>
                <button className="text-left" onClick={() => { logout(); setOpen(false); }}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/register" onClick={() => setOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
