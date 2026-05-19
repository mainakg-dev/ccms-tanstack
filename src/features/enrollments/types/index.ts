import { z } from 'zod';

export const enrollmentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  fatherName: z.string().min(2, "Father's name is required"),
  motherName: z.string().min(2, "Mother's name is required"),
  address: z.string().min(5, 'Address is required'),
  dob: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid Date of Birth" }),
  educationalQualification: z.string().min(2, 'Educational qualification is required'),
  category: z.enum(['GEN', 'SC', 'ST', 'OBC', 'OTHER']),
  courseId: z.string().uuid('Valid Course ID is required'),
  idType: z.enum(['AADHAAR', 'VOTER', 'PAN', 'PASSPORT']),
  idProofNo: z.string().min(4, 'ID Proof Number is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  sex: z.enum(['MALE', 'FEMALE', 'OTHER']),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  email: z.string().email('Invalid email address'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid Pincode'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  policeStation: z.string().min(2, 'Police Station is required'),
  postOffice: z.string().min(2, 'Post Office is required'),
  village: z.string().min(2, 'Village is required'),
  admissionDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid Admission Date" }),
  imageUrl: z.string(),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

export interface PresignedUrlResponse {
  url: string;
  key: string;
}
