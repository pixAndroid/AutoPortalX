import { Page } from 'playwright'
import type { FillInputConfig } from '@autoflowx/common'

export async function fillInput(page: Page, config: FillInputConfig): Promise<void> {
  const { selector, value, clearFirst = true } = config
  await page.waitForSelector(selector, { timeout: 10000 })
  if (clearFirst) await page.fill(selector, '')
  await page.fill(selector, value)
}
