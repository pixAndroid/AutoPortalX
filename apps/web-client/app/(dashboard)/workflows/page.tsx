'use client'
import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Plus, Play, Pencil, Trash2, GitBranch } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => api.workflows.list().then((d: any) => setWorkflows(d.workflows || [])).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  async function handleRun(id: string) {
    try { await api.workflows.run(id); toast.success('Workflow triggered!') }
    catch (e: any) { toast.error(e.message) }
  }
  async function handleDelete(id: string) {
    if (!confirm('Delete this workflow?')) return
    try { await api.workflows.delete(id); load(); toast.success('Deleted') }
    catch (e: any) { toast.error(e.message) }
  }

  return (
    <div>
      <Header title="Workflows" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">{workflows.length} workflows</p>
          <Link href="/workflows/new/builder" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> New Workflow
          </Link>
        </div>
        {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> :
          workflows.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-white dark:bg-slate-800">
              <GitBranch className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium mb-1">No workflows yet</p>
              <p className="text-sm text-muted-foreground mb-4">Create your first workflow to get started</p>
              <Link href="/workflows/new/builder" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                <Plus className="w-4 h-4" /> Create Workflow
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {workflows.map((w: any) => (
                <div key={w.id} className="bg-white dark:bg-slate-800 border rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{w.name}</h3>
                    {w.description && <p className="text-sm text-muted-foreground mt-0.5">{w.description}</p>}
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{w._count?.workflowSteps || 0} steps</span>
                      <span>{w._count?.jobRuns || 0} runs</span>
                      <span>Updated {format(new Date(w.updatedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRun(w.id)} className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"><Play className="w-4 h-4" /></button>
                    <Link href={`/workflows/${w.id}/builder`} className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"><Pencil className="w-4 h-4" /></Link>
                    <button onClick={() => handleDelete(w.id)} className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}
