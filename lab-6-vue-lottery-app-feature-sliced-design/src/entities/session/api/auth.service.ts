import { http } from '@/shared/api/'
import type { AuthResponse } from '../model/types'

export class AuthService {
  login(username: string, password: string): Promise<AuthResponse> {
    return http<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  refresh(refreshToken: string): Promise<AuthResponse> {
    return http<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
    })
  }
}
