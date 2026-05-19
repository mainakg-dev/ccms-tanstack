import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { ExamFormStudent, ExamFormFillupData, MarksEntryData } from '../types';

export const examKeys = {
  all: ['exams'] as const,
  studentLookup: (enrollmentNo: string) => [...examKeys.all, 'student', enrollmentNo] as const,
};

export const fetchStudentForExam = async (enrollmentNo: string): Promise<ExamFormStudent> => {
  return apiClient.post('/exmformfillupDatafetch', { enrollmentNo });
};

export const useExamFormFillup = () => {
  return useMutation({
    mutationFn: (data: ExamFormFillupData) => apiClient.post('/examFormFillup', data),
  });
};

export const useGenerateAdmitCard = () => {
  return useMutation({
    mutationFn: (enrollmentNo: string) => apiClient.post('/generateadmit', { enrollmentNo }),
  });
};

export const useMarksEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MarksEntryData) => apiClient.post('/exmmarksentry', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: examKeys.all }),
  });
};

export const useUpdateMarksheet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MarksEntryData) => apiClient.post('/updateMarksheet', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: examKeys.all }),
  });
};
