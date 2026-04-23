import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  attachments?: { filename: string; path: string }[]
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@autoflowx.com',
    ...options,
  })
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`
  await sendEmail({
    to: email,
    subject: 'Reset Your AutoFlowX Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  })
}

export async function sendJobNotificationEmail(
  email: string,
  jobId: string,
  workflowName: string,
  status: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Job ${status}: ${workflowName}`,
    html: `
      <h2>Job ${status}</h2>
      <p>Your workflow <strong>${workflowName}</strong> has ${status.toLowerCase()}.</p>
      <p>Job ID: ${jobId}</p>
      <a href="${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'}/jobs/${jobId}">View Job Details</a>
    `,
  })
}
