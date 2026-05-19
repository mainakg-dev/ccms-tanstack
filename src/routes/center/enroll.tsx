import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { UserPlus, Upload, Loader2 } from 'lucide-react';
import { enrollmentSchema } from '../../features/enrollments/types';
import type { EnrollmentFormData } from '../../features/enrollments/types';
import { useCreateEnrollment, getPresignedUrl, uploadImageToS3 } from '../../features/enrollments/api/createEnrollment';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';

export const Route = createFileRoute('/center/enroll')({
  component: EnrollStudentPage,
});

function EnrollStudentPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const createEnrollment = useCreateEnrollment();

  const form = useForm<EnrollmentFormData>({
    resolver: standardSchemaResolver(enrollmentSchema),
    defaultValues: {
      name: '', fatherName: '', motherName: '', address: '', dob: '',
      educationalQualification: '', category: 'GEN', courseId: '',
      idType: 'AADHAAR', idProofNo: '', nationality: 'Indian', sex: 'MALE',
      mobile: '', email: '', pincode: '', state: '', district: '',
      policeStation: '', postOffice: '', village: '',
      admissionDate: new Date().toISOString().split('T')[0], imageUrl: '',
    },
  });

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: EnrollmentFormData) => {
    try {
      if (selectedFile && !data.imageUrl) {
        setIsUploading(true);
        const presigned = await getPresignedUrl(selectedFile.name, selectedFile.type, 'face');
        await uploadImageToS3(presigned.url, selectedFile);
        data.imageUrl = presigned.url.split('?')[0];
      }
      createEnrollment.mutate(data, {
        onSuccess: () => {
          form.reset();
          setSelectedFile(null);
          setPreview(null);
        },
      });
    } catch (error) {
      console.error('Enrollment error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Student Enrollment</h1>
        <p className="text-sm text-muted-foreground">Fill in all mandatory details to admit a new student.</p>
      </div>

      <Card className="border-border/40 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="h-4 w-4 text-emerald-500" />
            Student Information
          </CardTitle>
          <CardDescription>All fields marked are mandatory.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Info Section */}
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Personal Details</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Student's full name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="fatherName" render={({ field }) => (
                    <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="motherName" render={({ field }) => (
                    <FormItem><FormLabel>Mother's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="sex" render={({ field }) => (
                    <FormItem><FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="MALE">Male</SelectItem><SelectItem value="FEMALE">Female</SelectItem><SelectItem value="OTHER">Other</SelectItem></SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="GEN">General</SelectItem><SelectItem value="SC">SC</SelectItem><SelectItem value="ST">ST</SelectItem><SelectItem value="OBC">OBC</SelectItem><SelectItem value="OTHER">Other</SelectItem></SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="nationality" render={({ field }) => (
                    <FormItem><FormLabel>Nationality</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="educationalQualification" render={({ field }) => (
                    <FormItem><FormLabel>Educational Qualification</FormLabel><FormControl><Input placeholder="e.g. 10+2, Graduate" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              {/* Contact & ID */}
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact & Identity</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FormField control={form.control} name="mobile" render={({ field }) => (
                    <FormItem><FormLabel>Mobile (10 digits)</FormLabel><FormControl><Input placeholder="9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="idType" render={({ field }) => (
                    <FormItem><FormLabel>ID Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="AADHAAR">Aadhaar</SelectItem><SelectItem value="VOTER">Voter ID</SelectItem><SelectItem value="PAN">PAN</SelectItem><SelectItem value="PASSPORT">Passport</SelectItem></SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="idProofNo" render={({ field }) => (
                    <FormItem><FormLabel>ID Proof Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Address</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="md:col-span-2 lg:col-span-3"><FormLabel>Full Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="village" render={({ field }) => (
                    <FormItem><FormLabel>Village</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="postOffice" render={({ field }) => (
                    <FormItem><FormLabel>Post Office</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="policeStation" render={({ field }) => (
                    <FormItem><FormLabel>Police Station</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="district" render={({ field }) => (
                    <FormItem><FormLabel>District</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="pincode" render={({ field }) => (
                    <FormItem><FormLabel>Pincode (6 digits)</FormLabel><FormControl><Input placeholder="700001" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              {/* Course & Admission */}
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admission Details</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="courseId" render={({ field }) => (
                    <FormItem><FormLabel>Course ID</FormLabel><FormControl><Input placeholder="Course UUID" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="admissionDate" render={({ field }) => (
                    <FormItem><FormLabel>Admission Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Applicant Photo</p>
                <div className="flex items-start gap-6">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border/60 bg-muted/30">
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground/50" />
                    )}
                  </div>
                  <div>
                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files?.[0])} className="max-w-xs" />
                    <p className="mt-1 text-xs text-muted-foreground">Upload a face photo (JPEG, PNG). Max 5MB.</p>
                    {!selectedFile && <p className="mt-1 text-xs text-amber-600">Photo is required.</p>}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center gap-4 border-t border-border/40 pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={createEnrollment.isPending || isUploading || (!selectedFile && !form.getValues().imageUrl)}
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : createEnrollment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  {isUploading ? 'Uploading Image...' : createEnrollment.isPending ? 'Submitting...' : 'Submit Enrollment'}
                </Button>
                {createEnrollment.isError && (
                  <p className="text-sm text-destructive">Failed: {createEnrollment.error.message}</p>
                )}
                {createEnrollment.isSuccess && (
                  <p className="text-sm text-emerald-600">Enrollment submitted successfully!</p>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
