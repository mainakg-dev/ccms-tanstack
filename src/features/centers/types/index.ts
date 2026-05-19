import { z } from 'zod';

export interface Center {
  id: string;
  centerName: string;
  centerCode: string;
  address: string;
  email: string;
  mobile: string;
  activated: boolean;
  createdAt?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  message: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
}

export const amountEditSchema = z.object({
  centerId: z.string().uuid('Valid Center ID is required'),
  courseId: z.string().uuid('Valid Course ID is required'),
  amount: z.number().min(0, 'Amount must be non-negative'),
});

export type AmountEditData = z.infer<typeof amountEditSchema>;

export const generateFranchiseSchema = z.object({
  enquiryId: z.string().uuid('Valid Enquiry ID is required'),
});

export type GenerateFranchiseData = z.infer<typeof generateFranchiseSchema>;
