import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { join, extname } from 'path'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_PATH = process.env.STORAGE_PATH || './uploads'

export function ensureStorageDir(subDir = '') {
  const dir = join(STORAGE_PATH, subDir)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

export function generateStorageKey(originalName: string, companyId: string): string {
  const ext = extname(originalName)
  const id = uuidv4()
  return `${companyId}/${id}${ext}`
}

export async function saveFile(
  buffer: Buffer,
  storageKey: string
): Promise<string> {
  const parts = storageKey.split('/')
  const dir = ensureStorageDir(parts.slice(0, -1).join('/'))
  const filePath = join(STORAGE_PATH, storageKey)
  const { writeFile } = await import('fs/promises')
  await writeFile(filePath, buffer)
  return filePath
}

export function getFilePath(storageKey: string): string {
  return join(STORAGE_PATH, storageKey)
}

export async function deleteFile(storageKey: string): Promise<void> {
  const { unlink } = await import('fs/promises')
  const filePath = getFilePath(storageKey)
  if (existsSync(filePath)) await unlink(filePath)
}
