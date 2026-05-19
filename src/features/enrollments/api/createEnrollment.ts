import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { EnrollmentFormData, PresignedUrlResponse } from '../types';

export const getPresignedUrl = async (fileName: string, fileType: string, category: string): Promise<PresignedUrlResponse> => {
  return apiClient.get('/generate-presigned-url', {
    params: { fileName, fileType, category }
  });
};

export const uploadImageToS3 = async (presignedUrl: string, file: File) => {
  // We use standard fetch here to bypass the standard API client's JSON interceptors, 
  // since S3 expects raw binary upload.
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload image to S3');
  }
};

export const createEnrollmentFn = async (data: EnrollmentFormData) => {
  return apiClient.post('/createEnrollment', data);
};

export const useCreateEnrollment = () => {
  return useMutation({
    mutationFn: createEnrollmentFn,
  });
};
