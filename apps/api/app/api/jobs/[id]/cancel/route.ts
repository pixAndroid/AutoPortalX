import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const job = await prisma.jobRun.findFirst({
      where: { id: params.id, companyId: ctx.companyId },
    })
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    if (!['PENDING', 'RUNNING'].includes(job.status)) {
      return NextResponse.json({ error: 'Job cannot be cancelled' }, { status: 400 })
    }
    const updated = await prisma.jobRun.update({
      where: { id: params.id },
      data: { status: 'CANCELLED', completedAt: new Date() },
    })
    return NextResponse.json({ job: updated })
  })
}
