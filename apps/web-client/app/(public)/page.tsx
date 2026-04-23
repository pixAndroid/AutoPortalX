import Link from 'next/link'
import { ArrowRight, Zap, Shield, Clock, BarChart2, GitBranch, Globe } from 'lucide-react'

export default function LandingPage() {
  const features = [
    { icon: <Zap className="w-6 h-6 text-blue-500" />, title: 'Smart Automation', desc: 'Automate repetitive portal tasks with our no-code workflow builder.' },
    { icon: <Shield className="w-6 h-6 text-green-500" />, title: 'Enterprise Security', desc: 'AES-256-GCM encrypted credentials, RBAC, and full audit trails.' },
    { icon: <Clock className="w-6 h-6 text-purple-500" />, title: 'Scheduled Runs', desc: 'Run workflows on any schedule with cron expression support.' },
    { icon: <BarChart2 className="w-6 h-6 text-orange-500" />, title: 'Real-time Monitoring', desc: 'Live job monitoring, step-by-step logs, and instant alerts.' },
    { icon: <GitBranch className="w-6 h-6 text-pink-500" />, title: 'Visual Builder', desc: 'Drag-and-drop workflow builder with 12+ built-in step types.' },
    { icon: <Globe className="w-6 h-6 text-cyan-500" />, title: 'Multi-tenant', desc: 'Manage multiple companies and teams from a single platform.' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">AutoFlowX</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</Link>
          <Link href="/security" className="text-sm text-slate-300 hover:text-white transition-colors">Security</Link>
          <Link href="/contact" className="text-sm text-slate-300 hover:text-white transition-colors">Contact</Link>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-8 py-24 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-8">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          Enterprise Automation Platform
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
          Automate Any Portal.<br />At Scale.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mb-10">
          AutoFlowX lets your team automate complex web portal workflows with a visual drag-and-drop builder,
          encrypted credential storage, and real-time job monitoring.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/login" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/features" className="flex items-center gap-2 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5 transition-colors">
            See Features
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to automate at scale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-8">
          {[
            { value: '10M+', label: 'Jobs Processed' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '500+', label: 'Enterprise Clients' },
            { value: '<2s', label: 'Avg Start Time' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-blue-400">{s.value}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-8 py-24">
        <h2 className="text-4xl font-bold mb-4">Ready to automate?</h2>
        <p className="text-slate-400 mb-8">Join hundreds of enterprises using AutoFlowX to streamline operations.</p>
        <Link href="/login" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors">
          Start for Free <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-8 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} AutoFlowX. All rights reserved.
      </footer>
    </div>
  )
}
