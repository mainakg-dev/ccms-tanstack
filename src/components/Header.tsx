import { Link } from '@tanstack/react-router'
import { GraduationCap } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { Button } from './ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-teal-600">
              <GraduationCap className="h-3 w-3 text-white" />
            </div>
            CCMS
          </Link>
        </h2>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-none sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            About
          </Link>
          <Link
            to="/enquiry"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Franchise Enquiry
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
