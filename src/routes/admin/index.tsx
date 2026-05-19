import { createFileRoute } from '@tanstack/react-router';
import {
  Users,
  BookOpen,
  Building2,
  ClipboardList,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5">
      <div className={`absolute inset-0 opacity-[0.04] ${gradient}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`rounded-lg p-2 ${gradient} shadow-sm`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here's an overview of your institute.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value="1,247"
          description="+12% from last month"
          icon={Users}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Active Courses"
          value="24"
          description="3 new this quarter"
          icon={BookOpen}
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Centers"
          value="18"
          description="2 pending approval"
          icon={Building2}
          gradient="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        <StatCard
          title="Exams Pending"
          value="56"
          description="Next batch in 5 days"
          icon={ClipboardList}
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="border-border/40 bg-card/80 backdrop-blur-sm lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Enrollment Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[240px] items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/30">
              <div className="text-center">
                <Activity className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Enrollment trend chart will display here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/80 backdrop-blur-sm lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: 'New enrollment: Rahul Kumar', time: '2 min ago', color: 'bg-emerald-500' },
                { text: 'Exam form verified: EN-1045', time: '15 min ago', color: 'bg-blue-500' },
                { text: 'Center approved: Kolkata Branch', time: '1 hr ago', color: 'bg-violet-500' },
                { text: 'Marksheet published: Batch 2024', time: '3 hrs ago', color: 'bg-amber-500' },
                { text: 'New course added: Web Dev Pro', time: '5 hrs ago', color: 'bg-pink-500' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${activity.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Pending Enrollments', count: 34, total: 1247, color: 'from-amber-500 to-orange-500' },
          { label: 'Verified Exams', count: 189, total: 245, color: 'from-emerald-500 to-teal-500' },
          { label: 'Approved Marksheets', count: 156, total: 200, color: 'from-blue-500 to-indigo-500' },
        ].map((item) => (
          <Card key={item.label} className="border-border/40 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <span className="text-xs text-muted-foreground">{item.count}/{item.total}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                  style={{ width: `${(item.count / item.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
