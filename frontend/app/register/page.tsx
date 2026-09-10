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
  UserRound,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ORGANIZER">("USER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await register(name, email, password, role);

      router.push(
        user.role === "ORGANIZER" ? "/organizer" : "/dashboard"
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-surface relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">

        {/* Left side */}
        <section className="hidden lg:block">
          <div className="max-w-xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Join Eventify
            </div>

            {/* Heading */}
            <h1 className="mt-7 text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
              Discover.
              <br />
              Connect.
              <br />
              <span className="text-primary">Experience.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
              Create your Eventify account and start discovering
              experiences or bring your own events to life.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-3">
              <Feature
                icon={<CalendarDays className="h-5 w-5" />}
                title="Discover experiences"
                description="Explore concerts, conferences, sports and more."
              />

              <Feature
                icon={<Ticket className="h-5 w-5" />}
                title="Book with confidence"
                description="Securely reserve tickets for your favorite events."
              />

              <Feature
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Everything in one place"
                description="Manage your bookings from a simple dashboard."
              />
            </div>
          </div>
        </section>

        {/* Register card */}
        <section className="mx-auto w-full max-w-md">
          <div className="glass-strong p-7 sm:p-9">

            {/* Header */}
            <div className="mb-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Ticket className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Join Eventify and start your next experience.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"
              >
                <p className="font-medium">
                  Unable to create account
                </p>

                <p className="mt-1 text-xs opacity-90">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="name"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl pl-10"
                  />
                </div>
              </div>

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
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl pl-10"
                  />
                </div>

                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Use at least 6 characters for your password.
                </p>
              </div>

              {/* Role selection */}
              <div>
                <div className="mb-2">
                  <p className="text-sm font-semibold">
                    How will you use Eventify?
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Choose the experience that fits you best.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">

                  {/* User */}
                  <RoleCard
                    selected={role === "USER"}
                    icon={<UsersRound className="h-5 w-5" />}
                    title="Attend events"
                    description="Book tickets"
                    onClick={() => setRole("USER")}
                  />

                  {/* Organizer */}
                  <RoleCard
                    selected={role === "ORGANIZER"}
                    icon={<CalendarDays className="h-5 w-5" />}
                    title="Organize events"
                    description="Create events"
                    onClick={() => setRole("ORGANIZER")}
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Security */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <LockKeyhole className="h-3.5 w-3.5" />
              Your information is securely protected
            </div>

            {/* Login */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />

              <span className="text-xs text-muted-foreground">
                Already a member?
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            <Link href="/login" className="block">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-xl font-medium"
              >
                Log in to Eventify
              </Button>
            </Link>

            <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
              By creating an account, you agree to use Eventify
              responsibly and securely.
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

function RoleCard({
  selected,
  icon,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative rounded-2xl border p-4 text-left transition-all duration-200 ${
        selected
          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
          : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
      }`}
    >
      {selected && (
        <div className="absolute right-3 top-3">
          <CheckCircle2 className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          selected
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>

      <p className="mt-3 text-sm font-semibold">{title}</p>

      <p className="mt-1 text-[11px] text-muted-foreground">
        {description}
      </p>
    </button>
  );
}