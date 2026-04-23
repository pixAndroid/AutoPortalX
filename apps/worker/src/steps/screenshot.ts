import { Page } from 'playwright'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@autoflowx/db'
import { getScreenshotDir } from '../utils/file-handler'
import type { ScreenshotConfig } from '@autoflowx/common'

export async function takeScreenshot(page: Page, config: ScreenshotConfig, jobRunId: string): Promise<string> {
  const { fullPage = false, selector } = config
  const jobRun = await prisma.jobRun.findUnique({ where: { id: jobRunId } })
  if (!jobRun) throw new Error('Job run not found')

  const screenshotDir = getScreenshotDir(jobRun.companyId, jobRunId)
  const filename = `screenshot_${uuidv4()}.png`
  const filePath = join(screenshotDir, filename)

  if (selector) {
    const element = await page.$(selector)
    if (element) await element.screenshot({ path: filePath })
    else await page.screenshot({ path: filePath, fullPage })
  } else {
    await page.screenshot({ path: filePath, fullPage })
  }

  const { stat } = await import('fs/promises')
  const stats = await stat(filePath)
  await prisma.fileAsset.create({
    data: {
      companyId: jobRun.companyId,
      jobRunId,
      filename,
      originalName: filename,
      mimeType: 'image/png',
      size: stats.size,
      storageKey: `${jobRun.companyId}/screenshots/${jobRunId}/${filename}`,
    },
  })
  return filePath
}
