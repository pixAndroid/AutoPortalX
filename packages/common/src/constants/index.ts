import { StepType, UserRole, MemberRole } from '../types'

export const STEP_TYPE_LABELS: Record<StepType, string> = {
  [StepType.OPEN_URL]: 'Open URL',
  [StepType.LOGIN]: 'Login',
  [StepType.FILL_INPUT]: 'Fill Input',
  [StepType.CLICK]: 'Click Element',
  [StepType.SELECT_DROPDOWN]: 'Select Dropdown',
  [StepType.UPLOAD_FILE]: 'Upload File',
  [StepType.DOWNLOAD_FILE]: 'Download File',
  [StepType.WAIT_SELECTOR]: 'Wait for Selector',
  [StepType.EXTRACT_TEXT]: 'Extract Text',
  [StepType.SCREENSHOT]: 'Take Screenshot',
  [StepType.SEND_EMAIL]: 'Send Email',
  [StepType.WEBHOOK]: 'HTTP Webhook',
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.MEMBER]: 0,
  [UserRole.ADMIN]: 1,
  [UserRole.SUPER_ADMIN]: 2,
}

export const MEMBER_ROLE_HIERARCHY: Record<MemberRole, number> = {
  [MemberRole.VIEWER]: 0,
  [MemberRole.MEMBER]: 1,
  [MemberRole.ADMIN]: 2,
  [MemberRole.OWNER]: 3,
}

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const JOB_STATUS_COLORS = {
  PENDING: 'yellow',
  RUNNING: 'blue',
  COMPLETED: 'green',
  FAILED: 'red',
  CANCELLED: 'gray',
} as const

export const COOKIE_NAME = 'autoflowx_token'
export const API_KEY_PREFIX = 'afx_'
