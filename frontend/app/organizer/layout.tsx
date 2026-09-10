import { OrganizerSidebar } from "@/components/OrganizerSidebar";
import { RouteGuard } from "@/components/RouteGuard";

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard role="ORGANIZER">
    <div className="mx-auto flex max-w-[88rem] flex-col sm:flex-row">
      <OrganizerSidebar />
      <div className="flex-1 p-4 sm:p-8">{children}</div>
    </div>
  </RouteGuard>;
}
