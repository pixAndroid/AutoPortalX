import Link from 'next/link'
import { Zap, Shield, Clock, BarChart2, GitBranch, Globe, ArrowLeft, Check } from 'lucide-react'

export default function FeaturesPage() {
  const stepTypes = [
    'Open URL', 'Login to Portal', 'Fill Form Fields', 'Click Elements',
    'Select Dropdowns', 'Upload Files', 'Download Files', 'Wait for Elements',
    'Extract Text', 'Take Screenshots', 'Send Emails', 'HTTP Webhooks',
  ]
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="flex items-center gap-4 px-8 py-4 border-b">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </nav>
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Platform Features</h1>
        <p className="text-muted-foreground text-lg mb-12">Everything you need to build and manage enterprise-grade automation workflows.</p>

        <h2 className="text-2xl font-semibold mb-6">12 Built-in Step Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
          {stepTypes.map((s, i) => (
            <div key={i} className="flex items-center gap-2 bg-white dark:bg-slate-800 border rounded-lg px-4 py-3 text-sm">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              {s}
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {[
            { icon: <GitBranch className="w-6 h-6" />, title: 'Visual Workflow Builder', desc: 'Drag-and-drop interface to build complex multi-step workflows without writing code. Version control built in.' },
            { icon: <Shield className="w-6 h-6" />, title: 'Enterprise Security', desc: 'All portal credentials encrypted with AES-256-GCM. Role-based access control (RBAC) with granular permissions. Full audit logging.' },
            { icon: <Clock className="w-6 h-6" />, title: 'Flexible Scheduling', desc: 'Schedule workflows with cron expressions or one-time runs. Timezone-aware scheduling across global teams.' },
            { icon: <BarChart2 className="w-6 h-6" />, title: 'Real-time Monitoring', desc: 'Live job monitoring with step-by-step execution logs, screenshots, and instant failure notifications.' },
          ].map((f, i) => (
            <div key={i} className="flex gap-6 p-6 bg-white dark:bg-slate-800 border rounded-xl">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">{f.icon}</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
