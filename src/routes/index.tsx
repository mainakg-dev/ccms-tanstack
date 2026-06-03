import { createFileRoute, Link } from '@tanstack/react-router';
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
  Loader2,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useNotices } from '../features/admin/api/index';
import { useCourses } from '../features/courses/api/index';

export const Route = createFileRoute('/')({ component: LandingPage });

function LandingPage() {
  const { data: notices, isLoading: isNoticesLoading } = useNotices();
  const { data: courses, isLoading: isCoursesLoading } = useCourses();

  return (
    <main className="pb-16">
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

      {/* Courses Section */}
      <section className="page-wrap mt-16 px-4">
        <div className="mb-8 text-center">
          <span className="island-kicker mb-2">Academic Programs</span>
          <h2 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
            Explore Our Courses
          </h2>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
            Professional computer training courses tailored to build industry-ready skills.
          </p>
        </div>

        {isCoursesLoading ? (
          <div className="flex h-40 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        ) : !courses?.length ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-center p-6">
            <p className="text-sm font-medium text-[var(--sea-ink)]">No courses listed yet</p>
            <p className="text-xs text-[var(--sea-ink-soft)]">Check back later for curriculum updates</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, idx) => (
              <div
                key={course.id}
                className="island-shell rise-in flex flex-col justify-between rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300"
                style={{ animationDelay: `${idx * 80 + 100}ms` }}
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {course.courseCode}
                    </span>
                    <span className="text-xs text-[var(--sea-ink-soft)] font-medium">
                      Duration: {course.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--sea-ink)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {course.courseName}
                  </h3>

                  {course.subjects?.length > 0 && (
                    <div className="mt-4 border-t border-[var(--line)] pt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)] mb-2">
                        Syllabus / Subjects
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {course.subjects.map((sub) => (
                          <span
                            key={sub.id || sub.subjectName}
                            className="rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-2 py-0.5 text-[10px] text-[var(--sea-ink)] font-medium"
                          >
                            {sub.subjectName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Notices & Gallery Section */}
      <section className="page-wrap mt-16 px-4 grid gap-8 lg:grid-cols-12">
        {/* Notices Board (Left Column - 7/12 width) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="island-kicker mb-2">Announcements</span>
            <h2 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
              Important Notices
            </h2>
            <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
              Stay updated with academic schedules, course launches, and administrative updates.
            </p>
          </div>

          <div className="space-y-4">
            {isNoticesLoading ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            ) : !notices?.length ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-center p-6">
                <p className="text-sm font-medium text-[var(--sea-ink)]">No notices published yet</p>
                <p className="text-xs text-[var(--sea-ink-soft)]">Check back later for updates</p>
              </div>
            ) : (
              notices.slice(0, 3).map((notice, idx) => (
                <div
                  key={notice.id}
                  className="island-shell rise-in rounded-2xl p-5"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-semibold text-[var(--sea-ink)]">
                      {notice.title}
                    </h3>
                    <span className="shrink-0 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--sea-ink-soft)]">
                      {new Date(notice.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--sea-ink-soft)] whitespace-pre-line">
                    {notice.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Gallery (Right Column - 5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="island-kicker mb-2">Campus Life</span>
            <h2 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
              Photo Gallery
            </h2>
            <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
              A glimpse inside our training labs, events, and graduation ceremonies.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { src: '/images/computer_lab.png', title: 'Interactive Learning Labs', desc: 'Modern classrooms equipped with sleek tech systems' },
              { src: '/images/student_learning.png', title: 'Hands-on Projects', desc: 'Students mastering programming with real-world builds' },
              { src: '/images/graduation.png', title: 'Graduation Ceremonies', desc: 'Proud graduates earning computer diplomas and certificates' },
            ].map((img, i) => (
              <div
                key={img.title}
                className="island-shell overflow-hidden rounded-2xl p-0 group relative cursor-pointer shadow-md"
              >
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#173a40]/90 via-[#173a40]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-4">
                  <h4 className="text-sm font-bold text-white">{img.title}</h4>
                  <p className="text-[10px] text-emerald-100/90 mt-0.5">{img.desc}</p>
                </div>
              </div>
            ))}
          </div>
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

      {/* Testimonials Section */}
      <section className="page-wrap mt-16 px-4">
        <div className="mb-8 text-center">
          <span className="island-kicker mb-2">Reviews</span>
          <h2 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
            What Our Partners & Students Say
          </h2>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
            Read stories of transformation from our training center heads and graduated students.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote: "Managing enrollments and marks calculations used to take days of manual spreadsheet work. Since adopting CCMS, we process everything instantly.",
              author: "Sanjay Dutta",
              role: "Center Director, Kolkata Branch",
              avatar: "SD",
            },
            {
              quote: "The auto-grading and student ID generation features are incredibly helpful. It gives our franchise center a highly professional face.",
              author: "Priya Sharma",
              role: "Center Coordinator, Delhi North",
              avatar: "PS",
            },
            {
              quote: "The exam portal and student ID card verify functions made my experience seamless. I received my marksheet with zero delays.",
              author: "Rohan Gupta",
              role: "Graduated Student (DCA)",
              avatar: "RG",
            },
          ].map((t, idx) => (
            <div
              key={t.author}
              className="island-shell rise-in flex flex-col justify-between rounded-2xl p-6"
              style={{ animationDelay: `${idx * 80 + 100}ms` }}
            >
              <div>
                {/* Star Rating */}
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-500 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm italic leading-relaxed text-[var(--sea-ink-soft)]">
                  "{t.quote}"
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-[var(--line)] pt-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white shadow-sm">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--sea-ink)]">{t.author}</h4>
                  <p className="text-[10px] text-[var(--sea-ink-soft)]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
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
  );
}
