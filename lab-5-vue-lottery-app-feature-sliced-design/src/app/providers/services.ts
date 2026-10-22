import { AuthService } from '@/entities/session'
import { UserService } from '@/entities/user'
import { configureHttpAuth, ServiceProvider } from '@/shared/api'
import { useAuthStore } from '@/entities/session/model/auth.store'
import { pinia } from '@/stores/pinia'

export function registerServices(): void {
  ServiceProvider.register('users', () => new UserService())
  ServiceProvider.register('auth', () => new AuthService())

  configureHttpAuth({
    getAccessToken: () => useAuthStore(pinia).accessToken,
    refreshAccessToken: () => useAuthStore(pinia).refreshAccessToken(),
  })
}
