import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  UserPlus,
  Upload,
  Loader2,
  User,
  MapPin,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
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

const STEPS = [
  { id: 1, title: 'Personal Details', icon: User },
  { id: 2, title: 'Contact & Address', icon: MapPin },
  { id: 3, title: 'Admission & Photo', icon: BookOpen },
];

function EnrollStudentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const createEnrollment = useCreateEnrollment();

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      name: '',
      fatherName: '',
      motherName: '',
      address: '',
      dob: '',
      educationalQualification: '',
      category: 'GEN',
      courseId: '',
      idType: 'AADHAAR',
      idProofNo: '',
      nationality: 'Indian',
      sex: 'MALE',
      mobile: '',
      email: '',
      pincode: '',
      state: '',
      district: '',
      policeStation: '',
      postOffice: '',
      village: '',
      admissionDate: new Date().toISOString().split('T')[0],
      imageUrl: '',
    },
    mode: 'onTouched',
  });

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      form.setValue('imageUrl', 'temp-url'); // Clear validation error once file is selected
    }
  };

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await form.trigger([
        'name',
        'fatherName',
        'motherName',
        'dob',
        'sex',
        'category',
        'nationality',
        'educationalQualification',
      ]);
    } else if (currentStep === 2) {
      isValid = await form.trigger([
        'mobile',
        'email',
        'idType',
        'idProofNo',
        'address',
        'village',
        'postOffice',
        'policeStation',
        'district',
        'state',
        'pincode',
      ]);
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: EnrollmentFormData) => {
    try {
      let finalImageUrl = data.imageUrl;
      if (selectedFile) {
        setIsUploading(true);
        const presigned = await getPresignedUrl(selectedFile.name, selectedFile.type, 'face');
        await uploadImageToS3(presigned.url, selectedFile);
        finalImageUrl = presigned.url.split('?')[0];
      }

      createEnrollment.mutate(
        {
          ...data,
          imageUrl: finalImageUrl,
        },
        {
          onSuccess: () => {
            form.reset();
            setSelectedFile(null);
            setPreview(null);
            setCurrentStep(1);
          },
        }
      );
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

      {/* Stepper Progress */}
      <div className="mb-6 flex items-center justify-between border border-[var(--line)] bg-[var(--surface)] p-4 rounded-xl backdrop-blur-md">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : isCompleted
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-[var(--line)] bg-[var(--chip-bg)] text-muted-foreground'
                  }`}
                >
                  <StepIcon className="h-4 w-4" />
                </div>
                <div className="hidden flex-col sm:flex">
                  <span className="text-xs font-semibold text-muted-foreground">Step 0{step.id}</span>
                  <span className="text-xs font-medium text-[var(--sea-ink)]">{step.title}</span>
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`mx-4 h-[2px] flex-1 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-[var(--line)]'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <Card className="border-border/40 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="h-4 w-4 text-emerald-500" />
            {STEPS[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            Step {currentStep} of {STEPS.length}. All fields in this section are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* STEP 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Student's full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fatherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father's Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Father's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="motherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother's Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Mother's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="GEN">General</SelectItem>
                              <SelectItem value="SC">SC</SelectItem>
                              <SelectItem value="ST">ST</SelectItem>
                              <SelectItem value="OBC">OBC</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="educationalQualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Educational Qualification</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 10+2, Graduate" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Contact, Identity & Address */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact & Identity</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile (10 digits)</FormLabel>
                            <FormControl>
                              <Input placeholder="9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="student@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="idType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="AADHAAR">Aadhaar</SelectItem>
                                <SelectItem value="VOTER">Voter ID</SelectItem>
                                <SelectItem value="PAN">PAN</SelectItem>
                                <SelectItem value="PASSPORT">Passport</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="idProofNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Proof Number</FormLabel>
                            <FormControl>
                              <Input placeholder="ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-4">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Address Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2 lg:col-span-3">
                            <FormLabel>Full Address</FormLabel>
                            <FormControl>
                              <Input placeholder="House / Flat No, Street Address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="village"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Village</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="postOffice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Post Office</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="policeStation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Police Station</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode (6 digits)</FormLabel>
                            <FormControl>
                              <Input placeholder="700001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Admission & Photo Upload */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Course UUID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="admissionDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admission Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t border-border/40 pt-4">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Applicant Photo</h3>
                    <div className="flex items-start gap-6">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border/60 bg-muted/30">
                        {preview ? (
                          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                          <Upload className="h-6 w-6 text-muted-foreground/50" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e.target.files?.[0])}
                          className="max-w-xs"
                        />
                        <p className="text-xs text-muted-foreground">Upload a face photo (JPEG, PNG). Max 5MB.</p>
                        {!selectedFile && !form.getValues().imageUrl && (
                          <p className="text-xs text-amber-600 font-semibold">Photo is required to submit enrollment.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex items-center justify-between border-t border-border/40 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="gap-2 rounded-full border-[var(--line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-6 text-white hover:from-emerald-600 hover:to-teal-700"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createEnrollment.isPending || isUploading || (!selectedFile && !form.getValues().imageUrl)}
                    className="gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-6 text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading Image...
                      </>
                    ) : createEnrollment.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Submit Enrollment
                      </>
                    )}
                  </Button>
                )}
              </div>

              {createEnrollment.isError && (
                <p className="text-center text-sm text-destructive mt-4">
                  Failed: {createEnrollment.error.message}
                </p>
              )}
              {createEnrollment.isSuccess && (
                <p className="text-center text-sm text-emerald-600 mt-4">
                  Enrollment submitted successfully!
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
