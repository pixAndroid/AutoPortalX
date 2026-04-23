'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, GitBranch, Clock, Activity, Radio, FileText, KeyRound, Users, BarChart2, Shield, Bell, Settings, Zap } from 'lucide-react'
import { cn } from '@autoflowx/ui'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/workflows', icon: GitBranch, label: 'Workflows' },
  { href: '/schedules', icon: Clock, label: 'Schedules' },
  { href: '/jobs', icon: Activity, label: 'Jobs' },
  { href: '/jobs/live', icon: Radio, label: 'Live Monitor' },
  { href: '/files', icon: FileText, label: 'Files' },
  { href: '/portals', icon: KeyRound, label: 'Portals' },
  { href: '/team', icon: Users, label: 'Team' },
  { href: '/reports', icon: BarChart2, label: 'Reports' },
  { href: '/audit', icon: Shield, label: 'Audit Log' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const path = usePathname()
  return (
    <aside className="flex flex-col w-64 bg-slate-900 text-white h-full min-h-screen">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5" />
        </div>
        <span className="font-bold text-lg">AutoFlowX</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              path === href || path.startsWith(href + '/')
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-white/10 hover:text-white')}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
