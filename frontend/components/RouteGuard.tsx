"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  XCircle,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Building2,
  Calendar,
  Send,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function RouteGuard({
  role,
  children,
}: {
  role: "ADMIN" | "ORGANIZER";
  children: React.ReactNode;
}) {
  const { user, loading, refreshUser, applyForOrganizer } = useAuth();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [showReapply, setShowReapply] = useState(false);
  const [reapplyOrgName, setReapplyOrgName] = useState("");
  const [reapplyBio, setReapplyBio] = useState("");
  const [reapplySubmitting, setReapplySubmitting] = useState(false);
  const [reapplyMessage, setReapplyMessage] = useState("");

  useEffect(() => {
    if (!loading && (!user || (role === "ADMIN" && user.role !== "ADMIN"))) {
      router.replace(user ? "/dashboard" : "/login");
    }
  }, [loading, role, router, user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUser();
    } finally {
      setRefreshing(false);
    }
  };

  const handleReapply = async (e: React.FormEvent) => {
    e.preventDefault();
    setReapplySubmitting(true);
    setReapplyMessage("");
    try {
      await applyForOrganizer(reapplyOrgName, reapplyBio);
      setShowReapply(false);
      await refreshUser();
    } catch (err: any) {
      setReapplyMessage(
        err?.response?.data?.message || "Failed to submit application. Please try again."
      );
    } finally {
      setReapplySubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="grid min-h-[50vh] place-items-center px-6 text-center">
        <div>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <p className="mt-4 text-xs text-muted-foreground">Verifying account privileges...</p>
        </div>
      </div>
    );
  }

  // Admin access check
  if (role === "ADMIN" && user.role !== "ADMIN") {
    return (
      <div className="grid min-h-[50vh] place-items-center px-6 text-center">
        <div className="max-w-md rounded-xl border border-border bg-white p-8 shadow-card">
          <ShieldAlert className="mx-auto h-10 w-10 text-amber-500" />
          <h2 className="mt-4 text-lg font-bold text-slate-900">Access Denied</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Administrative permissions are required to access this portal.
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button size="sm">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Organizer access check
  if (role === "ORGANIZER") {
    // If user is super admin, permit access directly
    if (user.role === "ADMIN") {
      return <>{children}</>;
    }

    // Pending status state
    if (user.organizer_status === "PENDING") {
      return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-xl rounded-2xl border border-amber-200/80 bg-white p-6 sm:p-10 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-subtle">
                <Clock className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Application Under Review
                  </h1>
                  <Badge variant="warning">PENDING APPROVAL</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your organizer credentials have been submitted for verification.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-700">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-muted-foreground">Applicant Name</span>
                <span className="font-semibold text-slate-900">{user.name}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-muted-foreground">Account Email</span>
                <span className="font-semibold text-slate-900">{user.email}</span>
              </div>
              {user.organization_name && (
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-muted-foreground">Organization / Brand</span>
                  <span className="font-semibold text-slate-900">{user.organization_name}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">Application Date</span>
                <span className="font-semibold text-slate-900">
                  {user.organizer_applied_at
                    ? new Date(user.organizer_applied_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Recently submitted"}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50/50 p-3.5 text-xs text-blue-900 leading-relaxed">
              <p className="font-semibold text-blue-950 mb-1">What happens next?</p>
              Platform administrators review ticket inventory and organizer compliance. You will gain
              immediate access to event creation, ticket publishing, and attendee analytics upon approval.
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
            

              <Button
                variant="default"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full sm:w-auto text-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Checking..." : "Recheck Status"}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Rejected status state
    if (user.organizer_status === "REJECTED") {
      return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-6 sm:p-10 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200 shadow-subtle">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Application Not Approved
                  </h1>
                  <Badge variant="destructive">REJECTED</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your organizer application was not approved by platform administrators.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-red-100 bg-red-50/60 p-4 text-xs text-red-900">
              <p className="font-bold uppercase tracking-wider text-[10px] text-red-700">
                Reason Provided by Admin:
              </p>
              <p className="mt-1 text-slate-800">
                {user.organizer_rejection_reason ||
                  "Application did not meet our verification requirements or event hosting policies."}
              </p>
            </div>

            {showReapply ? (
              <form onSubmit={handleReapply} className="mt-6 space-y-4 border-t border-border pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Resubmit Application with Updated Details
                </h3>

                {reapplyMessage && (
                  <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
                    {reapplyMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1">
                    Organization / Brand Name
                  </label>
                  <Input
                    value={reapplyOrgName}
                    onChange={(e) => setReapplyOrgName(e.target.value)}
                    placeholder="e.g. Metro Live Events"
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1">
                    Updated Experience & Event Plans
                  </label>
                  <Textarea
                    value={reapplyBio}
                    onChange={(e) => setReapplyBio(e.target.value)}
                    placeholder="Describe your event portfolio, venue partnerships, or upcoming events..."
                    required
                    rows={3}
                    className="text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReapply(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={reapplySubmitting}
                    className="text-xs"
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    {reapplySubmitting ? "Submitting..." : "Resubmit Application"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Return to Dashboard
                  </Button>
                </Link>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowReapply(true)}
                  className="w-full sm:w-auto text-xs"
                >
                  Resubmit Application
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // If status is not approved (e.g. attendee who hasn't applied)
    if (user.organizer_status !== "APPROVED") {
      return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card text-center">
            <Building2 className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
              Organizer Account Required
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              You are currently logged in as an attendee. Apply to host events and access organizer
              management tools.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/organizer/apply">
                <Button size="sm">Apply to Become an Organizer</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
