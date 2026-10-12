"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Eye,
} from "lucide-react";
import api from "@/lib/api";
import { OrganizerListItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState<OrganizerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Action modals
  const [confirmApprove, setConfirmApprove] = useState<OrganizerListItem | null>(null);
  const [confirmReject, setConfirmReject] = useState<OrganizerListItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchOrganizers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/organizers", {
        params: {
          status: statusFilter,
          search: debouncedSearch,
          page,
          limit: 10,
        },
      });
      const data = res.data.data;
      setOrganizers(data.organizers || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error("Failed to load organizers", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, page]);

  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  const handleApprove = async () => {
    if (!confirmApprove) return;
    setActionLoading(true);
    try {
      await api.patch(`/admin/organizers/${confirmApprove.id}/approve`);
      setToastMessage({
        type: "success",
        text: `Organizer "${confirmApprove.name}" has been approved.`,
      });
      setConfirmApprove(null);
      await fetchOrganizers();
    } catch (err: any) {
      setToastMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to approve organizer.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirmReject) return;
    setActionLoading(true);
    try {
      await api.patch(`/admin/organizers/${confirmReject.id}/reject`, {
        reason: rejectionReason || "Application did not meet requirements.",
      });
      setToastMessage({
        type: "success",
        text: `Organizer "${confirmReject.name}" application has been rejected.`,
      });
      setConfirmReject(null);
      setRejectionReason("");
      await fetchOrganizers();
    } catch (err: any) {
      setToastMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to reject organizer.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "O";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="success">APPROVED</Badge>;
      case "PENDING":
        return <Badge variant="warning">PENDING</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">REJECTED</Badge>;
      default:
        return <Badge variant="secondary">{status || "APPLICANT"}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`rounded-xl border p-4 text-xs font-medium flex items-center justify-between ${
            toastMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Organizer Management & Verification
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Review applicant credentials, approve or reject event organizers, and audit ticket revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-border bg-white px-3 py-1.5 shadow-subtle">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Total Found:{" "}
            </span>
            <span className="text-xs font-bold text-slate-900">
              {loading ? "—" : totalCount} creators
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-slate-100/60 p-1">
          {[
            { id: "ALL", label: "All Organizers" },
            { id: "PENDING", label: "Pending Approval" },
            { id: "APPROVED", label: "Approved" },
            { id: "REJECTED", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? "bg-white text-slate-900 shadow-subtle"
                  : "text-muted-foreground hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or brand..."
            className="pl-8 h-9 text-xs bg-white"
          />
        </div>
      </div>

      {/* Organizers Table Container */}
      <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-xs text-muted-foreground">Fetching organizer directory...</p>
          </div>
        ) : organizers.length === 0 ? (
          <div className="p-16 text-center">
            <Building2 className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">No organizers found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {statusFilter !== "ALL"
                ? `No creators with "${statusFilter}" status matching your search.`
                : "No organizers matching the query."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Organizer / Brand</th>
                  <th>Contact Info</th>
                  <th>Status</th>
                  <th>Events</th>
                  <th>Revenue (Gross / Net)</th>
                  <th>Applied / Decision Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizers.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-700">
                          {getInitials(o.name)}
                        </span>
                        <div>
                          <Link
                            href={`/admin/organizers/${o.id}`}
                            className="font-semibold text-slate-900 hover:text-primary transition-colors flex items-center gap-1 group"
                          >
                            <span>{o.name}</span>
                            <ExternalLink className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <p className="text-[11px] text-muted-foreground">
                            {o.organization_name || "Individual Creator"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600 block">{o.email}</span>
                    </td>
                    <td>{renderStatusBadge(o.organizer_status)}</td>
                    <td>
                      <span className="text-xs font-semibold text-slate-900">
                        {o.total_events} {o.total_events === 1 ? "event" : "events"}
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        {o.total_bookings} bookings
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-bold text-slate-900 block">
                        {formatCurrency(o.gross_revenue)}
                      </span>
                      {o.total_refunds > 0 ? (
                        <span className="text-[10px] text-amber-700 font-medium block">
                          Net: {formatCurrency(o.net_revenue)} (-{formatCurrency(o.total_refunds)})
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 block">No refunds</span>
                      )}
                    </td>
                    <td>
                      <span className="text-xs text-slate-600 block">
                        {o.organizer_applied_at
                          ? new Date(o.organizer_applied_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : new Date(o.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                      </span>
                      {o.decided_by_name && (
                        <span className="text-[10px] text-muted-foreground block">
                          by {o.decided_by_name}
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/admin/organizers/${o.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900"
                            title="View organizer details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>

                        {o.organizer_status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setConfirmApprove(o)}
                              className="h-7 px-2.5 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                            >
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setConfirmReject(o);
                                setRejectionReason("");
                              }}
                              className="h-7 px-2.5 text-xs text-red-700 border-red-300 hover:bg-red-50 hover:text-red-800"
                            >
                              <X className="h-3.5 w-3.5 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}

                        {o.organizer_status === "APPROVED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setConfirmReject(o);
                              setRejectionReason("");
                            }}
                            className="h-7 px-2 text-[11px] text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Revoke
                          </Button>
                        )}

                        {o.organizer_status === "REJECTED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmApprove(o)}
                            className="h-7 px-2 text-[11px] text-emerald-700 hover:bg-emerald-50"
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-border p-4">
          <span className="text-xs text-muted-foreground">
            Showing page {page} of {totalPages} ({totalCount} total organizers)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 text-xs"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal: Approve Organizer */}
      {confirmApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Approve Organizer Account</h3>
                <p className="text-xs text-muted-foreground">{confirmApprove.name}</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              Are you sure you want to approve this organizer? Upon approval, they will gain full access
              to create events, sell tickets, and configure payouts.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={actionLoading}
                onClick={() => setConfirmApprove(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={actionLoading}
                onClick={handleApprove}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {actionLoading ? "Approving..." : "Confirm Approval"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Reject Organizer */}
      {confirmReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {confirmReject.organizer_status === "APPROVED"
                    ? "Revoke Organizer Approval"
                    : "Reject Organizer Application"}
                </h3>
                <p className="text-xs text-muted-foreground">{confirmReject.name}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              This action will block the user from publishing and managing events. Please provide a reason
              so the organizer understands what needs adjustment.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Rejection / Revocation Reason
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Identity verification could not be confirmed, or missing event portfolio..."
                rows={3}
                className="text-xs"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={actionLoading}
                onClick={() => setConfirmReject(null)}
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
                {actionLoading ? "Saving..." : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
