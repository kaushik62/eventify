"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OrganizerStatusPage() {
  const { user, refreshUser } = useAuth();
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await api.get("/organizers/me/status");
      setStatusData(res.data.data);
    } catch {
      setStatusData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    await fetchStatus();
  };

  const status = statusData?.organizer_status || user?.organizer_status;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-white p-6 sm:p-10 shadow-card">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Organizer Application Status
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Current accreditation state for your Eventify account.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-xs text-muted-foreground hover:text-slate-900"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            <p className="mt-3 text-xs text-muted-foreground">Checking application records...</p>
          </div>
        ) : status === "APPROVED" ? (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-xs text-emerald-950">Accredited Organizer Account</p>
                <p className="text-xs text-emerald-800">
                  Your organizer profile has been approved. You have full permissions to host events.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="success">APPROVED</Badge>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-muted-foreground">Brand / Organization</span>
                <span className="font-semibold text-slate-900">
                  {statusData?.organization_name || user?.organization_name || "Independent"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Decision Date</span>
                <span className="font-semibold text-slate-900">
                  {statusData?.organizer_decided_at
                    ? new Date(statusData.organizer_decided_at).toLocaleDateString("en-IN")
                    : "Verified"}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Link href="/organizer">
                <Button size="sm">
                  Go to Organizer Dashboard
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ) : status === "PENDING" ? (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
              <Clock className="h-6 w-6 text-amber-600 shrink-0 animate-pulse" />
              <div>
                <p className="font-bold text-xs text-amber-950">Verification in Progress</p>
                <p className="text-xs text-amber-800">
                  Your application is queued in the admin review dashboard.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="warning">PENDING REVIEW</Badge>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-muted-foreground">Brand / Organization</span>
                <span className="font-semibold text-slate-900">
                  {statusData?.organization_name || user?.organization_name || "—"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Submission Date</span>
                <span className="font-semibold text-slate-900">
                  {statusData?.organizer_applied_at
                    ? new Date(statusData.organizer_applied_at).toLocaleDateString("en-IN")
                    : "Recently"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Back to Attendee Dashboard
                </Button>
              </Link>
              <Button size="sm" onClick={handleRefresh} disabled={refreshing}>
                Recheck Status
              </Button>
            </div>
          </div>
        ) : status === "REJECTED" ? (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/70 p-4">
              <XCircle className="h-6 w-6 text-red-600 shrink-0" />
              <div>
                <p className="font-bold text-xs text-red-950">Application Not Approved</p>
                <p className="text-xs text-red-800">
                  Reason:{" "}
                  {statusData?.organizer_rejection_reason ||
                    "Application criteria could not be verified."}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/organizer/apply">
                <Button size="sm">Resubmit Application</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 py-6 text-center space-y-4">
            <Building2 className="mx-auto h-12 w-12 text-slate-300" />
            <p className="text-xs text-muted-foreground">
              You haven&apos;t submitted an organizer application yet.
            </p>
            <Link href="/organizer/apply">
              <Button size="sm">Apply Now</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
