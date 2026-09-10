"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Sparkles,
  Ticket,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.role === "ADMIN") router.push("/admin");
      else if (user.role === "ORGANIZER") router.push("/organizer");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-surface relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">

        {/* Left: Brand section */}
        <section className="hidden lg:block">
          <div className="max-w-xl">

            {/* Brand badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Welcome to Eventify
            </div>

            {/* Heading */}
            <h1 className="mt-7 text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
              Your next
              <br />
              <span className="text-primary">experience</span>
              <br />
              starts here.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
              Discover amazing events, reserve your tickets, and keep
              everything you love in one place.
            </p>

            {/* Feature cards */}
            <div className="mt-10 space-y-3">
              <Feature
                icon={<CalendarDays className="h-5 w-5" />}
                title="Discover great events"
                description="Find experiences tailored to your interests."
              />

              <Feature
                icon={<Ticket className="h-5 w-5" />}
                title="Book in seconds"
                description="Simple and secure event booking."
              />

              <Feature
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Manage everything"
                description="Keep your bookings organized from one dashboard."
              />
            </div>
          </div>
        </section>

        {/* Right: Login */}
        <section className="mx-auto w-full max-w-md">
          <div className="glass-strong p-7 sm:p-9">

            {/* Mobile logo / heading */}
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:mx-0">
                <Ticket className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Sign in to continue to your Eventify account.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"
              >
                <p className="font-medium">Unable to sign in</p>
                <p className="mt-1 text-xs opacity-90">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl pl-10"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/25"
              >
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Security */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <LockKeyhole className="h-3.5 w-3.5" />
              Your account information is securely protected
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                New to Eventify?
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Register */}
            <Link href="/register" className="block">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-xl font-medium"
              >
                Create an account
              </Button>
            </Link>

            <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
              By continuing, you agree to use Eventify responsibly and
              securely.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass card-hover group flex items-center gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}