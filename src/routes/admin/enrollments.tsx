import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  CreditCard,
  Trash2,
  MoreHorizontal,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  useEnrollments,
  useActivateEnrollment,
  useDeactivateEnrollment,
  useDeleteEnrollment,
  useGenerateIdCard,
} from '../../features/enrollments/api/index';
import type { Enrollment } from '../../features/enrollments/api/index';

export const Route = createFileRoute('/admin/enrollments')({
  component: AdminEnrollments,
});

function getStatusBadge(status: string, activated: boolean) {
  if (!activated) {
    return <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">Inactive</Badge>;
  }
  const variants: Record<string, { className: string; label: string }> = {
    'Pending': { className: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400', label: 'Pending' },
    'Enrollment Done': { className: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400', label: 'Enrolled' },
    'Enrollment Verified': { className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', label: 'Verified' },
    'Exam Form Verified': { className: 'border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400', label: 'Exam Ready' },
    'Marksheet Verified': { className: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', label: 'Marks Verified' },
    'PassOut': { className: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400', label: 'Passed Out' },
  };
  const v = variants[status] || { className: 'border-gray-500/30 bg-gray-500/10 text-gray-600', label: status };
  return <Badge variant="outline" className={v.className}>{v.label}</Badge>;
}

function AdminEnrollments() {
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Enrollment | null>(null);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useEnrollments();
  const activate = useActivateEnrollment();
  const deactivate = useDeactivateEnrollment();
  const deleteEnrollment = useDeleteEnrollment();
  const generateId = useGenerateIdCard();

  const enrollments = data?.pages.flatMap((p) => p.enrollments) ?? [];
  const filtered = enrollments.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.enrollmentNo.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enrollments</h1>
          <p className="text-sm text-muted-foreground">Manage all student enrollments</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or enrollment no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-emerald-500" />
            All Enrollments
            {enrollments.length > 0 && (
              <Badge variant="secondary" className="ml-2">{enrollments.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading enrollments...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium text-muted-foreground">No enrollments found</p>
              <p className="text-xs text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[140px]">Enrollment No</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Admission</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((enrollment) => (
                    <TableRow key={enrollment.id} className="group">
                      <TableCell className="font-mono text-xs font-medium">
                        {enrollment.enrollmentNo}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white shadow-sm">
                            {enrollment.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{enrollment.name}</p>
                            <p className="text-xs text-muted-foreground">{enrollment.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{enrollment.courseName}</TableCell>
                      <TableCell>{getStatusBadge(enrollment.status, enrollment.activated)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(enrollment.admissionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {!enrollment.activated ? (
                              <DropdownMenuItem
                                onClick={() => activate.mutate(enrollment.id)}
                                className="text-emerald-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => deactivate.mutate(enrollment.id)}
                                className="text-amber-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            )}
                            {enrollment.activated && (
                              <DropdownMenuItem
                                onClick={() => generateId.mutate(enrollment.enrollmentNo)}
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Generate ID Card
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(enrollment)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center border-t border-border/40 py-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="gap-2"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Enrollment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the enrollment for{' '}
              <span className="font-semibold">{deleteTarget?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) {
                  deleteEnrollment.mutate(deleteTarget.id, {
                    onSuccess: () => setDeleteTarget(null),
                  });
                }
              }}
              disabled={deleteEnrollment.isPending}
            >
              {deleteEnrollment.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
