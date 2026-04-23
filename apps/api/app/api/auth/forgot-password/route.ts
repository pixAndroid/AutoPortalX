import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, hashToken } from '@autoflowx/common'
import { sendPasswordResetEmail } from '@/lib/email'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  try {
    const { email } = schema.parse(await req.json())
    const user = await prisma.user.findUnique({ where: { email } })

    if (user && user.isActive) {
      const token = generateToken(32)
      const tokenHash = hashToken(token)
      await prisma.auditLog.create({
        data: {
          companyId: user.companyId || 'system',
          userId: user.id,
          action: 'PASSWORD_RESET_REQUEST',
          resource: 'user',
          resourceId: user.id,
          details: { tokenHash, expiresAt: new Date(Date.now() + 3600000).toISOString() },
        },
      })
      await sendPasswordResetEmail(email, token).catch(console.error)
    }

    return NextResponse.json({
      message: 'If an account exists with that email, a reset link has been sent.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
