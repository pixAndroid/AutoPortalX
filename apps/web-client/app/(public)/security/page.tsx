import Link from 'next/link'
import { ArrowLeft, Lock, Shield, Eye, FileText } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="flex items-center gap-4 px-8 py-4 border-b">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </nav>
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Security</h1>
        <p className="text-muted-foreground text-lg mb-12">AutoFlowX is built with enterprise security at its core.</p>
        <div className="space-y-6">
          {[
            { icon: <Lock className="w-6 h-6" />, title: 'AES-256-GCM Encryption', desc: 'All portal credentials are encrypted with AES-256-GCM using scrypt key derivation before storage. Keys are never stored in plaintext.' },
            { icon: <Shield className="w-6 h-6" />, title: 'Role-Based Access Control', desc: 'Granular RBAC with Super Admin, Admin, Member, and Viewer roles. Fine-grained permissions per resource.' },
            { icon: <Eye className="w-6 h-6" />, title: 'Full Audit Logging', desc: 'Every action is logged with user, timestamp, IP address, and full details for compliance requirements.' },
            { icon: <FileText className="w-6 h-6" />, title: 'Secure Authentication', desc: 'JWT tokens stored in httpOnly secure cookies. No localStorage token storage. CSRF protection via SameSite cookies.' },
          ].map((s, i) => (
            <div key={i} className="flex gap-6 p-6 bg-white dark:bg-slate-800 border rounded-xl">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">{s.icon}</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
