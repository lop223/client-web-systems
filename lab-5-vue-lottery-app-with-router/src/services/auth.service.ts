import { http } from '@/api/httpClient'
import type { User } from '@/types/user'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export type AuthUser = Pick<
  AuthResponse,
  'id' | 'username' | 'email' | 'firstName' | 'lastName' | 'gender' | 'image'
>

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
