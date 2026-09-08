"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { User } from "@/lib/types";

export default function AdminOrganizersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get("/admin/users").then((res) => setUsers(res.data.data));
  }, []);

  const organizers = users.filter((u) => u.role === "ORGANIZER");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Organizers</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {organizers.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-muted-foreground">
                  No organizers found.
                </td>
              </tr>
            ) : (
              organizers.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{new Date(u.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
