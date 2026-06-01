import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'

export async function GET(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || '1')
    const pageSize = Number(searchParams.get('pageSize') || '20')
    const status = searchParams.get('status')
    const workflowId = searchParams.get('workflowId')

    const where: any = { companyId: ctx.companyId }
    if (status) where.status = status
    if (workflowId) where.workflowId = workflowId

    const [jobs, total] = await Promise.all([
      prisma.jobRun.findMany({
        where,
        include: {
          workflow: { select: { id: true, name: true } },
          _count: { select: { stepLogs: true, fileAssets: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.jobRun.count({ where }),
    ])

    return NextResponse.json({ jobs, total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
  })
}
