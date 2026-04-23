import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'
import { UserRole } from '@autoflowx/common'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const workers = await prisma.workerNode.findMany({ orderBy: { lastHeartbeat: 'desc' } })
    return NextResponse.json({ workers })
  }, UserRole.SUPER_ADMIN)
}
