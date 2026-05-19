import { createFileRoute, Link } from '@tanstack/react-router'
import {
  GraduationCap,
  Users,
  BookOpen,
  ClipboardList,
  Shield,
  ArrowRight,
  Building2,
  Award,
  Zap,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  return (
    <main className="pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20">
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.3),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.2),transparent_66%)]" />

        <div className="page-wrap relative">
          <div className="rise-in mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Zap className="h-3 w-3" />
              Computer Course Management System
            </div>
            <h1 className="display-title mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-[var(--sea-ink)] sm:text-5xl lg:text-6xl">
              Manage your institute with{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                confidence.
              </span>
            </h1>
            <p className="mb-8 text-lg text-[var(--sea-ink-soft)] sm:text-xl">
              A modern platform to manage student enrollments, courses, examinations, 
              centers, and marksheets — all in one place.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-8 text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/30">
                <Link to="/login">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="page-wrap px-4">
        <div className="mb-8 text-center">
          <p className="island-kicker mb-2">Features</p>
          <h2 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
            Everything you need to run your institute
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Users, title: 'Student Enrollments', desc: 'Complete admission workflow with image upload, activation tracking, and ID card generation.', gradient: 'from-emerald-500 to-teal-600' },
            { icon: BookOpen, title: 'Course Management', desc: 'Create courses, define subjects with theory and practical marks allocation.', gradient: 'from-blue-500 to-indigo-600' },
            { icon: ClipboardList, title: 'Exam Management', desc: 'Exam form fillup, admit card generation, and comprehensive marks entry system.', gradient: 'from-violet-500 to-purple-600' },
            { icon: Building2, title: 'Center Management', desc: 'Multi-branch support with franchise enquiry approval and fee management.', gradient: 'from-amber-500 to-orange-600' },
            { icon: Award, title: 'Automated Grading', desc: 'Auto-calculated percentages and grades (AA to D) based on your grading scale.', gradient: 'from-pink-500 to-rose-600' },
            { icon: Shield, title: 'Role-Based Access', desc: 'Strict isolation between Admin, Center, and Student roles with secure authentication.', gradient: 'from-cyan-500 to-blue-600' },
          ].map((feature, i) => (
            <Card
              key={feature.title}
              className="island-shell feature-card rise-in group cursor-default rounded-2xl border-border/40 p-0"
              style={{ animationDelay: `${i * 80 + 100}ms` }}
            >
              <CardContent className="p-6">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-md transition-transform group-hover:scale-110`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--sea-ink-soft)]">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="page-wrap mt-16 px-4">
        <div className="island-shell rounded-2xl p-8 sm:p-10">
          <p className="island-kicker mb-2">Workflow</p>
          <h2 className="display-title mb-6 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
            Student lifecycle, simplified
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { step: '01', label: 'Enrollment', desc: 'Center enrolls students with full documentation' },
              { step: '02', label: 'Activation', desc: 'Admin reviews and activates the enrollment' },
              { step: '03', label: 'ID Card', desc: 'Generate student ID cards for activated students' },
              { step: '04', label: 'Exam Form', desc: 'Center submits exam forms with ATI & payment details' },
              { step: '05', label: 'Marks Entry', desc: 'Enter theory & practical marks with auto-grading' },
              { step: '06', label: 'Pass Out', desc: 'Verified marksheets lead to graduation' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 rounded-xl bg-[var(--surface)] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white shadow-sm">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--sea-ink)]">{item.label}</p>
                  <p className="mt-0.5 text-xs text-[var(--sea-ink-soft)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-wrap mt-16 px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-10 text-center text-white shadow-xl shadow-emerald-500/20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative">
            <GraduationCap className="mx-auto mb-4 h-10 w-10" />
            <h2 className="display-title mb-3 text-2xl font-bold sm:text-3xl">Ready to get started?</h2>
            <p className="mx-auto mb-6 max-w-md text-emerald-100">
              Sign in to access your dashboard and start managing your institute today.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8 font-semibold shadow-lg">
              <Link to="/login">Sign in to Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
