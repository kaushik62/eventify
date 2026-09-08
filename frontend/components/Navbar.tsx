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
    <header className="sticky top-0 z-40 w-full border-b border-white/70 bg-[#fffdf8]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-white shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:rotate-6">
            <CalendarDays className="h-4 w-4" />
          </span>
          Event<span className="text-violet-700">ify</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/events" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            Explore
          </Link>
          {user ? (
            <>
              <Link href={dashboardLink} className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
                Dashboard
              </Link>
              <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">Hi, {user.name.split(" ")[0]}</span>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
                Login
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <button className="rounded-lg p-2 transition-colors hover:bg-slate-100 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-700">
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
