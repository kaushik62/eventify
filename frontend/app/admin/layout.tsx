import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col sm:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-4 sm:p-8">{children}</div>
    </div>
  );
}
