import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { EnrollmentFormData } from '../types';

export interface Enrollment {
  id: string;
  enrollmentNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  email: string;
  mobile: string;
  dob: string;
  address: string;
  courseName: string;
  courseId: string;
  status: string;
  activated: boolean;
  imageUrl: string;
  admissionDate: string;
  createdAt?: string;
}

interface EnrollmentListResponse {
  enrollments: Enrollment[];
  nextCursor: string | null;
}

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  list: () => [...enrollmentKeys.all, 'list'] as const,
};

export const fetchEnrollments = async (cursor?: string, limit = 20): Promise<EnrollmentListResponse> => {
  return apiClient.get('/AllEnrollments', { params: { cursor, limit } });
};

export const useEnrollments = () => {
  return useInfiniteQuery({
    queryKey: enrollmentKeys.list(),
    queryFn: ({ pageParam }) => fetchEnrollments(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useUpdateEnrollment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<EnrollmentFormData> & { id: string }) =>
      apiClient.put('/updateEnrollment', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: enrollmentKeys.all }),
  });
};

export const useDeleteEnrollment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete('/Delete_Enrollment', { data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: enrollmentKeys.all }),
  });
};

export const useActivateEnrollment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post('/ActivateEnrollment', { id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: enrollmentKeys.all }),
  });
};

export const useDeactivateEnrollment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post('/deActivateEnrollment', { id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: enrollmentKeys.all }),
  });
};

export const useGenerateIdCard = () => {
  return useMutation({
    mutationFn: (enrollmentNo: string) => apiClient.post('/generateId', { enrollmentNo }),
  });
};
