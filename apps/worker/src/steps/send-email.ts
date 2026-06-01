import nodemailer from 'nodemailer'
import type { SendEmailConfig } from '@autoflowx/common'

export async function sendEmail(config: SendEmailConfig): Promise<void> {
  const { to, subject, body, attachments } = config
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@autoflowx.com',
    to,
    subject,
    html: body,
    attachments: attachments?.map((path) => ({ path })),
  })
}
