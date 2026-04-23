import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'
import { UserRole } from '@autoflowx/common'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const [totalCompanies, totalUsers, totalWorkflows, totalJobs, recentJobs] = await Promise.all([
      prisma.company.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.workflow.count({ where: { isActive: true } }),
      prisma.jobRun.count(),
      prisma.jobRun.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { workflow: { select: { name: true } }, company: { select: { name: true } } },
      }),
    ])
    const jobStats = await prisma.jobRun.groupBy({
      by: ['status'],
      _count: { status: true },
    })
    return NextResponse.json({
      stats: { totalCompanies, totalUsers, totalWorkflows, totalJobs },
      jobStats,
      recentJobs,
    })
  }, UserRole.SUPER_ADMIN)
}
