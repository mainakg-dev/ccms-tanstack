import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardList, Search, Loader2, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { examFormFillupSchema } from '../../features/exams/types/index';
import type { ExamFormFillupData, ExamFormStudent } from '../../features/exams/types/index';
import { fetchStudentForExam, useExamFormFillup } from '../../features/exams/api/index';

export const Route = createFileRoute('/center/exam-forms')({
  component: CenterExamForms,
});

function CenterExamForms() {
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [student, setStudent] = useState<ExamFormStudent | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const examFillup = useExamFormFillup();

  const form = useForm<ExamFormFillupData>({
    resolver: zodResolver(examFormFillupSchema),
    defaultValues: { enrollmentNo: '', atiCode: '', examCenterCode: '', lastPaymentReceiptNo: '' },
  });

  const handleLookup = async () => {
    if (!enrollmentNo.trim()) return;
    setLookupLoading(true);
    setLookupError('');
    try {
      const result = await fetchStudentForExam(enrollmentNo);
      if (!result.activated) {
        setLookupError('Student enrollment must be activated before exam form submission.');
        setStudent(null);
      } else {
        setStudent(result);
        form.setValue('enrollmentNo', enrollmentNo);
      }
    } catch {
      setLookupError('Student not found. Please verify the enrollment number.');
      setStudent(null);
    } finally {
      setLookupLoading(false);
    }
  };

  const onSubmit = (data: ExamFormFillupData) => {
    examFillup.mutate(data, {
      onSuccess: () => {
        form.reset();
        setStudent(null);
        setEnrollmentNo('');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Exam Form Fillup</h1>
        <p className="text-sm text-muted-foreground">Submit exam forms for activated students</p>
      </div>

      {/* Student Lookup */}
      <Card className="border-border/40 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4 text-blue-500" />
            Student Lookup
          </CardTitle>
          <CardDescription>Enter enrollment number to fetch student details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter Enrollment Number"
              value={enrollmentNo}
              onChange={(e) => setEnrollmentNo(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleLookup} disabled={lookupLoading} variant="outline" className="gap-2">
              {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Lookup
            </Button>
          </div>
          {lookupError && <p className="mt-2 text-sm text-destructive">{lookupError}</p>}

          {student && (
            <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Student Found</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Name:</span><span className="font-medium">{student.name}</span>
                <span className="text-muted-foreground">Course:</span><span className="font-medium">{student.courseName}</span>
                <span className="text-muted-foreground">Enrollment No:</span><span className="font-mono font-medium">{student.enrollmentNo}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exam Form */}
      {student && (
        <Card className="border-border/40 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4 text-violet-500" />
              Exam Form Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField control={form.control} name="atiCode" render={({ field }) => (
                    <FormItem><FormLabel>ATI Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="examCenterCode" render={({ field }) => (
                    <FormItem><FormLabel>Exam Center Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="lastPaymentReceiptNo" render={({ field }) => (
                    <FormItem><FormLabel>Last Payment Receipt No</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" disabled={examFillup.isPending} className="gap-2">
                  {examFillup.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck className="h-4 w-4" />}
                  Submit Exam Form
                </Button>
                {examFillup.isSuccess && <p className="text-sm text-emerald-600">Exam form submitted successfully!</p>}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
