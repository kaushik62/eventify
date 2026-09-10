import Link from "next/link";
import {
  CalendarDays,
  ArrowUpRight,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const platformLinks = [
  { label: "Explore Events", href: "/events" },
  { label: "About Us", href: "/about" },
  { label: "FAQ & Help", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

const accountLinks = [
  { label: "Sign In", href: "/login" },
  { label: "Create Account", href: "/register" },
  { label: "My Bookings", href: "/dashboard" },
  { label: "Organizer Dashboard", href: "/organizer" },
];

const socialLinks = [
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "LinkedIn", href: "#", icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.07] bg-[hsl(222_36%_5%/0.9)] backdrop-blur-xl">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">

        {/* Main footer grid */}
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-16">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 gradient-brand text-white transition-transform duration-300 group-hover:rotate-3">
                <CalendarDays className="h-4 w-4" />
              </span>
              <p className="text-lg font-bold text-foreground">
                Event<span className="text-primary">ify</span>
              </p>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Discover, book, and experience unforgettable events. Your premium
              event discovery and booking platform.
            </p>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Platform
            </p>
            <ul className="mt-4 space-y-3">
              {platformLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Account
            </p>
            <ul className="mt-4 space-y-3">
              {accountLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / CTA */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Contact
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05]">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                </div>
                support@eventify.com
              </div>

              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05]">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                +91 98765 43210
              </div>

              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05]">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                Mumbai, Maharashtra, India
              </div>
            </div>

            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/15 hover:border-primary/45 hover:shadow-glow"
            >
              Explore events
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] py-7 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Eventify. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground/70">
            <Link href="/faq" className="transition-colors hover:text-muted-foreground">
              Privacy Policy
            </Link>
            <Link href="/faq" className="transition-colors hover:text-muted-foreground">
              Terms of Service
            </Link>
            <span>Crafted with ♥ for event lovers</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
