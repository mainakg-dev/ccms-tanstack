import { z } from 'zod';

export interface Coordinator {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const coordinatorUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
});

export type CoordinatorUpdateData = z.infer<typeof coordinatorUpdateSchema>;

export const noticeSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

export type NoticeFormData = z.infer<typeof noticeSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}
