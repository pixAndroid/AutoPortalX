import { Job } from 'bullmq'
import { prisma } from '@autoflowx/db'
import { StepType } from '@autoflowx/common'
import { BrowserManager } from './utils/browser'
import { openUrl } from './steps/open-url'
import { login } from './steps/login'
import { fillInput } from './steps/fill-input'
import { clickElement } from './steps/click'
import { selectDropdown } from './steps/select-dropdown'
import { uploadFile } from './steps/upload-file'
import { downloadFile } from './steps/download-file'
import { waitSelector } from './steps/wait-selector'
import { extractText } from './steps/extract-text'
import { takeScreenshot } from './steps/screenshot'
import { sendEmail } from './steps/send-email'
import { webhook } from './steps/webhook'

export async function processWorkflowJob(job: Job): Promise<void> {
  const { workflowId, companyId } = job.data

  const jobRun = await prisma.jobRun.create({
    data: {
      workflowId,
      companyId,
      status: 'RUNNING',
      triggerSource: job.data.triggeredBy || 'MANUAL',
      startedAt: new Date(),
    },
  })

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    include: {
      workflowSteps: {
        orderBy: { order: 'asc' },
        where: { isActive: true },
      },
    },
  })

  if (!workflow) {
    await prisma.jobRun.update({
      where: { id: jobRun.id },
      data: { status: 'FAILED', errorReason: 'Workflow not found', completedAt: new Date() },
    })
    throw new Error('Workflow not found')
  }

  const browserManager = new BrowserManager()
  const browser = await browserManager.launch()
  const page = await browser.newPage()

  try {
    for (const step of workflow.workflowSteps) {
      const stepLog = await prisma.jobStepLog.create({
        data: {
          jobRunId: jobRun.id,
          stepIndex: step.order,
          stepType: step.stepType,
          status: 'RUNNING',
          startedAt: new Date(),
        },
      })

      try {
        const config = step.config as any

        switch (step.stepType as StepType) {
          case StepType.OPEN_URL:
            await openUrl(page, config)
            break
          case StepType.LOGIN:
            await login(page, config)
            break
          case StepType.FILL_INPUT:
            await fillInput(page, config)
            break
          case StepType.CLICK:
            await clickElement(page, config)
            break
          case StepType.SELECT_DROPDOWN:
            await selectDropdown(page, config)
            break
          case StepType.UPLOAD_FILE:
            await uploadFile(page, config)
            break
          case StepType.DOWNLOAD_FILE:
            await downloadFile(page, config, jobRun.id)
            break
          case StepType.WAIT_SELECTOR:
            await waitSelector(page, config)
            break
          case StepType.EXTRACT_TEXT:
            await extractText(page, config)
            break
          case StepType.SCREENSHOT:
            await takeScreenshot(page, config, jobRun.id)
            break
          case StepType.SEND_EMAIL:
            await sendEmail(config)
            break
          case StepType.WEBHOOK:
            await webhook(config)
            break
          default:
            console.warn(`Unknown step type: ${step.stepType}`)
        }

        await prisma.jobStepLog.update({
          where: { id: stepLog.id },
          data: { status: 'COMPLETED', completedAt: new Date() },
        })
      } catch (stepError: any) {
        await prisma.jobStepLog.update({
          where: { id: stepLog.id },
          data: { status: 'FAILED', message: stepError.message, completedAt: new Date() },
        })
        throw stepError
      }
    }

    const completedAt = new Date()
    await prisma.jobRun.update({
      where: { id: jobRun.id },
      data: {
        status: 'COMPLETED',
        completedAt,
        duration: completedAt.getTime() - (jobRun.startedAt?.getTime() || completedAt.getTime()),
      },
    })

    const company = await prisma.company.findUnique({ where: { id: companyId } })
    if (company?.notificationEmail) {
      const { sendJobNotificationEmail } = await import('../../../apps/api/lib/email').catch(() => ({ sendJobNotificationEmail: null }))
      if (sendJobNotificationEmail) {
        await sendJobNotificationEmail(company.notificationEmail, jobRun.id, workflow.name, 'COMPLETED').catch(console.error)
      }
    }
  } catch (error: any) {
    const completedAt = new Date()
    await prisma.jobRun.update({
      where: { id: jobRun.id },
      data: {
        status: 'FAILED',
        completedAt,
        errorReason: error.message,
        duration: completedAt.getTime() - (jobRun.startedAt?.getTime() || completedAt.getTime()),
      },
    })
    throw error
  } finally {
    await browserManager.close()
  }
}
