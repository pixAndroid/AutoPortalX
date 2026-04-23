import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).default('MEMBER'),
})

const updateSchema = z.object({
  userId: z.string(),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
})

export async function GET(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const members = await prisma.membership.findMany({
      where: { companyId: ctx.companyId, isActive: true },
      include: { user: { select: { id: true, email: true, name: true, role: true, createdAt: true } } },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ members })
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const body = inviteSchema.parse(await req.json())
    let user = await prisma.user.findUnique({ where: { email: body.email } })
    if (!user) {
      const bcrypt = await import('bcryptjs')
      const tempPassword = Math.random().toString(36).slice(-10)
      const passwordHash = await bcrypt.hash(tempPassword, 10)
      user = await prisma.user.create({
        data: { email: body.email, name: body.name, passwordHash, role: 'MEMBER', companyId: ctx.companyId },
      })
    }
    const existing = await prisma.membership.findUnique({
      where: { userId_companyId: { userId: user.id, companyId: ctx.companyId } },
    })
    if (existing) return NextResponse.json({ error: 'User already a member' }, { status: 400 })
    const membership = await prisma.membership.create({
      data: { userId: user.id, companyId: ctx.companyId, role: body.role as any },
      include: { user: { select: { id: true, email: true, name: true } } },
    })
    await prisma.notification.create({
      data: {
        userId: user.id,
        companyId: ctx.companyId,
        type: 'TEAM_INVITE',
        title: 'Team Invitation',
        message: `You have been invited to join the team.`,
      },
    })
    return NextResponse.json({ membership }, { status: 201 })
  })
}

export async function PATCH(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const { userId, role } = updateSchema.parse(await req.json())
    const membership = await prisma.membership.update({
      where: { userId_companyId: { userId, companyId: ctx.companyId } },
      data: { role: role as any },
      include: { user: { select: { id: true, email: true, name: true } } },
    })
    return NextResponse.json({ membership })
  })
}
