import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Search, Loader2, Calculator, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { marksEntrySchema, calculateMarks } from '../../features/exams/types/index';
import type { MarksEntryData, ExamFormStudent } from '../../features/exams/types/index';
import { fetchStudentForExam, useMarksEntry } from '../../features/exams/api/index';

export const Route = createFileRoute('/center/marks-entry')({
  component: CenterMarksEntry,
});

function CenterMarksEntry() {
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [student, setStudent] = useState<ExamFormStudent | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const marksEntry = useMarksEntry();

  const form = useForm<MarksEntryData>({
    resolver: zodResolver(marksEntrySchema),
    defaultValues: {
      enrollmentNo: '', passingYear: '', dateOfPublishing: '', remark: 'PASS', subjects: [],
    },
  });

  const { fields } = useFieldArray({ control: form.control, name: 'subjects' });
  const watchedSubjects = form.watch('subjects');
  const marksInfo = watchedSubjects?.length ? calculateMarks(watchedSubjects) : null;

  const handleLookup = async () => {
    if (!enrollmentNo.trim()) return;
    setLookupLoading(true);
    setLookupError('');
    try {
      const result = await fetchStudentForExam(enrollmentNo);
      setStudent(result);
      form.setValue('enrollmentNo', enrollmentNo);
      form.setValue(
        'subjects',
        result.subjects.map((s) => ({
          subjectId: s.id,
          subjectName: s.subjectName,
          theoryFullMarks: s.theoryFullMarks,
          practicalFullMarks: s.practicalFullMarks,
          theoryMarks: 0,
          practicalMarks: 0,
        }))
      );
    } catch {
      setLookupError('Student not found.');
      setStudent(null);
    } finally {
      setLookupLoading(false);
    }
  };

  const onSubmit = (data: MarksEntryData) => {
    marksEntry.mutate(data, {
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
        <h1 className="text-2xl font-bold tracking-tight">Marks Entry</h1>
        <p className="text-sm text-muted-foreground">Enter marks for students with verified exam forms</p>
      </div>

      {/* Student Lookup */}
      <Card className="border-border/40 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Search className="h-4 w-4 text-blue-500" />Student Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input placeholder="Enter Enrollment Number" value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} className="max-w-sm" />
            <Button onClick={handleLookup} disabled={lookupLoading} variant="outline" className="gap-2">
              {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}Lookup
            </Button>
          </div>
          {lookupError && <p className="mt-2 text-sm text-destructive">{lookupError}</p>}
        </CardContent>
      </Card>

      {/* Marks Entry Form */}
      {student && (
        <Card className="border-border/40 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-violet-500" />
              Marks for: {student.name}
            </CardTitle>
            <CardDescription>Course: {student.courseName}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField control={form.control} name="passingYear" render={({ field }) => (
                    <FormItem><FormLabel>Passing Year</FormLabel><FormControl><Input placeholder="2024" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="dateOfPublishing" render={({ field }) => (
                    <FormItem><FormLabel>Date of Publishing</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="remark" render={({ field }) => (
                    <FormItem><FormLabel>Remark</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="PASS">PASS</SelectItem><SelectItem value="FAIL">FAIL</SelectItem></SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Subject Marks Table */}
                <div className="overflow-x-auto rounded-lg border border-border/40">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-center">Theory Full</TableHead>
                        <TableHead className="text-center">Theory Marks</TableHead>
                        <TableHead className="text-center">Practical Full</TableHead>
                        <TableHead className="text-center">Practical Marks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">{field.subjectName}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{field.theoryFullMarks}</TableCell>
                          <TableCell>
                            <FormField control={form.control} name={`subjects.${index}.theoryMarks`} render={({ field: f }) => (
                              <FormItem><FormControl><Input type="number" className="w-20 mx-auto text-center" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl></FormItem>
                            )} />
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">{field.practicalFullMarks}</TableCell>
                          <TableCell>
                            <FormField control={form.control} name={`subjects.${index}.practicalMarks`} render={({ field: f }) => (
                              <FormItem><FormControl><Input type="number" className="w-20 mx-auto text-center" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl></FormItem>
                            )} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Calculated Results */}
                {marksInfo && (
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="gap-1 px-3 py-1.5"><Calculator className="h-3 w-3" />Total: {marksInfo.totalObtained}/{marksInfo.totalFull}</Badge>
                    <Badge variant="outline" className="gap-1 px-3 py-1.5">{marksInfo.percentage}%</Badge>
                    <Badge className="gap-1 bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-white"><Award className="h-3 w-3" />Grade: {marksInfo.grade}</Badge>
                  </div>
                )}

                <Button type="submit" disabled={marksEntry.isPending} className="gap-2">
                  {marksEntry.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                  Submit Marks
                </Button>
                {marksEntry.isSuccess && <p className="text-sm text-emerald-600">Marks submitted successfully!</p>}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
