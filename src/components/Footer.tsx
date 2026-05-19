import { GraduationCap } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
            <GraduationCap className="h-3.5 w-3.5 text-white" />
          </div>
          <p className="m-0 text-sm">
            &copy; {year} CCMS. All rights reserved.
          </p>
        </div>
        <p className="island-kicker m-0">Computer Course Management System</p>
      </div>
    </footer>
  )
}
