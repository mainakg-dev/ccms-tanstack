import { createFileRoute } from '@tanstack/react-router';
import { FileText, Loader2, Trash2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useEnquiries, useDeleteEnquiry, useGenerateFranchise } from '../../features/centers/api/index';

export const Route = createFileRoute('/admin/enquiries')({
  component: AdminEnquiries,
});

function AdminEnquiries() {
  const { data: enquiries, isLoading } = useEnquiries();
  const deleteEnquiry = useDeleteEnquiry();
  const generateFranchise = useGenerateFranchise();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Franchise Enquiries</h1>
        <p className="text-sm text-muted-foreground">Review and manage franchise applications</p>
      </div>

      <Card className="border-border/40 bg-card/80">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-violet-500" />
            Enquiries
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : !enquiries?.length ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No enquiries yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enquiries.map((enq) => (
                    <TableRow key={enq.id} className="group">
                      <TableCell>
                        <p className="font-medium text-sm">{enq.name}</p>
                        <p className="text-xs text-muted-foreground">{enq.address}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{enq.email}</p>
                        <p className="text-xs text-muted-foreground">{enq.mobile}</p>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{enq.message}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          enq.status === 'APPROVED' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600' :
                          enq.status === 'REJECTED' ? 'border-red-500/30 bg-red-500/10 text-red-600' :
                          'border-amber-500/30 bg-amber-500/10 text-amber-600'
                        }>{enq.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          {enq.status === 'PENDING' && (
                            <Button
                              size="xs"
                              variant="outline"
                              className="gap-1 text-emerald-600"
                              onClick={() => generateFranchise.mutate(enq.id)}
                              disabled={generateFranchise.isPending}
                            >
                              <CheckCircle className="h-3 w-3" /> Approve
                            </Button>
                          )}
                          <Button
                            size="xs"
                            variant="outline"
                            className="gap-1 text-destructive"
                            onClick={() => deleteEnquiry.mutate(enq.id)}
                            disabled={deleteEnquiry.isPending}
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
