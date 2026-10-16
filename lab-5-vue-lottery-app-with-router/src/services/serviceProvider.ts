import { UserService } from './user.service'
import { AuthService } from './auth.service'
import type { un } from 'vue-router/dist/index-u4XkZVDG.js'

export class ServiceProvider {
  private static userService: UserService | undefined
  private static authService: AuthService | undefined

  static get users(): UserService {
    this.userService ??= new UserService()
    return this.userService
  }

  static get auth(): AuthService {
    this.authService ??= new AuthService()
    return this.authService
  }
}
