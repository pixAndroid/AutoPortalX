import { Page } from 'playwright'
import type { ExtractTextConfig } from '@autoflowx/common'

export async function extractText(page: Page, config: ExtractTextConfig): Promise<string> {
  const { selector, attribute } = config
  await page.waitForSelector(selector, { timeout: 10000 })
  if (attribute) {
    return await page.getAttribute(selector, attribute) || ''
  }
  return await page.textContent(selector) || ''
}
