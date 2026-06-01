import { Page } from 'playwright'
import { prisma } from '@autoflowx/db'
import { decrypt } from '@autoflowx/common'
import type { LoginConfig } from '@autoflowx/common'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

export async function login(page: Page, config: LoginConfig): Promise<void> {
  const { usernameSelector, passwordSelector, submitSelector, portalAccountId } = config
  let username = config.username
  let password = config.password

  if (portalAccountId) {
    const portal = await prisma.portalAccount.findUnique({ where: { id: portalAccountId } })
    if (!portal) throw new Error(`Portal account ${portalAccountId} not found`)
    username = portal.username
    password = decrypt(portal.encryptedPassword, ENCRYPTION_KEY)
  }

  if (!username || !password) throw new Error('Username and password are required for LOGIN step')

  await page.waitForSelector(usernameSelector, { timeout: 10000 })
  await page.fill(usernameSelector, username)
  await page.fill(passwordSelector, password)
  await page.click(submitSelector)
  await page.waitForLoadState('networkidle', { timeout: 15000 })
}
