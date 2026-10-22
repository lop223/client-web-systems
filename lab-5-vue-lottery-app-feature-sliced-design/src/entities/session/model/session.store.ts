import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { AuthService } from '../index'
import type { AuthResponse, AuthUser } from './types'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'authUser'

function readStoredUser(): AuthUser | null {
  const value = localStorage.getItem(USER_KEY)
  if (!value) return null

  try {
    return JSON.parse(value) as AuthUser
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export const useSessionStore = defineStore('session', () => {
  const accessToken = ref<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY))
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY))
  const user = ref<AuthUser | null>(readStoredUser())
  const isAuthenticated = computed(() => Boolean(accessToken.value && user.value))

  const getService = () => ServiceProvider.get<AuthService>('auth');

  const setSession = (response: AuthResponse): void => {
    accessToken.value = response.accessToken
    refreshToken.value = response.refreshToken
    user.value = {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      gender: response.gender,
      image: response.image,
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken)
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  const clearSession = (): void => {
    accessToken.value = null
    refreshToken.value = null
    user.value = null

    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const login = async (username: string, password: string): Promise<void> => {
    const response = await getService().login(username, password)
    setSession(response)
  }

  const refreshAccessToken = async (): Promise<string> => {
    if (!refreshToken.value) {
      clearSession()
      throw new Error('Немає refresh-токена. Увійдіть знову.')
    }

    try {
      const response = await getService().refresh(refreshToken.value)
      setSession(response)
      return response.accessToken
    } catch (cause: unknown) {
      clearSession()
      throw cause
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setSession,
    clearSession,
    login,
    refreshAccessToken,
  }
})
