export interface ApiResponse<T = unknown> {
  data?: T
  error?: string | { message: string; field?: string }[]
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum MemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  companyId: string | null
  iat?: number
  exp?: number
}

export enum StepType {
  OPEN_URL = 'OPEN_URL',
  LOGIN = 'LOGIN',
  FILL_INPUT = 'FILL_INPUT',
  CLICK = 'CLICK',
  SELECT_DROPDOWN = 'SELECT_DROPDOWN',
  UPLOAD_FILE = 'UPLOAD_FILE',
  DOWNLOAD_FILE = 'DOWNLOAD_FILE',
  WAIT_SELECTOR = 'WAIT_SELECTOR',
  EXTRACT_TEXT = 'EXTRACT_TEXT',
  SCREENSHOT = 'SCREENSHOT',
  SEND_EMAIL = 'SEND_EMAIL',
  WEBHOOK = 'WEBHOOK',
}

export enum JobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum StepStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

export enum TriggerSource {
  MANUAL = 'MANUAL',
  SCHEDULE = 'SCHEDULE',
  API = 'API',
  WEBHOOK = 'WEBHOOK',
}

export enum NotificationType {
  JOB_COMPLETED = 'JOB_COMPLETED',
  JOB_FAILED = 'JOB_FAILED',
  TEAM_INVITE = 'TEAM_INVITE',
  SYSTEM = 'SYSTEM',
}

export interface WorkflowStep {
  id: string
  stepType: StepType
  config: Record<string, unknown>
  order: number
}

export interface OpenUrlConfig {
  url: string
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle'
}

export interface LoginConfig {
  usernameSelector: string
  passwordSelector: string
  submitSelector: string
  username?: string
  password?: string
  portalAccountId?: string
}

export interface FillInputConfig {
  selector: string
  value: string
  clearFirst?: boolean
}

export interface ClickConfig {
  selector: string
  waitAfter?: number
}

export interface SelectDropdownConfig {
  selector: string
  value: string
  byText?: boolean
}

export interface UploadFileConfig {
  selector: string
  filePath: string
}

export interface DownloadFileConfig {
  selector?: string
  url?: string
  filename?: string
}

export interface WaitSelectorConfig {
  selector: string
  timeout?: number
  state?: 'visible' | 'hidden' | 'attached' | 'detached'
}

export interface ExtractTextConfig {
  selector: string
  attribute?: string
  outputVar?: string
}

export interface ScreenshotConfig {
  fullPage?: boolean
  selector?: string
}

export interface SendEmailConfig {
  to: string
  subject: string
  body: string
  attachments?: string[]
}

export interface WebhookConfig {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: Record<string, unknown>
}

export interface WorkflowJobData {
  workflowId: string
  companyId: string
  triggeredBy: TriggerSource
  timestamp: string
}
