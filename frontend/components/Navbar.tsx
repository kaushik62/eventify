"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  CalendarDays,
  Ticket,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { href: "/events", label: "Explore" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathname = usePathname();

  // Dashboard route based on user role
  const dashboardLink =
    user?.role === "ADMIN"
      ? "/admin/dashboard"
      : user?.role === "ORGANIZER"
        ? "/organizer"
        : "/dashboard";

  const isUser = user?.role === "USER";
  const isOrganizer = user?.role === "ORGANIZER";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close menus when the route changes
  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    setOpen(false);
    setDropdownOpen(false);
    logout();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "glass-nav shadow-[0_8px_32px_-12px_rgba(0,0,0,0.7)]"
          : "border-b border-white/[0.06] bg-[hsl(222_36%_5%/0.5)] backdrop-blur-xl"
      }`}
    >
      <nav className="mx-auto flex h-[4.75rem] max-w-[88rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 gradient-brand text-white shadow-lg shadow-black/30 transition-transform duration-300 group-hover:rotate-3">
            <CalendarDays className="h-4 w-4" />
          </span>
          Event<span className="text-primary">ify</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive(href)
                  ? "bg-white/[0.08] text-foreground"
                  : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {/* My Bookings: USER only */}
              {isUser && (
                <Link
                  href="/dashboard"
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith("/dashboard")
                      ? "bg-white/[0.08] text-foreground"
                      : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                  }`}
                >
                  My Bookings
                </Link>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-foreground transition-all hover:bg-white/[0.1]"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-xs font-bold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>

                  <span className="max-w-[120px] truncate">
                    {user.name.split(" ")[0]}
                  </span>

                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[hsl(220_28%_10%/0.98)] shadow-glass-xl backdrop-blur-2xl">
                    {/* User Info */}
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Signed in as
                      </p>

                      <p className="mt-0.5 truncate text-sm font-semibold">
                        {user.email}
                      </p>

                      <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {user.role}
                      </span>
                    </div>

                    <div className="p-1.5">
                      {/* Role-based Dashboard */}
                      <Link
                        href={dashboardLink}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>

                      {/* My Bookings: USER only */}
                      {isUser && (
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Ticket className="h-4 w-4" />
                          My Bookings
                        </Link>
                      )}

                      {/* Organizer Profile */}
                      {isOrganizer && (
                        <Link
                          href="/organizer/profile"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      )}

                      {/* Sign Out */}
                      <button
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-400/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-white/[0.05] hover:text-foreground"
              >
                Log in
              </Link>

              <Link href="/register">
                <Button size="sm" className="rounded-xl shadow-glow">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5 transition-colors hover:bg-white/[0.1] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-white/10 bg-[hsl(222_36%_5%/0.98)] px-4 py-4 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1">
            {/* Public Navigation */}
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-white/[0.08] text-foreground"
                    : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}

            <div className="my-2 border-t border-white/10" />

            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-sm font-bold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{user.name}</p>

                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* Role-based Dashboard */}
                <Link
                  href={dashboardLink}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                {/* My Bookings: USER only */}
                {isUser && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <Ticket className="h-4 w-4" />
                    My Bookings
                  </Link>
                )}

                {/* Organizer Profile */}
                {isOrganizer && (
                  <Link
                    href="/organizer/profile"
                    className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                )}

                {/* Sign Out */}
                <button
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-400/5"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>

                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button size="sm" className="mt-1 h-11 w-full rounded-xl">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setDropdownOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
