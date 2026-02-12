import type { ServiceDTO } from '@/api/generated'
import type { BaseState } from '../base.types'

export interface ServiceState extends BaseState {
  services: ServiceDTO[] | null
  pageSize: number
  pageNum: number
  totalItems: number
  totalPages: number
}
