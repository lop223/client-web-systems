import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/services/serviceProvider'
import type { AuthUser } from '@/services/auth.service'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'authUser'

function readUser(): AuthUser | null {
  const value = localStorage.getItem(USER_KEY)
  if (!value) return null

  try {
    return JSON.parse(value) as AuthUser
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem(ACCESS_TOKEN_KEY))
  const refreshToken = ref(localStorage.getItem(REFRESH_TOKEN_KEY))
  const user = ref<AuthUser | null>(readUser())
  const isAuthenticated = computed(() => Boolean(accessToken.value && user.value))

  async function login(username: string, password: string) {
    const result = await ServiceProvider.auth.login(username, password)

    accessToken.value = result.accessToken
    refreshToken.value = result.refreshToken
    user.value = {
      id: result.id,
      username: result.username,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      gender: result.gender,
      image: result.image,
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken)
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  function setAccessToken(token: string) {
    accessToken.value = token
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }

  async function refreshAccessToken(): Promise<string> {
    if (!refreshToken.value) {
      logout()
      throw new Error('Немає refresh-токена. Увійдіть знову.')
    }

    try {
      const result = await ServiceProvider.auth.refresh(refreshToken.value)
      setAccessToken(result.accessToken)

      if (result.refreshToken) {
        refreshToken.value = result.refreshToken
        localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken)
      }

      return result.accessToken
    } catch (error) {
      logout()
      throw error
    }
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null

    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    login,
    logout,
    refreshAccessToken,
  }
})