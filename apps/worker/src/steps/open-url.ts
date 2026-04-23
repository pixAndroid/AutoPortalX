import { Page } from 'playwright'
import type { OpenUrlConfig } from '@autoflowx/common'

export async function openUrl(page: Page, config: OpenUrlConfig): Promise<void> {
  const { url, waitUntil = 'networkidle' } = config
  if (!url) throw new Error('URL is required for OPEN_URL step')
  await page.goto(url, { waitUntil, timeout: 30000 })
}
