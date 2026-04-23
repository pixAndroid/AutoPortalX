import { Queue } from 'bullmq'
import IORedis from 'ioredis'

export const redis = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

export const workflowQueue = new Queue('workflow-jobs', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 500,
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  },
})

export async function enqueueWorkflow(
  workflowId: string,
  companyId: string,
  triggeredBy: string
) {
  return workflowQueue.add('run-workflow', {
    workflowId,
    companyId,
    triggeredBy,
    timestamp: new Date().toISOString(),
  })
}
