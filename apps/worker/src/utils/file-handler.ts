import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

const STORAGE_PATH = process.env.STORAGE_PATH || './uploads'

export function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

export function getDownloadDir(companyId: string, jobRunId: string): string {
  const dir = join(STORAGE_PATH, companyId, 'downloads', jobRunId)
  ensureDir(dir)
  return dir
}

export function getScreenshotDir(companyId: string, jobRunId: string): string {
  const dir = join(STORAGE_PATH, companyId, 'screenshots', jobRunId)
  ensureDir(dir)
  return dir
}
