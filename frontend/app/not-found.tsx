import Link from "next/link";
import { CalendarDays, Home, ArrowLeft, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="page-surface relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-accent/8 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]" />
      </div>

      {/* Floating icons */}
      <div className="float-gently pointer-events-none absolute left-[12%] top-[20%] hidden opacity-20 lg:block">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-sm">
          <CalendarDays className="h-6 w-6 text-primary" />
        </div>
      </div>
      <div className="float-gently-reverse pointer-events-none absolute right-[12%] top-[25%] hidden opacity-20 lg:block">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-sm">
          <Search className="h-6 w-6 text-accent" />
        </div>
      </div>
      <div className="float-gently pointer-events-none absolute bottom-[25%] left-[15%] hidden opacity-15 lg:block">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-sm">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Error code */}
        <div className="relative inline-block">
          <p className="text-[9rem] font-black leading-none tracking-[-0.06em] text-foreground/5 sm:text-[12rem]">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[6rem] font-black leading-none tracking-[-0.06em] gradient-text sm:text-[8rem]">
              404
            </span>
          </div>
        </div>

        {/* Badge */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Page not found
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Oops! This page doesn&apos;t exist
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
          The page you&apos;re looking for may have been moved, deleted, or never existed.
          Let&apos;s get you back to something great.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/">
            <Button size="lg" className="h-12 w-full gap-2 rounded-xl px-7 sm:w-auto">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/events">
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full gap-2 rounded-xl px-7 sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse Events
            </Button>
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 border-t border-white/[0.07] pt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Popular pages
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Explore Events", href: "/events" },
              { label: "About Eventify", href: "/about" },
              { label: "FAQ & Help", href: "/faq" },
              { label: "Contact Us", href: "/contact" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
