import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import {
  type AuthenticationTokenObjectResponseApiResponse,
  AuthService,
  type BooleanApiResponse,
  type SignInRequest,
  type StringApiResponse,
} from '@/api/generated'
import type { AuthInformation, AuthState } from './auth.types'

const initialState = (): AuthState => ({
  loading: false,
  error: null,
  token: '',
  step: 0,
  userToken: null,
})

export const useAuthStore = defineStore('auth', {
  state: initialState,

  actions: {
    async signIn(payload: SignInRequest): Promise<AuthenticationTokenObjectResponseApiResponse> {
      this.loading = true
      this.error = null

      try {
        const res = await AuthService.postApiAuthSignin({
          requestBody: payload,
        })

        if (res.isSuccess) {
          const accessToken = res.data?.item?.accessToken ?? ''

          this.token = accessToken
          this.step = res.data?.item?.step ?? 0
          this.userToken = accessToken ? jwtDecode<AuthInformation>(accessToken) : null
        }

        this.error = res.message ?? null
        return res
      } catch (e) {
        this.error = 'Cannot POST /api/auth/signin'
        throw e
      } finally {
        this.loading = false
      }
    },

    async renewToken(): Promise<StringApiResponse> {
      this.loading = true
      this.error = null

      try {
        const res = await AuthService.postApiAuthRenewToken()

        if (res.isSuccess && res.data) {
          this.token = res.data
          this.userToken = jwtDecode<AuthInformation>(res.data)
        } else {
          this.token = ''
          this.userToken = null
        }

        return res
      } catch (e) {
        this.error = 'Cannot POST /api/auth/renew-token'
        throw e
      } finally {
        this.loading = false
      }
    },

    async resendOtp(guid: string): Promise<BooleanApiResponse> {
      this.loading = true
      this.error = null

      try {
        const res = await AuthService.postApiAuthReSentOtp({
          requestBody: guid,
        })

        this.error = res.message ?? null
        return res
      } catch (e) {
        this.error = 'Cannot POST /api/auth/re-sent-otp'
        throw e
      } finally {
        this.loading = false
      }
    },

    async signOut(): Promise<BooleanApiResponse> {
      this.loading = true
      this.error = null

      try {
        const res = await AuthService.postApiAuthSignout()

        if (res.isSuccess) {
          Object.assign(this, initialState())
        }

        return res
      } catch (e) {
        this.error = 'Cannot POST /api/auth/signout'
        throw e
      } finally {
        this.loading = false
      }
    },

    getAccessToken() {
      return this.token
    },

    async refreshToken(): Promise<boolean> {
      const res = await AuthService.postApiAuthRenewToken()
      this.token = res.data ?? ''

      if (res.data !== '') {
        this.userToken = res.data ? jwtDecode<AuthInformation>(res.data) : null
      }

      return res.isSuccess ?? false
    },
  },
})
