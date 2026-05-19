import { createFileRoute } from '@tanstack/react-router';
import { ClipboardList } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export const Route = createFileRoute('/admin/exams')({
  component: AdminExams,
});

function AdminExams() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Examinations</h1>
        <p className="text-sm text-muted-foreground">Review exam forms, admit cards, and marksheets</p>
      </div>

      <Card className="border-border/40 bg-card/80">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
            <ClipboardList className="h-7 w-7 text-white" />
          </div>
          <p className="mt-4 text-base font-semibold">Exam Management</p>
          <p className="mt-1 max-w-md text-center text-sm text-muted-foreground">
            Exam form submissions, admit card generation, and marksheet verification are managed from the Center panel.
            As admin, you can review and verify exam forms and marksheets across all centers from this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
