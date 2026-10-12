"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  LockKeyhole,
  Mail,
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
      router.push(user.role === "ORGANIZER" ? "/organizer" : "/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try a different email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-subtle">
              <Ticket className="h-5 w-5 rotate-[-12deg]" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Create your Eventify account
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Get started as an attendee or register to host events.
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-xl border border-border bg-white p-6 sm:p-8 shadow-card">
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-2">
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("USER")}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    role === "USER"
                      ? "border-primary bg-indigo-50/70 text-primary shadow-subtle font-semibold"
                      : "border-border bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <UsersRound className="h-4 w-4 mb-1" />
                  <span className="text-xs">Attend Events</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("ORGANIZER")}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    role === "ORGANIZER"
                      ? "border-primary bg-indigo-50/70 text-primary shadow-subtle font-semibold"
                      : "border-border bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <CalendarDays className="h-4 w-4 mb-1" />
                  <span className="text-xs">Host Events</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-900 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="name"
                  required
                  autoComplete="name"
                  placeholder="Kaushik Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-900 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-900 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full h-10 text-xs font-semibold mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-indigo-700"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}