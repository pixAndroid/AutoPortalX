import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  steps: z.array(z.object({
    stepType: z.string(),
    config: z.record(z.unknown()).default({}),
    order: z.number().int(),
  })).optional(),
})

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const workflow = await prisma.workflow.findFirst({
      where: { id: params.id, companyId: ctx.companyId },
      include: {
        workflowSteps: { where: { isActive: true }, orderBy: { order: 'asc' } },
        schedules: { where: { isActive: true } },
        _count: { select: { jobRuns: true } },
      },
    })
    if (!workflow) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    return NextResponse.json({ workflow })
  })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const body = updateSchema.parse(await req.json())
    const existing = await prisma.workflow.findFirst({ where: { id: params.id, companyId: ctx.companyId } })
    if (!existing) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })

    const { steps, ...rest } = body
    const workflow = await prisma.workflow.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(steps && { steps: steps as any }),
      },
    })

    if (steps) {
      await prisma.workflowStep.updateMany({ where: { workflowId: params.id }, data: { isActive: false } })
      await prisma.workflowStep.createMany({
        data: steps.map((s) => ({ workflowId: params.id, stepType: s.stepType, config: s.config as any, order: s.order })),
      })
      const lastVersion = await prisma.workflowVersion.findFirst({
        where: { workflowId: params.id },
        orderBy: { version: 'desc' },
      })
      await prisma.workflowVersion.create({
        data: {
          workflowId: params.id,
          version: (lastVersion?.version || 0) + 1,
          steps: steps as any,
          createdBy: ctx.userId,
        },
      })
    }
    return NextResponse.json({ workflow })
  })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    await prisma.workflow.updateMany({
      where: { id: params.id, companyId: ctx.companyId },
      data: { isActive: false },
    })
    return NextResponse.json({ message: 'Workflow deleted' })
  })
}
