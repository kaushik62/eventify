"use client";

import { useEffect, useState } from "react";
import { Building2, Search, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminOrganizersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const organizers = users.filter((u) => u.role === "ORGANIZER");

  const filteredOrganizers = organizers.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const getInitials = (name: string) => {
    if (!name) return "O";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Organizer Accounts Directory
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Audit verified event organizers, credentials, and listing permissions.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-white px-3 py-1.5 shadow-subtle">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Total Organizers:{" "}
          </span>
          <span className="text-xs font-bold text-slate-900">
            {loading ? "—" : organizers.length} creators
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border p-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Organizer Partners</h2>
            <p className="text-xs text-muted-foreground">
              Showing {filteredOrganizers.length} of {organizers.length} registered event organizers
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search organizer name or email..."
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-2 text-xs text-muted-foreground">Loading organizers...</p>
          </div>
        ) : filteredOrganizers.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No matching organizers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Organizer / Brand</th>
                  <th>Contact Email</th>
                  <th>Platform Role</th>
                  <th>Joined Date</th>
                  <th>Verification</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrganizers.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-700">
                          {getInitials(o.name)}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {o.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600">{o.email}</span>
                    </td>
                    <td>
                      <Badge variant="default">ORGANIZER</Badge>
                    </td>
                    <td>
                      <span className="text-xs text-slate-500">
                        {new Date(o.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
