"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Ticket,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Mail,
  UserCheck,
  MapPin,
  Users,
} from "lucide-react";
import api from "@/lib/api";
import { OrganizerListItem, EventItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AdminOrganizerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const organizerId = params?.id;

  const [organizer, setOrganizer] = useState<OrganizerListItem | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchOrganizerData = useCallback(async () => {
    if (!organizerId) return;
    setLoading(true);
    try {
      const [detailsRes, eventsRes] = await Promise.all([
        api.get(`/admin/organizers/${organizerId}`),
        api.get(`/admin/organizers/${organizerId}/events`),
      ]);
      setOrganizer(detailsRes.data.data);
      setEvents(eventsRes.data.data || []);
    } catch (err: any) {
      console.error("Failed to load organizer", err);
      setFeedback({
        type: "error",
        text: err?.response?.data?.message || "Failed to load organizer details.",
      });
    } finally {
      setLoading(false);
    }
  }, [organizerId]);

  useEffect(() => {
    fetchOrganizerData();
  }, [fetchOrganizerData]);

  const handleApprove = async () => {
    if (!organizer) return;
    setActionLoading(true);
    try {
      await api.patch(`/admin/organizers/${organizer.id}/approve`);
      setFeedback({
        type: "success",
        text: `Organizer "${organizer.name}" has been approved successfully.`,
      });
      await fetchOrganizerData();
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err?.response?.data?.message || "Failed to approve organizer.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!organizer) return;
    setActionLoading(true);
    try {
      await api.patch(`/admin/organizers/${organizer.id}/reject`, {
        reason: rejectionReason || "Application did not meet compliance requirements.",
      });
      setFeedback({
        type: "success",
        text: `Organizer "${organizer.name}" has been rejected.`,
      });
      setShowRejectModal(false);
      setRejectionReason("");
      await fetchOrganizerData();
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err?.response?.data?.message || "Failed to reject organizer.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (val: number | string | undefined) => {
    return `₹${Number(val || 0).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-xs text-muted-foreground">Loading organizer audit dossier...</p>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="py-20 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
        <h2 className="mt-2 text-sm font-bold text-slate-900">Organizer Not Found</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          The requested creator record does not exist or was deleted.
        </p>
        <Link href="/admin/organizers" className="mt-4 inline-block">
          <Button size="sm">Back to Organizer List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link
            href="/admin/organizers"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-slate-900 mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Organizer Directory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {organizer.name}
            </h1>
            {organizer.organizer_status === "APPROVED" && <Badge variant="success">APPROVED</Badge>}
            {organizer.organizer_status === "PENDING" && <Badge variant="warning">PENDING APPROVAL</Badge>}
            {organizer.organizer_status === "REJECTED" && <Badge variant="destructive">REJECTED</Badge>}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {organizer.organization_name ? `${organizer.organization_name} • ` : ""}
            Registered on{" "}
            {new Date(organizer.created_at).toLocaleDateString("en-IN", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {organizer.organizer_status === "PENDING" && (
            <>
              <Button
                size="sm"
                onClick={handleApprove}
                disabled={actionLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Approve Application
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowRejectModal(true)}
                disabled={actionLoading}
                className="text-xs h-9"
              >
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Reject Application
              </Button>
            </>
          )}

          {organizer.organizer_status === "APPROVED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRejectModal(true)}
              disabled={actionLoading}
              className="text-xs h-9 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Revoke Approval
            </Button>
          )}

          {organizer.organizer_status === "REJECTED" && (
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={actionLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Re-approve Organizer
            </Button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`rounded-xl border p-4 text-xs font-medium flex items-center justify-between ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Financial Performance Summary Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="rounded-xl border border-border bg-white p-4 shadow-card">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Total Listings
          </span>
          <p className="mt-1 text-2xl font-black text-slate-900">{organizer.total_events}</p>
          <span className="text-[11px] text-muted-foreground">Created events</span>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-card">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Completed Orders
          </span>
          <p className="mt-1 text-2xl font-black text-slate-900">{organizer.total_bookings}</p>
          <span className="text-[11px] text-muted-foreground">Confirmed checkouts</span>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-card">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Tickets Sold
          </span>
          <p className="mt-1 text-2xl font-black text-slate-900">{organizer.tickets_sold}</p>
          <span className="text-[11px] text-muted-foreground">Total attendees</span>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-card lg:col-span-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Gross Revenue (GMV)
          </span>
          <p className="mt-1 text-2xl font-black text-slate-900">
            {formatCurrency(organizer.gross_revenue)}
          </p>
          <span className="text-[11px] text-muted-foreground">Total paid volume</span>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-card lg:col-span-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Refunds Settled
          </span>
          <p className="mt-1 text-2xl font-black text-amber-700">
            {formatCurrency(organizer.total_refunds)}
          </p>
          <span className="text-[11px] text-muted-foreground">Processed returns</span>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-card lg:col-span-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 block">
            Net Booking Revenue
          </span>
          <p className="mt-1 text-2xl font-black text-emerald-950">
            {formatCurrency(organizer.net_revenue)}
          </p>
          <span className="text-[11px] text-emerald-700">After refund deductions</span>
        </div>
      </div>

      {/* Organizer Dossier & Application Information */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 rounded-xl border border-border bg-white p-5 shadow-card space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-border pb-3">
            Profile & Accreditation Details
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground block">Legal Name</span>
              <span className="font-semibold text-slate-900">{organizer.name}</span>
            </div>

            <div>
              <span className="text-muted-foreground block">Email Address</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                <Mail className="h-3 w-3 text-slate-400" />
                {organizer.email}
              </span>
            </div>

            {organizer.organization_name && (
              <div>
                <span className="text-muted-foreground block">Brand / Company</span>
                <span className="font-semibold text-slate-900">{organizer.organization_name}</span>
              </div>
            )}

            <div>
              <span className="text-muted-foreground block">Application Timestamp</span>
              <span className="font-semibold text-slate-900">
                {organizer.organizer_applied_at
                  ? new Date(organizer.organizer_applied_at).toLocaleString("en-IN")
                  : "N/A"}
              </span>
            </div>

            {organizer.organizer_decided_at && (
              <div>
                <span className="text-muted-foreground block">Decision Logged At</span>
                <span className="font-semibold text-slate-900">
                  {new Date(organizer.organizer_decided_at).toLocaleString("en-IN")}
                </span>
                {organizer.decided_by_name && (
                  <span className="text-[11px] text-muted-foreground block">
                    Reviewed by: {organizer.decided_by_name} ({organizer.decided_by_email})
                  </span>
                )}
              </div>
            )}

            {organizer.organizer_rejection_reason && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-900">
                <span className="font-bold text-[10px] uppercase tracking-wider block text-red-700">
                  Logged Rejection Reason:
                </span>
                <span className="mt-1 block">{organizer.organizer_rejection_reason}</span>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl border border-border bg-white p-5 shadow-card space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-border pb-3">
            Organizer Biography & Experience Statement
          </h2>

          <div className="text-xs text-slate-700 leading-relaxed min-h-[100px]">
            {organizer.organizer_bio ? (
              <p className="whitespace-pre-wrap">{organizer.organizer_bio}</p>
            ) : (
              <p className="text-muted-foreground italic">
                No custom biography provided by applicant. Registered via organizer portal.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-600 flex items-center justify-between">
            <span className="text-muted-foreground">Platform Role Status:</span>
            <Badge variant="default">{organizer.role}</Badge>
          </div>
        </div>
      </div>

      {/* Associated Events Section */}
      <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Created Events Directory</h2>
            <p className="text-xs text-muted-foreground">
              {events.length} listings published by this creator
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            This organizer has not created any events yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Category</th>
                  <th>Date & Location</th>
                  <th>Ticket Price</th>
                  <th>Capacity & Availability</th>
                  <th>Bookings</th>
                  <th>Gross Revenue</th>
                  <th>Net Revenue</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <div className="font-semibold text-slate-900">{ev.name}</div>
                      <span className="text-[11px] text-muted-foreground">ID #{ev.id}</span>
                    </td>
                    <td>
                      <Badge variant="secondary">{ev.category}</Badge>
                    </td>
                    <td>
                      <span className="text-xs text-slate-800 block">
                        {new Date(ev.event_date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-[11px] text-muted-foreground block truncate max-w-xs">
                        {ev.location}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-semibold text-slate-900">
                        ₹{Number(ev.price).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-800 block">
                        {ev.available_seats} / {ev.total_seats} seats left
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-semibold text-slate-900 block">
                        {ev.confirmed_bookings || 0} orders
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        {ev.tickets_sold || 0} tickets sold
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-bold text-slate-900 block">
                        {formatCurrency(ev.gross_revenue)}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-bold text-emerald-700 block">
                        {formatCurrency(ev.net_revenue)}
                      </span>
                      {Number(ev.total_refunds || 0) > 0 && (
                        <span className="text-[10px] text-red-600 block">
                          -{formatCurrency(ev.total_refunds)} refund
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      <Link href={`/events/${ev.id}`} target="_blank">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          View Listing
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {organizer.organizer_status === "APPROVED"
                    ? "Revoke Organizer Approval"
                    : "Reject Organizer Application"}
                </h3>
                <p className="text-xs text-muted-foreground">{organizer.name}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              State the reason for rejecting or revoking approval for this creator. This reason will be
              visible on their status dashboard.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Reason / Compliance Notes
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Non-compliant event materials, duplicate account, or failed verification..."
                rows={3}
                className="text-xs"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={actionLoading}
                onClick={() => setShowRejectModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={actionLoading}
                onClick={handleReject}
                className="text-xs"
              >
                {actionLoading ? "Processing..." : "Confirm Action"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
