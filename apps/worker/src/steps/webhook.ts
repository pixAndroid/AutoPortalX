import axios from 'axios'
import type { WebhookConfig } from '@autoflowx/common'

export async function webhook(config: WebhookConfig): Promise<unknown> {
  const { url, method, headers, body } = config
  const response = await axios.request({
    url,
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    data: body,
    timeout: 30000,
  })
  return response.data
}
