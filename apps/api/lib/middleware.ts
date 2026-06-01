import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from './auth'
import { UserRole } from '@autoflowx/common'

export type AuthContext = {
  userId: string
  email: string
  role: UserRole
  companyId: string | null
}

export async function withAuth(
  _req: NextRequest,
  handler: (ctx: AuthContext) => Promise<NextResponse>,
  requiredRole?: UserRole
): Promise<NextResponse> {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (requiredRole && !hasPermission(user.role as UserRole, requiredRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return handler(user as AuthContext)
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy = [UserRole.MEMBER, UserRole.ADMIN, UserRole.SUPER_ADMIN]
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole)
}
