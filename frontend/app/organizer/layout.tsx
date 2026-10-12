import { OrganizerSidebar } from "@/components/OrganizerSidebar";
import { RouteGuard } from "@/components/RouteGuard";

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard role="ORGANIZER">
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row">
          <OrganizerSidebar />
          <div className="flex-1 p-4 sm:p-8 min-w-0">{children}</div>
        </div>
      </div>
    </RouteGuard>
  );
}
