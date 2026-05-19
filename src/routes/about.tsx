import { createFileRoute } from '@tanstack/react-router'
import { Shield, Zap, Users, BookOpen, Award, Building2 } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-10">
        <p className="island-kicker mb-2">About CCMS</p>
        <h1 className="display-title mb-4 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
          Powering computer institutes, digitally.
        </h1>
        <p className="mb-8 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          CCMS (Computer Course Management System) is a full-featured management platform designed 
          specifically for computer training institutes. It handles the complete student lifecycle — 
          from enrollment and course assignment to examination and graduation — with role-based 
          access for admins, centers, and students.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Users, title: 'Multi-Role Access', desc: 'Admin, Center, and Student roles with isolated permissions and workflows.' },
            { icon: BookOpen, title: 'Course Catalog', desc: 'Manage courses with subjects, marks allocation, and duration tracking.' },
            { icon: Shield, title: 'Secure Auth', desc: '2FA support, OTP verification, and session-based authentication.' },
            { icon: Building2, title: 'Center Network', desc: 'Franchise management with enquiry approval and credential generation.' },
            { icon: Award, title: 'Auto Grading', desc: 'Automated percentage and grade calculation following your grading scale.' },
            { icon: Zap, title: 'Modern Stack', desc: 'Built with TanStack Start, React Query, Zustand, and Tailwind CSS.' },
          ].map((item) => (
            <Card key={item.title} className="border-border/40 bg-[var(--surface)]">
              <CardContent className="p-5">
                <item.icon className="mb-3 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="mb-1 text-sm font-semibold text-[var(--sea-ink)]">{item.title}</h3>
                <p className="text-xs leading-relaxed text-[var(--sea-ink-soft)]">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
