'use client'
import { useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.auth.forgotPassword(email)
      setSent(true)
      toast.success('Reset link sent if account exists')
    } catch { toast.error('Failed to send reset email') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-lg border p-8">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        {sent ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">Check your email for a reset link.</p>
            <Link href="/login" className="text-blue-600 hover:underline text-sm">Back to login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@company.com" />
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <Link href="/login" className="block text-center text-sm text-muted-foreground hover:underline">Back to login</Link>
          </form>
        )}
      </div>
    </div>
  )
}
