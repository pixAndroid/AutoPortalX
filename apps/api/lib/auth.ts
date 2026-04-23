import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import type { JWTPayload } from '@autoflowx/common'

const JWT_SECRET = process.env.JWT_SECRET!
const COOKIE_NAME = 'autoflowx_token'

export function signToken(payload: JWTPayload): string {
  const { iat, exp, ...cleanPayload } = payload
  return jwt.sign(cleanPayload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}
