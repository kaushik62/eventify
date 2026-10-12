
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Ticket,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
  Compass,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathname = usePathname();

  const isUser = user?.role === "USER";
  const isOrganizer = user?.role === "ORGANIZER";
  const isAdmin = user?.role === "ADMIN";

  const dashboardLink = isAdmin
    ? "/admin"
    : isOrganizer
      ? "/organizer"
      : "/dashboard";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    setOpen(false);
    setDropdownOpen(false);
    logout();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "border-b border-border bg-white/95 shadow-subtle backdrop-blur-md"
          : "border-b border-border/80 bg-white"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-base font-bold tracking-tight text-foreground"
          >
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Eventify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 sm:flex">
            {/* Only logged-in USER accounts can see Explore Events */}
            {user && isUser && (
              <Link
                href="/events"
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive("/events")
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Compass className="h-4 w-4 text-slate-400" />
                Explore Events
              </Link>
            )}

            {/* Only USER accounts can see My Bookings */}
            {user && isUser && (
              <Link
                href="/dashboard"
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Ticket className="h-4 w-4 text-slate-400" />
                My Bookings
              </Link>
            )}
          </div>
        </div>

        {/* Desktop Account Controls */}
        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-slate-800 shadow-subtle transition-colors hover:bg-slate-50"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U"}
                </span>

                <span className="max-w-[120px] truncate text-xs font-semibold text-slate-800">
                  {user.name ? user.name.split(" ")[0] : "Account"}
                </span>

                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-dropdown animate-in fade-in zoom-in-95 duration-100">
                  {/* User Information */}
                  <div className="border-b border-border/80 px-3 py-2.5">
                    <p className="truncate text-xs font-semibold text-slate-900">
                      {user.name}
                    </p>

                    <p className="truncate text-[11px] text-muted-foreground">
                      {user.email}
                    </p>

                    <div className="mt-1.5">
                      <Badge
                        variant={
                          user.role === "ADMIN"
                            ? "destructive"
                            : user.role === "ORGANIZER"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="pt-1">
                    <Link
                      href={dashboardLink}
                      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      Dashboard
                    </Link>

                    {isUser && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Ticket className="h-4 w-4 text-slate-400" />
                        My Bookings
                      </Link>
                    )}

                    {isOrganizer && (
                      <Link
                        href="/organizer/profile"
                        className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        Profile Settings
                      </Link>
                    )}

                    <div className="my-1 border-t border-border/70" />

                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Sign in
              </Link>

              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-md border border-border p-2 text-slate-600 hover:bg-slate-50 sm:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      {open && (
        <div className="border-t border-border bg-white px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {/* Only logged-in USER accounts can see Explore Events */}
            {user && isUser && (
              <Link
                href="/events"
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  isActive("/events")
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "text-slate-600"
                }`}
                onClick={() => setOpen(false)}
              >
                Explore Events
              </Link>
            )}

            {user ? (
              <>
                <Link
                  href={dashboardLink}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-600"
                  onClick={() => setOpen(false)}
                >
                  Dashboard ({user.role})
                </Link>

                {isUser && (
                  <Link
                    href="/dashboard"
                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-600"
                    onClick={() => setOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}

                {isOrganizer && (
                  <Link
                    href="/organizer/profile"
                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-600"
                    onClick={() => setOpen(false)}
                  >
                    Profile Settings
                  </Link>
                )}

                <div className="my-2 border-t border-border" />

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out ({user.email})
                </button>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
                <Link
                  href="/login"
                  className="rounded-md border border-border py-2 text-center text-sm font-medium text-slate-700"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                >
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click Outside to Close Dropdown */}
      {dropdownOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setDropdownOpen(false)}
          aria-label="Close account menu"
        />
      )}
    </header>
  );
}
