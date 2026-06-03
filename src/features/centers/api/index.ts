import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { Center, Enquiry, AmountEditData, SubmitEnquiryData } from '../types';

export const centerKeys = {
  all: ['centers'] as const,
  list: () => [...centerKeys.all, 'list'] as const,
};

export const enquiryKeys = {
  all: ['enquiries'] as const,
  list: () => [...enquiryKeys.all, 'list'] as const,
};

export const fetchCenters = async (): Promise<Center[]> => {
  return apiClient.get('/All_Center');
};

export const useCenters = () => {
  return useQuery({
    queryKey: centerKeys.list(),
    queryFn: fetchCenters,
  });
};

export const fetchEnquiries = async (): Promise<Enquiry[]> => {
  return apiClient.get('/FetchAllEnquiry');
};

export const useEnquiries = () => {
  return useQuery({
    queryKey: enquiryKeys.list(),
    queryFn: fetchEnquiries,
  });
};

export const useDeleteEnquiry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete('/deleteEnquiry', { data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: enquiryKeys.all }),
  });
};

export const useGenerateFranchise = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (enquiryId: string) => apiClient.post('/generate_franchise', { enquiryId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: enquiryKeys.all });
      qc.invalidateQueries({ queryKey: centerKeys.all });
    },
  });
};

export const useEditAmount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AmountEditData) => apiClient.post('/amountEdit', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: centerKeys.all }),
  });
};

export const useSubmitEnquiry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SubmitEnquiryData) => apiClient.post('/submit_enquiry', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: enquiryKeys.all }),
  });
};
