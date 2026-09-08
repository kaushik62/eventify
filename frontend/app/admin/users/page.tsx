"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Mail, ShieldCheck, Users } from "lucide-react";
import api from "@/lib/api";
import { User } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const regularUsers = users.filter((u) => u.role === "USER");

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">
              Admin dashboard
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Users
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Manage registered users and monitor the Eventify community.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total users
            </p>

            <p className="mt-1 text-2xl font-bold">
              {loading ? "—" : regularUsers.length}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Regular users
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {loading
                    ? "—"
                    : regularUsers.length.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Platform accounts
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {loading
                    ? "—"
                    : users.length.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  User accounts
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {loading || users.length === 0
                    ? "—"
                    : `${Math.round(
                        (regularUsers.length / users.length) * 100
                      )}%`}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                All users
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                View users registered on the Eventify platform.
              </p>
            </div>

            {!loading && regularUsers.length > 0 && (
              <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {regularUsers.length}{" "}
                {regularUsers.length === 1 ? "user" : "users"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4 p-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : regularUsers.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold">
                No users found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Regular user accounts will appear here when people register
                on Eventify.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left">
                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        User
                      </th>

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Email
                      </th>

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Role
                      </th>

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Joined
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {regularUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {getInitials(user.name)}
                            </div>

                            <div>
                              <p className="font-semibold">
                                {user.name}
                              </p>

                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Customer account
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{user.email}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/20">
                            <Users className="h-3.5 w-3.5" />
                            USER
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                          {formatDate(user.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-border md:hidden">
                {regularUsers.map((user) => (
                  <div key={user.id} className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {getInitials(user.name)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">
                          {user.name}
                        </h3>

                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/40 p-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Joined
                        </p>

                        <p className="mt-1 font-medium">
                          {formatDate(user.created_at)}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/20">
                        <Users className="h-3.5 w-3.5" />
                        User
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}