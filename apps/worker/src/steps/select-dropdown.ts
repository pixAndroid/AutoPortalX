import { Page } from 'playwright'
import type { SelectDropdownConfig } from '@autoflowx/common'

export async function selectDropdown(page: Page, config: SelectDropdownConfig): Promise<void> {
  const { selector, value, byText = false } = config
  await page.waitForSelector(selector, { timeout: 10000 })
  if (byText) {
    await page.selectOption(selector, { label: value })
  } else {
    await page.selectOption(selector, { value })
  }
}
