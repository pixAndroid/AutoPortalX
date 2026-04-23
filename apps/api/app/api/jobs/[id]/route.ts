import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const job = await prisma.jobRun.findFirst({
      where: { id: params.id, companyId: ctx.companyId },
      include: {
        workflow: { select: { id: true, name: true, description: true } },
        stepLogs: { orderBy: { stepIndex: 'asc' } },
        fileAssets: { orderBy: { createdAt: 'desc' } },
      },
    })
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    return NextResponse.json({ job })
  })
}
