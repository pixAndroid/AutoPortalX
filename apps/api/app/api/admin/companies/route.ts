import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'
import { UserRole } from '@autoflowx/common'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || '1')
    const pageSize = Number(searchParams.get('pageSize') || '20')
    const search = searchParams.get('search') || ''

    const where: any = {}
    if (search) where.name = { contains: search, mode: 'insensitive' }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          _count: { select: { users: true, workflows: true, jobRuns: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.company.count({ where }),
    ])
    return NextResponse.json({ companies, total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
  }, UserRole.SUPER_ADMIN)
}

export async function PATCH(req: NextRequest) {
  return withAuth(req, async () => {
    const { id, isActive } = await req.json()
    const company = await prisma.company.update({ where: { id }, data: { isActive } })
    return NextResponse.json({ company })
  }, UserRole.SUPER_ADMIN)
}
