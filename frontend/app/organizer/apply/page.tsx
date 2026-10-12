"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowRight, ShieldCheck, CheckCircle2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";

export default function OrganizerApplyPage() {
  const { user, applyForOrganizer } = useAuth();
  const router = useRouter();

  const [organizationName, setOrganizationName] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await applyForOrganizer(organizationName, bio);
      setSubmitted(true);
      setTimeout(() => {
        router.push("/organizer");
      }, 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to submit application. Please check your inputs and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-10 shadow-card">
          {submitted ? (
            <div className="text-center py-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-subtle">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                Application Received!
              </h1>
              <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
                Your organizer application has been registered with pending status. Our administration
                team will review your profile shortly.
              </p>
              <div className="mt-6">
                <Link href="/organizer">
                  <Button size="sm">Go to Organizer Status</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-border pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Apply for Organizer Access
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Host conferences, workshops, and concerts on Eventify.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Organization / Brand Name
                  </label>
                  <Input
                    required
                    placeholder="e.g. Apex Music Festivals or Innovate Tech"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Organizer Background & Experience
                  </label>
                  <Textarea
                    required
                    minLength={10}
                    rows={4}
                    placeholder="Tell us about the events you plan to host, expected audience sizes, and past experience..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="text-xs"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Brief explanation helping our compliance team review your account (minimum 10 characters).
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      All organizer accounts undergo administrative verification to prevent fraudulent
                      listings.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Ticket className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      Once approved, you will have instant access to ticket tier management, Razorpay settlements,
                      and attendee check-in.
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <Link href="/dashboard">
                    <Button type="button" variant="outline" size="sm" className="text-xs">
                      Cancel
                    </Button>
                  </Link>

                  <Button type="submit" size="sm" disabled={submitting} className="text-xs">
                    {submitting ? "Submitting Application..." : "Submit Application"}
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
