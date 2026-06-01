'use client'
import { useRouter } from 'next/navigation'
import { Bell, LogOut, Moon, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export function Header({ title }: { title?: string }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  async function handleLogout() {
    try { await api.auth.logout() } catch {}
    router.push('/login')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background">
      <h1 className="text-lg font-semibold">{title || 'Dashboard'}</h1>
      <div className="flex items-center gap-2">
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-muted transition-colors">
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => router.push('/notifications')}>
          <Bell className="w-4 h-4" />
        </button>
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-muted transition-colors text-red-500">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
