export interface Approval {
  process_id: string
  status: ApprovalStatus
  reason: string
}

export type ApprovalStatus = 'approved' | 'declined'

export interface ApprovalWorkflows {
  approval_request: ApprovalRequest
  approval_processes: ApprovalProcess[]
  is_auth_user_in_approvers: boolean
  approver: ApprovalProcess
}

export interface ApprovalRequest {
  id: string
  module_id: string
  admin_id: string
  name: string
  image: string
  model_id: string
  reason: string
  content: string
  approval_status: string
  workflow_type: string
}

export interface ApprovalProcess {
  process_id: string
  approval_request_id: string
  admin_id: string
  name: string
  avatar: string
  level: number
  comment: string
  reason: string
  level_name: string
  status: string
  is_auth_user_approver: boolean
  can_approve: string
  updated_at: string
}