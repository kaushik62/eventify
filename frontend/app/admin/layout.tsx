import { AdminSidebar } from "@/components/AdminSidebar";
import { RouteGuard } from "@/components/RouteGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard role="ADMIN">
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row">
          <AdminSidebar />
          <div className="flex-1 p-4 sm:p-8 min-w-0">{children}</div>
        </div>
      </div>
    </RouteGuard>
  );
}
