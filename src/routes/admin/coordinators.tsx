import { createFileRoute } from '@tanstack/react-router';
import { GraduationCap, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useCoordinators } from '../../features/admin/api/index';

export const Route = createFileRoute('/admin/coordinators')({
  component: AdminCoordinators,
});

function AdminCoordinators() {
  const { data: coordinators, isLoading } = useCoordinators();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Coordinators</h1>
        <p className="text-sm text-muted-foreground">System coordinators and administrators</p>
      </div>

      <Card className="border-border/40 bg-card/80">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-4 w-4 text-pink-500" />
            All Coordinators
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : !coordinators?.length ? (
            <div className="flex flex-col items-center justify-center py-16">
              <GraduationCap className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No coordinators found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coordinators.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                    <TableCell className="text-muted-foreground">{c.mobile}</TableCell>
                    <TableCell className="text-muted-foreground">{c.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
