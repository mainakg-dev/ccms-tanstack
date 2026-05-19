import { z } from 'zod';

export interface ExamFormStudent {
  enrollmentNo: string;
  name: string;
  courseName: string;
  courseId: string;
  activated: boolean;
  subjects: {
    id: string;
    subjectName: string;
    theoryFullMarks: number;
    practicalFullMarks: number;
  }[];
}

export const examFormFillupSchema = z.object({
  enrollmentNo: z.string().min(1, 'Enrollment No is required'),
  atiCode: z.string().min(1, 'ATI Code is required'),
  examCenterCode: z.string().min(1, 'Exam Center Code is required'),
  lastPaymentReceiptNo: z.string().min(1, 'Payment Receipt No is required'),
});

export type ExamFormFillupData = z.infer<typeof examFormFillupSchema>;

export const marksEntrySubjectSchema = z.object({
  subjectId: z.string(),
  subjectName: z.string(),
  theoryFullMarks: z.number(),
  practicalFullMarks: z.number(),
  theoryMarks: z.number().min(0, 'Must be >= 0'),
  practicalMarks: z.number().min(0, 'Must be >= 0'),
});

export const marksEntrySchema = z.object({
  enrollmentNo: z.string().min(1, 'Enrollment No is required'),
  passingYear: z.string().min(4, 'Valid year is required'),
  dateOfPublishing: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: 'Invalid date',
  }),
  remark: z.enum(['PASS', 'FAIL']),
  subjects: z.array(marksEntrySubjectSchema).min(1, 'At least one subject is required'),
});

export type MarksEntryData = z.infer<typeof marksEntrySchema>;

/** Grading scale per context.md */
export function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'AA';
  if (percentage >= 80) return 'A+';
  if (percentage >= 70) return 'A';
  if (percentage >= 60) return 'B+';
  if (percentage >= 50) return 'B';
  if (percentage >= 40) return 'C';
  return 'D';
}

export function calculateMarks(
  subjects: { theoryMarks: number; practicalMarks: number; theoryFullMarks: number; practicalFullMarks: number }[]
) {
  const totalObtained = subjects.reduce((sum, s) => sum + s.theoryMarks + s.practicalMarks, 0);
  const totalFull = subjects.reduce((sum, s) => sum + s.theoryFullMarks + s.practicalFullMarks, 0);
  const percentage = totalFull > 0 ? Math.round((totalObtained / totalFull) * 10000) / 100 : 0;
  const grade = calculateGrade(percentage);
  return { totalObtained, totalFull, percentage, grade };
}
