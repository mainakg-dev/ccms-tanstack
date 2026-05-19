import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import DashboardSidebar from '../../components/DashboardSidebar';

export const Route = createFileRoute('/center')({
  beforeLoad: () => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('auth-storage');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.state?.user?.role !== 'CENTER') {
            throw redirect({ to: '/login' });
          }
        } catch {
          throw redirect({ to: '/login' });
        }
      } else {
        throw redirect({ to: '/login' });
      }
    }
  },
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
