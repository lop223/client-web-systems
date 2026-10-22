import { AuthService } from '@/entities/session'
import { UserService } from '@/entities/user'
import { configureHttpAuth, ServiceProvider } from '@/shared/api'
import { useSessionStore } from '@/entities/session'
import { pinia } from '@/app/providers/pinia'

export function registerServices(): void {
  ServiceProvider.register('users', () => new UserService())
  ServiceProvider.register('auth', () => new AuthService())

  configureHttpAuth({
    getAccessToken: () => useSessionStore(pinia).accessToken,
    refreshAccessToken: () => useSessionStore(pinia).refreshAccessToken(),
  })
}
