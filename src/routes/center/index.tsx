import { createFileRoute } from '@tanstack/react-router';
import { Users, ClipboardList, GraduationCap, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export const Route = createFileRoute('/center/')({
  component: CenterDashboard,
});

function CenterDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Center Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Manage your students and academic operations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden border-border/40 bg-card/80 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-[0.04]" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Students</CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-2 shadow-sm"><Users className="h-4 w-4 text-white" /></div>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">156</div><p className="mt-1 text-xs text-muted-foreground">+8 this month</p></CardContent>
        </Card>
        <Card className="relative overflow-hidden border-border/40 bg-card/80 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-[0.04]" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Exam Forms</CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-sm"><ClipboardList className="h-4 w-4 text-white" /></div>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">23</div><p className="mt-1 text-xs text-muted-foreground">12 pending verification</p></CardContent>
        </Card>
        <Card className="relative overflow-hidden border-border/40 bg-card/80 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 opacity-[0.04]" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Graduates</CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 p-2 shadow-sm"><GraduationCap className="h-4 w-4 text-white" /></div>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">89</div><p className="mt-1 text-xs text-muted-foreground">Total pass-outs</p></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/40 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-emerald-500" />Monthly Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/30">
              <div className="text-center">
                <Activity className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">Chart will display here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/80">
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: 'New enrollment: Priya Sharma', time: '5 min ago', color: 'bg-emerald-500' },
                { text: 'Exam form submitted: EN-2045', time: '30 min ago', color: 'bg-blue-500' },
                { text: 'Marks entered: Batch 2024-B', time: '2 hrs ago', color: 'bg-violet-500' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.color}`} />
                  <div><p className="text-sm font-medium">{a.text}</p><p className="text-xs text-muted-foreground">{a.time}</p></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
