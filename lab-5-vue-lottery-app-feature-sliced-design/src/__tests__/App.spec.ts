import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUsersStore } from '@/entities/user/model/users.store'
import { ServiceProvider } from '@/shared/api'
import { UserService } from '@/entities/user'

describe('users store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('creates a user locally when the backend request fails', async () => {
    const service = ServiceProvider.get<UserService>('users')
    vi.spyOn(service, 'create').mockRejectedValue(new Error('Server unavailable'))

    const store = useUsersStore()
    store.users = []
    store.total = 0

    const created = await store.create({
      firstName: 'Anna',
      lastName: 'Petrenko',
      email: 'anna@example.com',
      username: 'anna',
      password: 'secret123',
      age: 28,
      gender: 'female',
      phone: '+380991234567',
    })

    expect(created.id).toBeGreaterThan(0)
    expect(store.users[0]?.email).toBe('anna@example.com')
    expect(store.total).toBe(1)
  })
})
