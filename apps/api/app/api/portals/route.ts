import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'
import { encrypt, decrypt } from '@autoflowx/common'
import { z } from 'zod'

const createSchema = z.object({
  portalName: z.string().min(2),
  loginUrl: z.string().url(),
  username: z.string().min(1),
  password: z.string().min(1),
  notes: z.string().optional(),
  otpType: z.string().optional(),
})

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

export async function GET(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const portals = await prisma.portalAccount.findMany({
      where: { companyId: ctx.companyId, isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    const sanitized = portals.map(({ encryptedPassword, ...p }) => ({
      ...p,
      hasPassword: true,
    }))
    return NextResponse.json({ portals: sanitized })
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const body = createSchema.parse(await req.json())
    const encryptedPassword = encrypt(body.password, ENCRYPTION_KEY)
    const portal = await prisma.portalAccount.create({
      data: {
        companyId: ctx.companyId,
        portalName: body.portalName,
        loginUrl: body.loginUrl,
        username: body.username,
        encryptedPassword,
        notes: body.notes,
        otpType: body.otpType,
      },
    })
    const { encryptedPassword: _, ...sanitized } = portal
    return NextResponse.json({ portal: { ...sanitized, hasPassword: true } }, { status: 201 })
  })
}

export async function DELETE(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await prisma.portalAccount.update({
      where: { id, companyId: ctx.companyId },
      data: { isActive: false },
    })
    return NextResponse.json({ message: 'Portal deleted' })
  })
}
