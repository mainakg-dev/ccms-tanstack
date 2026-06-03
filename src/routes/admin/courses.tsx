import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BookOpen,
  Plus,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { useCourses, useCreateCourse, useAddSubject } from '../../features/courses/api/index';
import { courseSchema, addSubjectSchema } from '../../features/courses/types/index';
import type { CourseFormData, AddSubjectData, Course } from '../../features/courses/types/index';

export const Route = createFileRoute('/admin/courses')({
  component: AdminCourses,
});

function AdminCourses() {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [addSubjectCourse, setAddSubjectCourse] = useState<Course | null>(null);

  const { data: courses, isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const addSubject = useAddSubject();

  const courseForm = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: { courseName: '', duration: '', courseCode: '' },
  });

  const subjectForm = useForm<AddSubjectData>({
    resolver: zodResolver(addSubjectSchema),
    defaultValues: { courseId: '', subjectName: '', theoryFullMarks: 0, practicalFullMarks: 0 },
  });

  const onCreateCourse = (data: CourseFormData) => {
    createCourse.mutate(data, {
      onSuccess: () => {
        setShowAddCourse(false);
        courseForm.reset();
      },
    });
  };

  const onAddSubject = (data: AddSubjectData) => {
    addSubject.mutate(data, {
      onSuccess: () => {
        setAddSubjectCourse(null);
        subjectForm.reset();
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses & Subjects</h1>
          <p className="text-sm text-muted-foreground">Manage your institute's course catalog</p>
        </div>
        <Dialog open={showAddCourse} onOpenChange={setShowAddCourse}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>Add a new course to your institute's catalog.</DialogDescription>
            </DialogHeader>
            <Form {...courseForm}>
              <form onSubmit={courseForm.handleSubmit(onCreateCourse)} className="space-y-4">
                <FormField control={courseForm.control} name="courseName" render={({ field }) => (
                  <FormItem><FormLabel>Course Name</FormLabel><FormControl><Input placeholder="e.g. Diploma in Computer Application" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={courseForm.control} name="duration" render={({ field }) => (
                  <FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g. 6 months" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={courseForm.control} name="courseCode" render={({ field }) => (
                  <FormItem><FormLabel>Course Code (Optional)</FormLabel><FormControl><Input placeholder="e.g. DCA-001" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" disabled={createCourse.isPending}>
                    {createCourse.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Create Course
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !courses?.length ? (
        <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">No courses yet</p>
            <p className="text-xs text-muted-foreground">Start by adding your first course</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="border-border/40 bg-card/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
            >
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{course.courseName}</CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{course.duration}</Badge>
                        {course.courseCode && (
                          <Badge variant="outline" className="text-xs">{course.courseCode}</Badge>
                        )}
                        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-600">
                          {course.subjects?.length || 0} subjects
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                      expandedCourse === course.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </CardHeader>

              {expandedCourse === course.id && (
                <CardContent className="border-t border-border/40 pt-4">
                  {course.subjects?.length ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Subjects
                      </p>
                      <div className="divide-y divide-border/40 rounded-lg border border-border/40">
                        {course.subjects.map((subject) => (
                          <div key={subject.id} className="flex items-center justify-between px-4 py-3">
                            <span className="text-sm font-medium">{subject.subjectName}</span>
                            <div className="flex gap-4">
                              <span className="text-xs text-muted-foreground">
                                Theory: <span className="font-semibold text-foreground">{subject.theoryFullMarks}</span>
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Practical: <span className="font-semibold text-foreground">{subject.practicalFullMarks}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No subjects added yet.</p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2"
                    onClick={() => {
                      setAddSubjectCourse(course);
                      subjectForm.setValue('courseId', course.id);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    Add Subject
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add Subject Dialog */}
      <Dialog open={!!addSubjectCourse} onOpenChange={(open) => !open && setAddSubjectCourse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subject to {addSubjectCourse?.courseName}</DialogTitle>
            <DialogDescription>Define a new subject with marks allocation.</DialogDescription>
          </DialogHeader>
          <Form {...subjectForm}>
            <form onSubmit={subjectForm.handleSubmit(onAddSubject)} className="space-y-4">
              <FormField control={subjectForm.control} name="subjectName" render={({ field }) => (
                <FormItem><FormLabel>Subject Name</FormLabel><FormControl><Input placeholder="e.g. Programming in C" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={subjectForm.control} name="theoryFullMarks" render={({ field }) => (
                  <FormItem><FormLabel>Theory Full Marks</FormLabel><FormControl><Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={subjectForm.control} name="practicalFullMarks" render={({ field }) => (
                  <FormItem><FormLabel>Practical Full Marks</FormLabel><FormControl><Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={addSubject.isPending}>
                  {addSubject.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Add Subject
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
