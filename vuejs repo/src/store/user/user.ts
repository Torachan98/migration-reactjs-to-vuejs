import { defineStore } from 'pinia'
import type {
  BooleanApiResponse,
  CreateOrUpdateUserRequest,
  UserDTOApiResponse,
  UserDTOPaginationItemsApiResponse,
} from '@/api/generated'
import { UserService } from '@/api/generated'
import type { FetchParams } from '../base.types'
import type { UserDTO } from '@/api/generated'
import { Step } from './user.types'
import type { UserState } from './user.types'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    loading: false,
    users: null,
    user: null,
    step: Step.Init,
    error: null,
    pageSize: 10,
    pageNum: 1,
    totalItems: 0,
    totalPages: 0,
  }),

  actions: {
    setUser(user: UserDTO): void {
      this.user = user
    },

    async fetchUsers(query: FetchParams): Promise<UserDTOPaginationItemsApiResponse> {
      this.loading = true
      this.error = null

      try {
        const res = await UserService.getApiUser(query)

        if (res.isSuccess) {
          this.users = res.data?.items ?? []
          this.pageNum = res.data?.pageNum ?? 1
          this.pageSize = res.data?.pageSize ?? 10
          this.totalPages = res.data?.totalPage ?? 0
          this.totalItems = res.data?.totalCount ?? 0
        }

        this.error = res.message ?? ''
        return res
      } catch {
        this.error = 'Cannot GET /api/User'
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },

    async fetchUserById(id: string): Promise<UserDTOApiResponse> {
      this.loading = true
      this.error = null

      try {
        const res = await UserService.getUserById({ id })

        if (res.isSuccess) {
          this.user = res.data ?? null
        }

        this.error = res.message ?? ''
        return res
      } catch {
        this.error = 'Cannot GET /api/GetUserById'
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },

    async createUser(payload: CreateOrUpdateUserRequest): Promise<UserDTOApiResponse> {
      this.loading = true
      this.error = null

      try {
        const res = await UserService.postApiUser({
          requestBody: payload,
        })

        if (res.isSuccess) {
          this.user = res.data ?? null
        }

        this.error = res.message ?? ''
        return res
      } catch {
        this.error = 'Cannot POST /api/CreateUser'
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },

    async updateUser(payload: CreateOrUpdateUserRequest): Promise<UserDTOApiResponse> {
      this.loading = true
      this.error = null

      try {
        const res = await UserService.putApiUser({
          requestBody: payload,
        })

        if (res.isSuccess) {
          this.user = res.data ?? null
        }

        this.error = res.message ?? ''
        return res
      } catch {
        this.error = 'Cannot PUT /api/UpdateUser'
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: string): Promise<BooleanApiResponse> {
      this.loading = true
      this.error = null

      try {
        const res = await UserService.deleteApiUser({ guid: id })

        this.error = res.message ?? ''
        return res
      } catch {
        this.error = 'Cannot DELETE /api/RemoveUser'
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },
  },
})
