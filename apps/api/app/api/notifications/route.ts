import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'

export async function GET(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const notifications = await prisma.notification.findMany({
      where: { userId: ctx.userId, ...(unreadOnly && { isRead: false }) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    const unreadCount = await prisma.notification.count({ where: { userId: ctx.userId, isRead: false } })
    return NextResponse.json({ notifications, unreadCount })
  })
}

export async function PATCH(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    const body = await req.json()
    const { ids, markAll } = body
    if (markAll) {
      await prisma.notification.updateMany({ where: { userId: ctx.userId, isRead: false }, data: { isRead: true } })
    } else if (ids && Array.isArray(ids)) {
      await prisma.notification.updateMany({ where: { id: { in: ids }, userId: ctx.userId }, data: { isRead: true } })
    }
    return NextResponse.json({ message: 'Notifications updated' })
  })
}
