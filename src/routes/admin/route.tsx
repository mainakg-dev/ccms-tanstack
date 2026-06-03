import { createFileRoute, Outlet } from "@tanstack/react-router";
import DashboardSidebar from "../../components/DashboardSidebar";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {},
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="ADMIN" />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
