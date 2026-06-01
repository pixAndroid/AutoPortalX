import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'
import { z } from 'zod'

const createSchema = z.object({
  workflowId: z.string(),
  scheduleType: z.enum(['ONCE', 'RECURRING']).default('RECURRING'),
  cronExpr: z.string().optional(),
  timezone: z.string().default('UTC'),
  nextRun: z.string().datetime().optional(),
})

export async function GET(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const schedules = await prisma.schedule.findMany({
      where: { companyId: ctx.companyId, isActive: true },
      include: { workflow: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ schedules })
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const body = createSchema.parse(await req.json())
    const workflow = await prisma.workflow.findFirst({
      where: { id: body.workflowId, companyId: ctx.companyId },
    })
    if (!workflow) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    const schedule = await prisma.schedule.create({
      data: {
        workflowId: body.workflowId,
        companyId: ctx.companyId,
        scheduleType: body.scheduleType,
        cronExpr: body.cronExpr,
        timezone: body.timezone,
        nextRun: body.nextRun ? new Date(body.nextRun) : undefined,
      },
      include: { workflow: { select: { id: true, name: true } } },
    })
    return NextResponse.json({ schedule }, { status: 201 })
  })
}

export async function DELETE(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await prisma.schedule.updateMany({
      where: { id, companyId: ctx.companyId },
      data: { isActive: false },
    })
    return NextResponse.json({ message: 'Schedule deleted' })
  })
}
