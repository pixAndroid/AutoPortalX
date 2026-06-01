import { Page } from 'playwright'
import { existsSync } from 'fs'
import type { UploadFileConfig } from '@autoflowx/common'

export async function uploadFile(page: Page, config: UploadFileConfig): Promise<void> {
  const { selector, filePath } = config
  if (!existsSync(filePath)) throw new Error(`File not found: ${filePath}`)
  const fileInput = await page.waitForSelector(selector, { timeout: 10000 })
  await fileInput!.setInputFiles(filePath)
}
