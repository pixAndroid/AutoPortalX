import { Page } from 'playwright'
import { join } from 'path'
import { prisma } from '@autoflowx/db'
import { getDownloadDir } from '../utils/file-handler'
import type { DownloadFileConfig } from '@autoflowx/common'

export async function downloadFile(page: Page, config: DownloadFileConfig, jobRunId: string): Promise<void> {
  const { selector, url, filename } = config
  const jobRun = await prisma.jobRun.findUnique({ where: { id: jobRunId } })
  if (!jobRun) throw new Error('Job run not found')

  const downloadDir = getDownloadDir(jobRun.companyId, jobRunId)

  if (url) {
    const axios = await import('axios')
    const response = await axios.default.get(url, { responseType: 'arraybuffer' })
    const name = filename || url.split('/').pop() || 'download'
    const filePath = join(downloadDir, name)
    const { writeFile } = await import('fs/promises')
    await writeFile(filePath, Buffer.from(response.data))
    const mimeType = response.headers['content-type'] || 'application/octet-stream'
    await prisma.fileAsset.create({
      data: {
        companyId: jobRun.companyId,
        jobRunId,
        filename: name,
        originalName: name,
        mimeType,
        size: Buffer.from(response.data).length,
        storageKey: `${jobRun.companyId}/downloads/${jobRunId}/${name}`,
      },
    })
  } else if (selector) {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click(selector),
    ])
    const suggestedFilename = download.suggestedFilename()
    const filePath = join(downloadDir, suggestedFilename)
    await download.saveAs(filePath)
    const { stat } = await import('fs/promises')
    const stats = await stat(filePath)
    await prisma.fileAsset.create({
      data: {
        companyId: jobRun.companyId,
        jobRunId,
        filename: suggestedFilename,
        originalName: suggestedFilename,
        mimeType: 'application/octet-stream',
        size: stats.size,
        storageKey: `${jobRun.companyId}/downloads/${jobRunId}/${suggestedFilename}`,
      },
    })
  }
}
