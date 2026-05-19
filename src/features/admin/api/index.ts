import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { Coordinator, CoordinatorUpdateData, NoticeFormData, ChangePasswordData } from '../types';

export const adminKeys = {
  coordinators: ['coordinators'] as const,
};

export const fetchCoordinators = async (): Promise<Coordinator[]> => {
  return apiClient.get('/Fetch_Coordinator');
};

export const useCoordinators = () => {
  return useQuery({
    queryKey: adminKeys.coordinators,
    queryFn: fetchCoordinators,
  });
};

export const useUpdateCoordinator = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CoordinatorUpdateData) => apiClient.post('/Coordinator_Update', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.coordinators }),
  });
};

export const useDeleteAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete('/Delete_Admin', { data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.coordinators }),
  });
};

export const useCreateNotice = () => {
  return useMutation({
    mutationFn: (data: NoticeFormData) => apiClient.post('/noticecreate', data),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => apiClient.post('/ChangePassword', data),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => apiClient.get('/logout'),
  });
};
