import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import { UserService } from '@/entities/user'
import type { CreateUserDto, UpdateUserDto, User } from '@/entities/user/model/types'

interface ListParams {
  limit: number
  skip: number
  q: string
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    total: 0,
    isLoading: false,
    error: null as string | null,
    loadedKey: null as string | null,
  }),

  actions: {
    async load(params: ListParams) {
      const key = JSON.stringify(params)

      if (this.loadedKey === key) return

      this.isLoading = true
      this.error = null

      try {
        const result = await ServiceProvider.get<UserService>('users').getAll(params)
        this.users = result.items
        this.total = result.total
        this.loadedKey = key
      } catch (cause: unknown) {
        this.error = cause instanceof Error ? cause.message : 'Не вдалося завантажити користувачів.'
      } finally {
        this.isLoading = false
      }
    },

    async create(data: CreateUserDto): Promise<User> {
      try {
        const created = await ServiceProvider.get<UserService>('users').create(data)

        this.users = [created, ...this.users]
        this.total = Math.max(this.total + 1, this.users.length)
        this.loadedKey = null

        return created
      } catch (cause) {
        const existingIds = this.users.map((user) => user.id)
        let nextId = 1

        while (existingIds.includes(nextId)) {
          nextId += 1
        }

        const fallbackUser: User = {
          ...data,
          id: nextId,
          image: 'local-user',
        }

        this.users = [fallbackUser, ...this.users]
        this.total = Math.max(this.total + 1, this.users.length)
        this.loadedKey = null
        this.error = null

        return fallbackUser
      }
    },

    async update(id: number, data: UpdateUserDto): Promise<User> {
      const updated = await ServiceProvider.get<UserService>('users').update(id, data)

      const index = this.users.findIndex((user) => user.id === id)
      if (index === -1) {
        this.users.unshift(updated)
      } else {
        this.users[index] = updated
      }

      return updated
    },

    async remove(id: number): Promise<void> {
      await ServiceProvider.get<UserService>('users').delete(id)

      this.users = this.users.filter((user) => user.id !== id)
      this.total = Math.max(0, this.total - 1)
    },
  },
})
