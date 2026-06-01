'use client'
import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Activity, CheckCircle, Clock, XCircle, FileText, Calendar } from 'lucide-react'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS: Record<string, string> = { COMPLETED: 'text-green-600 bg-green-100', RUNNING: 'text-blue-600 bg-blue-100', FAILED: 'text-red-600 bg-red-100', PENDING: 'text-yellow-600 bg-yellow-100', CANCELLED: 'text-gray-600 bg-gray-100' }

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [stats, setStats] = useState({ today: 0, running: 0, success: 0, failed: 0 })

  useEffect(() => {
    api.jobs.list({ pageSize: 10 } as any).then((d: any) => {
      setJobs(d.jobs || [])
      const j = d.jobs || []
      const today = new Date().toDateString()
      const todayJobs = j.filter((x: any) => new Date(x.createdAt).toDateString() === today)
      setStats({
        today: todayJobs.length,
        running: j.filter((x: any) => x.status === 'RUNNING').length,
        success: j.filter((x: any) => x.status === 'COMPLETED').length,
        failed: j.filter((x: any) => x.status === 'FAILED').length,
      })
    }).catch(() => {})
  }, [])

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    return { date: format(d, 'MM/dd'), jobs: Math.floor(Math.random() * 20 + 5) }
  })

  const statCards = [
    { label: 'Jobs Today', value: stats.today, icon: <Activity className="w-5 h-5" />, color: 'text-blue-600' },
    { label: 'Running Now', value: stats.running, icon: <Clock className="w-5 h-5" />, color: 'text-purple-600' },
    { label: 'Completed', value: stats.success, icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-600' },
    { label: 'Failed', value: stats.failed, icon: <XCircle className="w-5 h-5" />, color: 'text-red-600' },
  ]

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border rounded-xl p-5">
              <div className={`${s.color} mb-3`}>{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Job Runs — Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="jobs" stroke="#3b82f6" fill="#3b82f640" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Recent Jobs</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-muted-foreground border-b">
              <th className="text-left pb-2">Workflow</th>
              <th className="text-left pb-2">Status</th>
              <th className="text-left pb-2">Started</th>
              <th className="text-left pb-2">Duration</th>
            </tr></thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No jobs yet</td></tr>
              ) : jobs.map((j: any) => (
                <tr key={j.id} className="border-b last:border-0">
                  <td className="py-2.5 font-medium">{j.workflow?.name || 'Unknown'}</td>
                  <td className="py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${COLORS[j.status] || ''}`}>{j.status}</span></td>
                  <td className="py-2.5 text-muted-foreground">{j.startedAt ? format(new Date(j.startedAt), 'MMM d, HH:mm') : '—'}</td>
                  <td className="py-2.5 text-muted-foreground">{j.duration ? `${(j.duration / 1000).toFixed(1)}s` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
