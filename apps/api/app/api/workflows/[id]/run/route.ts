import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'
import { enqueueWorkflow } from '@/lib/queue'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const workflow = await prisma.workflow.findFirst({
      where: { id: params.id, companyId: ctx.companyId, isActive: true },
    })
    if (!workflow) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })

    const jobRun = await prisma.jobRun.create({
      data: {
        workflowId: params.id,
        companyId: ctx.companyId,
        status: 'PENDING',
        triggerSource: 'MANUAL',
      },
    })

    await enqueueWorkflow(params.id, ctx.companyId, 'MANUAL')
    await prisma.auditLog.create({
      data: {
        companyId: ctx.companyId,
        userId: ctx.userId,
        action: 'TRIGGER_WORKFLOW',
        resource: 'workflow',
        resourceId: params.id,
        details: { jobRunId: jobRun.id },
      },
    })
    return NextResponse.json({ jobRun }, { status: 202 })
  })
}
