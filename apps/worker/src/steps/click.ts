import { Page } from 'playwright'
import type { ClickConfig } from '@autoflowx/common'

export async function clickElement(page: Page, config: ClickConfig): Promise<void> {
  const { selector, waitAfter = 0 } = config
  await page.waitForSelector(selector, { timeout: 10000 })
  await page.click(selector)
  if (waitAfter > 0) await page.waitForTimeout(waitAfter)
}
