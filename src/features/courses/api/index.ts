import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { Course, CourseFormData, AddSubjectData } from '../types';

export const courseKeys = {
  all: ['courses'] as const,
  list: () => [...courseKeys.all, 'list'] as const,
};

export const fetchCourses = async (): Promise<Course[]> => {
  return apiClient.get('/fetchAllCourseWithSub');
};

export const useCourses = () => {
  return useQuery({
    queryKey: courseKeys.list(),
    queryFn: fetchCourses,
  });
};

export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseFormData) => apiClient.post('/createCourse', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.all }),
  });
};

export const useUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseFormData) => apiClient.put('/updateCourse', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.all }),
  });
};

export const useAddSubject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddSubjectData) => apiClient.post('/subjectAdd', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.all }),
  });
};
