import { Page } from 'playwright'

export async function smartWait(page: Page, ms: number): Promise<void> {
  await page.waitForTimeout(ms)
}

export async function waitForNavigation(page: Page, timeout = 30000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout })
}

export async function waitForSelector(
  page: Page,
  selector: string,
  options: { timeout?: number; state?: 'visible' | 'hidden' | 'attached' | 'detached' } = {}
): Promise<void> {
  await page.waitForSelector(selector, { timeout: options.timeout || 30000, state: options.state || 'visible' })
}

export async function retryAction<T>(
  action: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await action()
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise((r) => setTimeout(r, delay * Math.pow(2, i)))
    }
  }
  throw new Error('Max retries exceeded')
}
