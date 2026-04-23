import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'
import { UserRole } from '@autoflowx/common'
import { z } from 'zod'

const createSchema = z.object({
  name: z.string().min(2).max(100),
  timezone: z.string().default('UTC'),
  notificationEmail: z.string().email().optional(),
})

export async function GET(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (ctx.role === UserRole.SUPER_ADMIN) {
      const companies = await prisma.company.findMany({
        include: { _count: { select: { users: true, workflows: true, jobRuns: true } } },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ companies })
    }
    if (!ctx.companyId) return NextResponse.json({ error: 'No company associated' }, { status: 400 })
    const company = await prisma.company.findUnique({
      where: { id: ctx.companyId },
      include: { _count: { select: { users: true, workflows: true, jobRuns: true } } },
    })
    return NextResponse.json({ company })
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    const body = createSchema.parse(await req.json())
    const company = await prisma.company.create({
      data: { ...body },
    })
    await prisma.membership.create({
      data: { userId: ctx.userId, companyId: company.id, role: 'OWNER' },
    })
    await prisma.user.update({
      where: { id: ctx.userId },
      data: { companyId: company.id },
    })
    return NextResponse.json({ company }, { status: 201 })
  })
}
