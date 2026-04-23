import { Page } from 'playwright'
import type { WaitSelectorConfig } from '@autoflowx/common'

export async function waitSelector(page: Page, config: WaitSelectorConfig): Promise<void> {
  const { selector, timeout = 30000, state = 'visible' } = config
  await page.waitForSelector(selector, { timeout, state })
}
