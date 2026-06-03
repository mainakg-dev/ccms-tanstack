import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle,
  Building2,
} from 'lucide-react';
import { submitEnquirySchema } from '../features/centers/types';
import type { SubmitEnquiryData } from '../features/centers/types';
import { useSubmitEnquiry } from '../features/centers/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

export const Route = createFileRoute('/enquiry')({
  component: FranchiseEnquiryPage,
});

const STEPS = [
  { id: 1, title: 'Contact Info', description: 'Who is applying' },
  { id: 2, title: 'Proposed Location', description: 'Where you want to open' },
  { id: 3, title: 'Enquiry Details', description: 'Your business proposal' },
];

export function FranchiseEnquiryPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const submitEnquiry = useSubmitEnquiry();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<SubmitEnquiryData>({
    resolver: zodResolver(submitEnquirySchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      address: '',
      message: '',
    },
    mode: 'onTouched',
  });

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['name', 'email', 'mobile']);
    } else if (currentStep === 2) {
      isValid = await trigger(['address']);
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: SubmitEnquiryData) => {
    submitEnquiry.mutate(data);
  };

  if (submitEnquiry.isSuccess) {
    return (
      <main className="page-wrap px-4 py-16">
        <div className="island-shell rise-in mx-auto max-w-lg rounded-2xl p-8 text-center text-[var(--sea-ink)]">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-emerald-600 dark:text-emerald-400" />
          <h1 className="display-title mb-3 text-2xl font-bold">Thank You!</h1>
          <p className="mb-6 text-sm text-[var(--sea-ink-soft)] leading-relaxed">
            Your franchise enquiry has been submitted successfully. Our team will review your application 
            and contact you soon.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-6 text-white hover:from-emerald-600 hover:to-teal-700">
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrap px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <span className="island-kicker mb-2">Franchise Program</span>
          <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
            Partner With Us
          </h1>
          <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
            Fill in the multi-step form below to request franchise credentials for a new center.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="mb-8 flex items-center justify-between px-2">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 ${
                    currentStep === step.id
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : currentStep > step.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-[var(--line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]'
                  }`}
                >
                  {step.id}
                </div>
                <span className="mt-2 hidden text-xs font-medium text-[var(--sea-ink-soft)] sm:block">
                  {step.title}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`mx-4 h-[2px] flex-1 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-[var(--line)]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Glass Form Container */}
        <div className="island-shell rise-in rounded-2xl p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2 border-b border-[var(--line)] pb-4">
            <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
              {STEPS[currentStep - 1].title}
            </h2>
            <span className="ml-auto text-xs text-[var(--sea-ink-soft)]">
              Step {currentStep} of {STEPS.length}
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* STEP 1: Contact Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium leading-none text-[var(--sea-ink)] select-none">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
                    <Input id="name" placeholder="Enter your full name" className="pl-9" {...register("name")} />
                  </div>
                  {errors.name && (
                    <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none text-[var(--sea-ink)] select-none">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
                    <Input id="email" type="email" placeholder="you@example.com" className="pl-9" {...register("email")} />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="mobile" className="text-sm font-medium leading-none text-[var(--sea-ink)] select-none">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
                    <Input id="mobile" placeholder="10-digit mobile number" className="pl-9" {...register("mobile")} />
                  </div>
                  {errors.mobile && (
                    <p className="text-xs font-medium text-destructive">{errors.mobile.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Proposed Location */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="address" className="text-sm font-medium leading-none text-[var(--sea-ink)] select-none">
                    Proposed Center Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute top-3 left-3 h-4 w-4 text-[var(--sea-ink-soft)]" />
                    <Textarea
                      id="address"
                      placeholder="Enter the full address of the proposed franchise center location"
                      className="pl-9 min-h-[120px]"
                      {...register("address")}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-xs font-medium text-destructive">{errors.address.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Enquiry Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="message" className="text-sm font-medium leading-none text-[var(--sea-ink)] select-none">
                    Business Proposal / Message
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute top-3 left-3 h-4 w-4 text-[var(--sea-ink-soft)]" />
                    <Textarea
                      id="message"
                      placeholder="Describe your motivation, previous experience, building space, and target student count."
                      className="pl-9 min-h-[120px]"
                      {...register("message")}
                    />
                  </div>
                  {errors.message && (
                    <p className="text-xs font-medium text-destructive">{errors.message.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between border-t border-[var(--line)] pt-6">
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
                  disabled={submitEnquiry.isPending}
                  className="gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-6 text-white hover:from-emerald-600 hover:to-teal-700"
                >
                  {submitEnquiry.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Enquiry'
                  )}
                </Button>
              )}
            </div>

            {submitEnquiry.isError && (
              <p className="text-center text-sm text-destructive mt-4">
                Failed to submit enquiry: {submitEnquiry.error.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
