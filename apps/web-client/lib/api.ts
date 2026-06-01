const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`)
  return data
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),
    me: () => request('/api/auth/me'),
    forgotPassword: (email: string) =>
      request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  },
  companies: {
    get: () => request('/api/companies'),
    create: (data: { name: string; timezone?: string; notificationEmail?: string }) =>
      request('/api/companies', { method: 'POST', body: JSON.stringify(data) }),
  },
  team: {
    list: () => request('/api/team'),
    invite: (data: { email: string; name: string; role?: string }) =>
      request('/api/team', { method: 'POST', body: JSON.stringify(data) }),
    updateRole: (userId: string, role: string) =>
      request('/api/team', { method: 'PATCH', body: JSON.stringify({ userId, role }) }),
  },
  portals: {
    list: () => request('/api/portals'),
    create: (data: any) => request('/api/portals', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/api/portals?id=${id}`, { method: 'DELETE' }),
  },
  workflows: {
    list: (params?: { page?: number; search?: string }) => {
      const qs = new URLSearchParams(params as any).toString()
      return request(`/api/workflows${qs ? `?${qs}` : ''}`)
    },
    get: (id: string) => request(`/api/workflows/${id}`),
    create: (data: any) => request('/api/workflows', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request(`/api/workflows/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/api/workflows/${id}`, { method: 'DELETE' }),
    run: (id: string) => request(`/api/workflows/${id}/run`, { method: 'POST' }),
  },
  schedules: {
    list: () => request('/api/schedules'),
    create: (data: any) => request('/api/schedules', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/api/schedules?id=${id}`, { method: 'DELETE' }),
  },
  jobs: {
    list: (params?: { page?: number; status?: string; workflowId?: string }) => {
      const qs = new URLSearchParams(params as any).toString()
      return request(`/api/jobs${qs ? `?${qs}` : ''}`)
    },
    get: (id: string) => request(`/api/jobs/${id}`),
    cancel: (id: string) => request(`/api/jobs/${id}/cancel`, { method: 'POST' }),
  },
  files: {
    list: (params?: { page?: number }) => {
      const qs = new URLSearchParams(params as any).toString()
      return request(`/api/files${qs ? `?${qs}` : ''}`)
    },
    upload: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${API_URL}/api/files`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      return data
    },
    delete: (id: string) => request(`/api/files?id=${id}`, { method: 'DELETE' }),
  },
  notifications: {
    list: (unreadOnly?: boolean) => request(`/api/notifications${unreadOnly ? '?unread=true' : ''}`),
    markRead: (ids?: string[], markAll?: boolean) =>
      request('/api/notifications', { method: 'PATCH', body: JSON.stringify({ ids, markAll }) }),
  },
  auditLogs: {
    list: (params?: { page?: number; action?: string; resource?: string }) => {
      const qs = new URLSearchParams(params as any).toString()
      return request(`/api/audit-logs${qs ? `?${qs}` : ''}`)
    },
  },
}
