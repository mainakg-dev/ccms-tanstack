import { z } from 'zod';

export const subjectSchema = z.object({
  id: z.string().optional(),
  subjectName: z.string().min(2, 'Subject name is required'),
  theoryFullMarks: z.number().min(0),
  practicalFullMarks: z.number().min(0),
});

export type Subject = z.infer<typeof subjectSchema>;

export const courseSchema = z.object({
  id: z.string().optional(),
  courseName: z.string().min(2, 'Course name is required'),
  duration: z.string().min(1, 'Duration is required'),
  courseCode: z.string().optional(),
  subjects: z.array(subjectSchema).optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export interface Course {
  id: string;
  courseName: string;
  duration: string;
  courseCode: string;
  subjects: Subject[];
  createdAt?: string;
}

export const addSubjectSchema = z.object({
  courseId: z.string().uuid('Valid Course ID is required'),
  subjectName: z.string().min(2, 'Subject name is required'),
  theoryFullMarks: z.number().min(0, 'Must be >= 0'),
  practicalFullMarks: z.number().min(0, 'Must be >= 0'),
});

export type AddSubjectData = z.infer<typeof addSubjectSchema>;
