"use client";

import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";

export default function OrganizerProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div>
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="font-medium">{user?.role}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
