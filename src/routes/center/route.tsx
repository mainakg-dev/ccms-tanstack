import DashboardSidebar from "#/components/DashboardSidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/center")({
  beforeLoad: () => {},
  component: CenterLayout,
});

function CenterLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="CENTER" />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
