'use client'
import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { api } from '@/lib/api'
import Link from 'next/link'
import { format } from 'date-fns'
import { XCircle } from 'lucide-react'
import { toast } from 'sonner'

const STATUS_COLORS: Record<string, string> = { COMPLETED: 'bg-green-100 text-green-700', RUNNING: 'bg-blue-100 text-blue-700', FAILED: 'bg-red-100 text-red-700', PENDING: 'bg-yellow-100 text-yellow-700', CANCELLED: 'bg-gray-100 text-gray-700' }

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => api.jobs.list().then((d: any) => setJobs(d.jobs || [])).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  async function cancel(id: string) {
    try { await api.jobs.cancel(id); load(); toast.success('Job cancelled') }
    catch (e: any) { toast.error(e.message) }
  }

  return (
    <div>
      <Header title="Jobs" />
      <div className="p-6">
        {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="bg-white dark:bg-slate-800 border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50"><tr>
                <th className="text-left p-4">Workflow</th><th className="text-left p-4">Status</th>
                <th className="text-left p-4">Trigger</th><th className="text-left p-4">Started</th>
                <th className="text-left p-4">Duration</th><th className="text-left p-4">Actions</th>
              </tr></thead>
              <tbody>
                {jobs.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No jobs found</td></tr>
                  : jobs.map((j: any) => (
                    <tr key={j.id} className="border-t hover:bg-muted/30">
                      <td className="p-4"><Link href={`/jobs/${j.id}`} className="font-medium hover:underline text-blue-600">{j.workflow?.name}</Link></td>
                      <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[j.status]}`}>{j.status}</span></td>
                      <td className="p-4 text-muted-foreground">{j.triggerSource}</td>
                      <td className="p-4 text-muted-foreground">{j.startedAt ? format(new Date(j.startedAt), 'MMM d, HH:mm') : '—'}</td>
                      <td className="p-4 text-muted-foreground">{j.duration ? `${(j.duration / 1000).toFixed(1)}s` : '—'}</td>
                      <td className="p-4">
                        {['PENDING', 'RUNNING'].includes(j.status) && (
                          <button onClick={() => cancel(j.id)} className="text-red-600 hover:bg-red-100 p-1.5 rounded"><XCircle className="w-4 h-4" /></button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
