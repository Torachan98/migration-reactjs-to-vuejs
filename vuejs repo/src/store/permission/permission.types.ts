import { type PermissionDTO } from '@/api/generated'
import type { BaseState } from '../base.types'

export interface PermissionState extends BaseState {
  permissions: PermissionDTO[] | null
  pageSize: number
  pageNum: number
  totalItems: number
  totalPages: number
}
