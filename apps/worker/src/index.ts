import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import { prisma } from '@autoflowx/db'
import { processWorkflowJob } from './processor'
import os from 'os'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const HOSTNAME = os.hostname()
const CONCURRENCY = Number(process.env.WORKER_CONCURRENCY || '3')

const redis = new IORedis(REDIS_URL, { maxRetriesPerRequest: null })

const worker = new Worker(
  'workflow-jobs',
  async (job) => {
    console.log(`[Worker] Processing job ${job.id}: workflowId=${job.data.workflowId}`)
    await processWorkflowJob(job)
    console.log(`[Worker] Completed job ${job.id}`)
  },
  {
    connection: redis,
    concurrency: CONCURRENCY,
  }
)

worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully`)
})

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err.message)
})

worker.on('error', (err) => {
  console.error('[Worker] Worker error:', err)
})

async function registerWorkerNode() {
  await prisma.workerNode.upsert({
    where: { id: HOSTNAME },
    update: { status: 'ONLINE', lastHeartbeat: new Date(), metadata: { concurrency: CONCURRENCY, pid: process.pid } },
    create: {
      id: HOSTNAME,
      hostname: HOSTNAME,
      status: 'ONLINE',
      lastHeartbeat: new Date(),
      metadata: { concurrency: CONCURRENCY, pid: process.pid },
    },
  })
}

async function sendHeartbeat() {
  const activeJobs = await worker.getActiveCount?.() ?? 0
  await prisma.workerNode.update({
    where: { id: HOSTNAME },
    data: {
      lastHeartbeat: new Date(),
      activeJobs,
      status: activeJobs > 0 ? 'BUSY' : 'ONLINE',
    },
  }).catch(() => {})
}

async function shutdown() {
  console.log('[Worker] Shutting down...')
  await worker.close()
  await prisma.workerNode.update({
    where: { id: HOSTNAME },
    data: { status: 'OFFLINE' },
  }).catch(() => {})
  await prisma.$disconnect()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

registerWorkerNode()
  .then(() => {
    console.log(`[Worker] Started on ${HOSTNAME} with concurrency ${CONCURRENCY}`)
    setInterval(sendHeartbeat, 30000)
  })
  .catch(console.error)
