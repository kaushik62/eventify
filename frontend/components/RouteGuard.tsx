"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export function RouteGuard({
  role,
  children,
}: {
  role: "ADMIN" | "ORGANIZER";
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== role)) {
      router.replace(user ? "/dashboard" : "/login");
    }
  }, [loading, role, router, user]);

  if (loading || !user || user.role !== role) {
    return (
      <div className="grid min-h-[50vh] place-items-center px-6 text-center">
        <div>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Checking your access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
