import Link from "next/link";
import {
  Ticket,
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
  { label: "Organizer Workspace", href: "/organizer" },
];

const socialLinks = [
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "LinkedIn", href: "#", icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white text-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
          
              <span className="text-base font-bold tracking-tight text-slate-900">
                Eventify
              </span>
            </Link>

            <p className="mt-3.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Production-grade event discovery, ticketing, and management platform for attendees and organizers worldwide.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Platform
            </p>
            <ul className="mt-3 space-y-2.5">
              {platformLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-xs text-slate-600 transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Account
            </p>
            <ul className="mt-3 space-y-2.5">
              {accountLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-xs text-slate-600 transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Support
            </p>
            <div className="mt-3 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>support@eventify.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>Mumbai, India</span>
              </div>
            </div>

            <Link
              href="/events"
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Browse all events
              <ArrowUpRight className="h-3 w-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 sm:flex-row text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Eventify Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/faq" className="hover:text-slate-800 transition-colors">
              Terms of Service
            </Link>
            <span>Payments powered by Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
