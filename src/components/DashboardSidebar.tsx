import { Link, useLocation } from '@tanstack/react-router';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  FileText,
  ClipboardList,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '#/lib/utils.ts';
import { Button } from '#/components/ui/button.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/components/ui/tooltip.tsx';
import { useAuthStore } from '#/store/useAuthStore.ts';
import { useLogout } from '#/features/admin/api/index.ts';

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Enrollments', to: '/admin/enrollments', icon: Users },
  { label: 'Courses', to: '/admin/courses', icon: BookOpen },
  { label: 'Centers', to: '/admin/centers', icon: Building2 },
  { label: 'Enquiries', to: '/admin/enquiries', icon: FileText },
  { label: 'Exams', to: '/admin/exams', icon: ClipboardList },
  { label: 'Coordinators', to: '/admin/coordinators', icon: GraduationCap },
  { label: 'Notices', to: '/admin/notices', icon: Bell },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

const centerNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/center', icon: LayoutDashboard },
  { label: 'New Enrollment', to: '/center/enroll', icon: Users },
  { label: 'My Students', to: '/center/students', icon: GraduationCap },
  { label: 'Exam Forms', to: '/center/exam-forms', icon: ClipboardList },
  { label: 'Marks Entry', to: '/center/marks-entry', icon: FileText },
  { label: 'Settings', to: '/center/settings', icon: Settings },
];

export default function DashboardSidebar({ role }: { role: 'ADMIN' | 'CENTER' }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const logoutMutation = useLogout();

  const navItems = role === 'ADMIN' ? adminNavItems : centerNavItems;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        clearAuth();
        window.location.href = '/login';
      },
    });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'sticky top-0 z-40 flex h-screen flex-col border-r border-border/60 bg-gradient-to-b from-card via-card to-card/90 transition-all duration-300 ease-in-out',
          collapsed ? 'w-[68px]' : 'w-[260px]'
        )}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center border-b border-border/40 px-4 py-5',
          collapsed ? 'justify-center' : 'gap-3'
        )}>
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20">
            <GraduationCap className="h-5 w-5 text-white" />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-green-400" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="truncate text-sm font-bold tracking-tight text-foreground">
                CCMS
              </h2>
              <p className="truncate text-[11px] text-muted-foreground">
                {role === 'ADMIN' ? 'Admin Panel' : 'Center Panel'}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to ||
                (item.to !== '/admin' && item.to !== '/center' && location.pathname.startsWith(item.to));

              const linkContent = (
                <Link
                  to={item.to}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-700 shadow-sm shadow-emerald-500/5 dark:from-emerald-500/20 dark:to-teal-500/15 dark:text-emerald-400'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-[18px] w-[18px] shrink-0 transition-colors',
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  )}
                </Link>
              );

              return (
                <li key={item.to}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User & Actions */}
        <div className="border-t border-border/40 px-3 py-4">
          {!collapsed && user && (
            <div className="mb-3 rounded-xl bg-muted/50 px-3 py-2.5">
              <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
            {!collapsed && <span className="text-xs text-muted-foreground">Logout</span>}
            <div className="flex-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setCollapsed(!collapsed)}
                  className="text-muted-foreground"
                >
                  {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {collapsed ? 'Expand' : 'Collapse'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
