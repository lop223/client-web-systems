import { ref } from 'vue'
import { defineStore } from 'pinia'

import { ServiceProvider } from '@/shared/api'
import { UserService } from '../index'
import type { CreateUserDto, UpdateUserDto, User } from '../index'

interface UsersQuery {
  limit: number
  skip: number
  q: string
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const loadedKey = ref<string | null>(null)

  const getService = (): UserService => ServiceProvider.get<UserService>('users')

  const fetchUsers = async (params: UsersQuery): Promise<void> => {
    const key = JSON.stringify(params)
    if (loadedKey.value === key) return

    isLoading.value = true
    error.value = null

    try {
      const result = await getService().getAll(params)
      users.value = result.items
      total.value = result.total
      loadedKey.value = key
    } catch (cause: unknown) {
      error.value = cause instanceof Error ? cause.message : 'Не вдалося завантажити користувачів.'
    } finally {
      isLoading.value = false
    }
  }

  const fetchUser = async (id: number): Promise<User> => {
    isLoading.value = true
    error.value = null

    try {
      const user = await getService().getById(id)
      currentUser.value = user
      return user
    } catch (cause: unknown) {
      error.value = cause instanceof Error ? cause.message : 'Не вдалося завантажити користувача.'
      throw cause
    } finally {
      isLoading.value = false
    }
  }

  const createUser = async (data: CreateUserDto): Promise<User> => {
    error.value = null

    try {
      const created = await getService().create(data)
      users.value = [created, ...users.value]
      total.value = Math.max(total.value + 1, users.value.length)
      loadedKey.value = null
      return created
    } catch (cause: unknown) {
      error.value = cause instanceof Error ? cause.message : 'Не вдалося створити користувача.'
      throw cause
    }
  }

  const updateUser = async (id: number, data: UpdateUserDto): Promise<User> => {
    error.value = null

    try {
      const updated = await getService().update(id, data)
      const index = users.value.findIndex((user) => user.id === id)

      if (index !== -1) {
        users.value[index] = updated
      }

      if (currentUser.value?.id === id) {
        currentUser.value = updated
      }

      return updated
    } catch (cause: unknown) {
      error.value = cause instanceof Error ? cause.message : 'Не вдалося оновити користувача.'
      throw cause
    }
  }

  const removeUser = async (id: number): Promise<void> => {
    error.value = null

    try {
      await getService().delete(id)
      users.value = users.value.filter((user) => user.id !== id)
      total.value = Math.max(0, total.value - 1)

      if (currentUser.value?.id === id) {
        currentUser.value = null
      }
    } catch (cause: unknown) {
      error.value = cause instanceof Error ? cause.message : 'Не вдалося видалити користувача.'
      throw cause
    }
  }

  return {
    users,
    currentUser,
    total,
    isLoading,
    error,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    removeUser,
  }
})
