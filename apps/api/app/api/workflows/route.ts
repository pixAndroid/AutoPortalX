import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'
import { z } from 'zod'

const stepSchema = z.object({
  stepType: z.string(),
  config: z.record(z.unknown()).default({}),
  order: z.number().int(),
})

const createSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().optional(),
  steps: z.array(stepSchema).default([]),
})

export async function GET(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || '1')
    const pageSize = Number(searchParams.get('pageSize') || '20')
    const search = searchParams.get('search') || ''

    const where = {
      companyId: ctx.companyId,
      isActive: true,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    }

    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        where,
        include: {
          _count: { select: { jobRuns: true, schedules: true, workflowSteps: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.workflow.count({ where }),
    ])

    return NextResponse.json({ workflows, total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const body = createSchema.parse(await req.json())
    const workflow = await prisma.workflow.create({
      data: {
        companyId: ctx.companyId,
        name: body.name,
        description: body.description,
        steps: body.steps as any,
        workflowSteps: {
          create: body.steps.map((s) => ({
            stepType: s.stepType,
            config: s.config as any,
            order: s.order,
          })),
        },
      },
      include: { workflowSteps: true },
    })
    await prisma.workflowVersion.create({
      data: {
        workflowId: workflow.id,
        version: 1,
        steps: body.steps as any,
        createdBy: ctx.userId,
      },
    })
    await prisma.auditLog.create({
      data: {
        companyId: ctx.companyId,
        userId: ctx.userId,
        action: 'CREATE_WORKFLOW',
        resource: 'workflow',
        resourceId: workflow.id,
        details: { name: workflow.name },
      },
    })
    return NextResponse.json({ workflow }, { status: 201 })
  })
}
